import { DEFAULT_AI_NEWS_MAX_ITEMS, DEFAULT_AI_NEWS_MAX_STALE_MS } from '@lensing/types';
const PLUGIN_ID = 'ai-news-server';
const DATA_BUS_CHANNEL = 'ai-news.summaries';
/** Articles older than this are skipped while fresher ones are available */
const MAX_ARTICLE_AGE_MS = 48 * 3_600_000;
// ── RSS Parsing (subset from news-server) ───────────────────────────────────
function stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
}
function decodeEntities(str) {
    return str
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&#149;/g, '•')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#\d+;/g, (m) => String.fromCharCode(parseInt(m.slice(2, -1))))
        .replace(/&amp;/g, '&');
}
function extractTag(xml, tag) {
    const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
    return match ? match[1].trim() : '';
}
function extractCdata(str) {
    const match = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    return match ? match[1] : str;
}
function parseDate(pubDate) {
    if (!pubDate)
        return Date.now();
    const ts = Date.parse(pubDate);
    return Number.isFinite(ts) ? ts : Date.now();
}
function parseChannelTitle(xml) {
    const channelMatch = xml.match(/<channel[^>]*>([\s\S]*?)<\/channel>/i);
    if (!channelMatch)
        return '';
    const channelContent = channelMatch[1];
    const beforeFirstItem = channelContent.split(/<item/i)[0];
    return decodeEntities(extractCdata(extractTag(beforeFirstItem, 'title'))).trim();
}
function parseItems(xml, feedUrl, category, source) {
    const items = [];
    const itemPattern = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let match;
    let index = 0;
    while ((match = itemPattern.exec(xml)) !== null) {
        const itemXml = match[1];
        const title = decodeEntities(extractCdata(extractTag(itemXml, 'title')));
        const rawDesc = extractCdata(extractTag(itemXml, 'description'));
        const description = stripHtml(decodeEntities(rawDesc)).trim();
        const link = extractCdata(extractTag(itemXml, 'link')).trim() || extractTag(itemXml, 'guid').trim();
        const guid = extractCdata(extractTag(itemXml, 'guid')).trim();
        const pubDate = extractCdata(extractTag(itemXml, 'pubDate'));
        // Key by guid/link so a story keeps its id when newer items push it down the feed
        const key = guid || link || String(index);
        index++;
        items.push({
            id: `${feedUrl}#${key}`,
            title,
            description,
            link,
            published: parseDate(pubDate),
            source,
            category,
        });
    }
    return items;
}
function parseRss(xml, feedUrl, category) {
    const channelTitle = parseChannelTitle(xml) || feedUrl;
    const articles = parseItems(xml, feedUrl, category, channelTitle);
    return { title: channelTitle, articles };
}
// ── Defensive copies ──────────────────────────────────────────────────────────
function copySummary(s) {
    return { ...s };
}
function copyData(d) {
    return {
        summaries: d.summaries.map(copySummary),
        lastUpdated: d.lastUpdated,
    };
}
// ── Factory ───────────────────────────────────────────────────────────────────
export function createAiNewsServer(options) {
    const { feedUrls, categories = {}, dataBus, summarize, maxStale_ms = DEFAULT_AI_NEWS_MAX_STALE_MS, fetchFn, } = options;
    const maxItems = options.maxItems ?? DEFAULT_AI_NEWS_MAX_ITEMS;
    if (!feedUrls || feedUrls.length === 0) {
        throw new Error('AiNewsServer: feedUrls is required and must not be empty');
    }
    if (!summarize) {
        throw new Error('AiNewsServer: summarize function is required');
    }
    if (!Number.isFinite(maxItems) || maxItems < 1) {
        throw new Error(`AiNewsServer: maxItems must be a positive number, got ${maxItems}`);
    }
    const effectiveFetch = (fetchFn ?? fetch);
    let lastData = null;
    let lastFetchedAt = null;
    let closed = false;
    let refreshing = false;
    const updateListeners = [];
    const errorListeners = [];
    function notifyUpdate(data) {
        for (const cb of [...updateListeners]) {
            try {
                cb(data);
            }
            catch {
                // isolate listener errors
            }
        }
    }
    function notifyError(message) {
        for (const cb of [...errorListeners]) {
            try {
                cb(message);
            }
            catch {
                // isolate listener errors
            }
        }
    }
    async function fetchFeed(url) {
        let response;
        try {
            response = await effectiveFetch(url);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            notifyError(`AI News fetch failed: ${message}`);
            return null;
        }
        if (!response.ok) {
            notifyError(`AI News feed error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`);
            return null;
        }
        let xml;
        try {
            xml = await response.text();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            notifyError(`AI News body read failed: ${message}`);
            return null;
        }
        const category = categories[url] ?? 'general';
        const { articles } = parseRss(xml, url, category);
        return articles;
    }
    async function refresh() {
        if (closed)
            return;
        if (refreshing)
            return;
        if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
            return;
        }
        refreshing = true;
        const startedAt = Date.now();
        try {
            // 1. Fetch all RSS feeds, one queue per feed URL
            const fetchedQueues = [];
            for (const url of feedUrls) {
                const articles = await fetchFeed(url);
                if (articles !== null)
                    fetchedQueues.push(articles);
            }
            if (fetchedQueues.length === 0)
                return;
            // 2. Skip stale articles, unless nothing fresh came back at all
            const cutoff = startedAt - MAX_ARTICLE_AGE_MS;
            const freshQueues = fetchedQueues.map((q) => q.filter((a) => a.published >= cutoff));
            const feedQueues = freshQueues.some((q) => q.length > 0) ? freshQueues : fetchedQueues;
            // 3. Interleave articles across feeds so each feed gets fair representation,
            // then trim to maxItems. Without this, the first feed's articles dominate.
            // Grouped by feed URL, not channel title: all BBC feeds are titled "BBC News".
            const interleaved = [];
            let round = 0;
            while (interleaved.length < maxItems) {
                let added = false;
                for (const queue of feedQueues) {
                    if (round < queue.length) {
                        interleaved.push(queue[round]);
                        added = true;
                        if (interleaved.length >= maxItems)
                            break;
                    }
                }
                if (!added)
                    break;
                round++;
            }
            const trimmed = interleaved;
            // 4. Summarize via LLM
            let aiSummaries;
            try {
                aiSummaries = await summarize(trimmed.map((a) => ({ title: a.title, summary: a.description })));
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                notifyError(`AI summarization failed: ${message}`);
                return;
            }
            // 5. Build AiNewsSummary items
            const now = Date.now();
            const summaries = trimmed.map((article, i) => ({
                id: article.id,
                title: article.title,
                summary: aiSummaries[i] ?? article.description,
                link: article.link,
                published: article.published,
                source: article.source,
                category: article.category,
            }));
            lastData = { summaries: summaries.map(copySummary), lastUpdated: now };
            lastFetchedAt = startedAt;
            const publishData = {
                summaries: summaries.map(copySummary),
                lastUpdated: now,
            };
            dataBus.publish(DATA_BUS_CHANNEL, PLUGIN_ID, publishData);
            notifyUpdate(publishData);
        }
        finally {
            refreshing = false;
        }
    }
    return {
        refresh,
        getData() {
            if (!lastData)
                return null;
            return copyData(lastData);
        },
        onUpdate(callback) {
            updateListeners.push(callback);
            return () => {
                const idx = updateListeners.indexOf(callback);
                if (idx !== -1)
                    updateListeners.splice(idx, 1);
            };
        },
        onError(callback) {
            errorListeners.push(callback);
        },
        close() {
            closed = true;
        },
    };
}
//# sourceMappingURL=ai-news-server.js.map