import { DEFAULT_AI_NEWS_MAX_ITEMS, DEFAULT_AI_NEWS_MAX_STALE_MS } from '@lensing/types';
const PLUGIN_ID = 'ai-news-server';
const DATA_BUS_CHANNEL = 'ai-news.summaries';
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
        const pubDate = extractCdata(extractTag(itemXml, 'pubDate'));
        items.push({
            id: `${feedUrl}#${index++}`,
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
        try {
            // 1. Fetch all RSS feeds
            const allArticles = [];
            let anySuccess = false;
            for (const url of feedUrls) {
                const articles = await fetchFeed(url);
                if (articles !== null) {
                    allArticles.push(...articles);
                    anySuccess = true;
                }
            }
            if (!anySuccess)
                return;
            // 2. Interleave articles across feeds so each source gets fair representation,
            // then trim to maxItems. Without this, the first feed's articles dominate.
            const byFeed = new Map();
            for (const a of allArticles) {
                const key = a.source;
                if (!byFeed.has(key))
                    byFeed.set(key, []);
                byFeed.get(key).push(a);
            }
            const feedQueues = [...byFeed.values()];
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
            // 3. Summarize via LLM
            let aiSummaries;
            try {
                aiSummaries = await summarize(trimmed.map((a) => ({ title: a.title, summary: a.description })));
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                notifyError(`AI summarization failed: ${message}`);
                return;
            }
            // 4. Build AiNewsSummary items
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
            lastFetchedAt = now;
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