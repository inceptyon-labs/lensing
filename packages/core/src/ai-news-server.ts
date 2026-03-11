import type {
  AiNewsServerOptions,
  AiNewsServerInstance,
  AiNewsData,
  AiNewsSummary,
  AiNewsRssFetchFn,
  DataBusInstance,
} from '@lensing/types';
import { DEFAULT_AI_NEWS_MAX_ITEMS, DEFAULT_AI_NEWS_MAX_STALE_MS } from '@lensing/types';

const PLUGIN_ID = 'ai-news-server';
const DATA_BUS_CHANNEL = 'ai-news.summaries';

// ── RSS Parsing (subset from news-server) ───────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function decodeEntities(str: string): string {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].trim() : '';
}

function extractCdata(str: string): string {
  const match = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return match ? match[1] : str;
}

function parseDate(pubDate: string): number {
  if (!pubDate) return Date.now();
  const ts = Date.parse(pubDate);
  return Number.isFinite(ts) ? ts : Date.now();
}

function parseChannelTitle(xml: string): string {
  const channelMatch = xml.match(/<channel[^>]*>([\s\S]*?)<\/channel>/i);
  if (!channelMatch) return '';
  const channelContent = channelMatch[1];
  const beforeFirstItem = channelContent.split(/<item/i)[0];
  return decodeEntities(extractCdata(extractTag(beforeFirstItem, 'title'))).trim();
}

interface ParsedArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  published: number;
  source: string;
  category: string;
}

function parseItems(
  xml: string,
  feedUrl: string,
  category: string,
  source: string
): ParsedArticle[] {
  const items: ParsedArticle[] = [];
  const itemPattern = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = itemPattern.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = decodeEntities(extractCdata(extractTag(itemXml, 'title')));
    const rawDesc = extractCdata(extractTag(itemXml, 'description'));
    const description = stripHtml(decodeEntities(rawDesc)).trim();
    const link =
      extractCdata(extractTag(itemXml, 'link')).trim() || extractTag(itemXml, 'guid').trim();
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

function parseRss(
  xml: string,
  feedUrl: string,
  category: string
): { title: string; articles: ParsedArticle[] } {
  const channelTitle = parseChannelTitle(xml) || feedUrl;
  const articles = parseItems(xml, feedUrl, category, channelTitle);
  return { title: channelTitle, articles };
}

// ── Defensive copies ──────────────────────────────────────────────────────────

function copySummary(s: AiNewsSummary): AiNewsSummary {
  return { ...s };
}

function copyData(d: AiNewsData): AiNewsData {
  return {
    summaries: d.summaries.map(copySummary),
    lastUpdated: d.lastUpdated,
  };
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function createAiNewsServer(options: AiNewsServerOptions): AiNewsServerInstance {
  const {
    feedUrls,
    categories = {},
    dataBus,
    summarize,
    maxStale_ms = DEFAULT_AI_NEWS_MAX_STALE_MS,
    fetchFn,
  } = options;

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

  const effectiveFetch = (fetchFn ?? fetch) as unknown as AiNewsRssFetchFn;

  let lastData: AiNewsData | null = null;
  let lastFetchedAt: number | null = null;
  let closed = false;
  let refreshing = false;
  const updateListeners: Array<(data: AiNewsData) => void> = [];
  const errorListeners: Array<(error: string) => void> = [];

  function notifyUpdate(data: AiNewsData): void {
    for (const cb of [...updateListeners]) {
      try {
        cb(data);
      } catch {
        // isolate listener errors
      }
    }
  }

  function notifyError(message: string): void {
    for (const cb of [...errorListeners]) {
      try {
        cb(message);
      } catch {
        // isolate listener errors
      }
    }
  }

  async function fetchFeed(url: string): Promise<ParsedArticle[] | null> {
    let response: Awaited<ReturnType<AiNewsRssFetchFn>>;
    try {
      response = await effectiveFetch(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`AI News fetch failed: ${message}`);
      return null;
    }

    if (!response.ok) {
      notifyError(
        `AI News feed error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`
      );
      return null;
    }

    let xml: string;
    try {
      xml = await response.text();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`AI News body read failed: ${message}`);
      return null;
    }

    const category = categories[url] ?? 'general';
    const { articles } = parseRss(xml, url, category);
    return articles;
  }

  async function refresh(): Promise<void> {
    if (closed) return;
    if (refreshing) return;

    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }

    refreshing = true;

    try {
      // 1. Fetch all RSS feeds
      const allArticles: ParsedArticle[] = [];
      let anySuccess = false;

      for (const url of feedUrls) {
        const articles = await fetchFeed(url);
        if (articles !== null) {
          allArticles.push(...articles);
          anySuccess = true;
        }
      }

      if (!anySuccess) return;

      // 2. Trim to maxItems
      const trimmed = allArticles.slice(0, maxItems);

      // 3. Summarize via LLM
      let aiSummaries: string[];
      try {
        aiSummaries = await summarize(
          trimmed.map((a) => ({ title: a.title, summary: a.description }))
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        notifyError(`AI summarization failed: ${message}`);
        return;
      }

      // 4. Build AiNewsSummary items
      const now = Date.now();
      const summaries: AiNewsSummary[] = trimmed.map((article, i) => ({
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

      const publishData: AiNewsData = {
        summaries: summaries.map(copySummary),
        lastUpdated: now,
      };

      (dataBus as DataBusInstance).publish(DATA_BUS_CHANNEL, PLUGIN_ID, publishData);
      notifyUpdate(publishData);
    } finally {
      refreshing = false;
    }
  }

  return {
    refresh,

    getData(): AiNewsData | null {
      if (!lastData) return null;
      return copyData(lastData);
    },

    onUpdate(callback: (data: AiNewsData) => void): () => void {
      updateListeners.push(callback);
      return () => {
        const idx = updateListeners.indexOf(callback);
        if (idx !== -1) updateListeners.splice(idx, 1);
      };
    },

    onError(callback: (error: string) => void): void {
      errorListeners.push(callback);
    },

    close(): void {
      closed = true;
    },
  };
}
