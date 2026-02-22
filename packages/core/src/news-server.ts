import type {
  NewsServerOptions,
  NewsServerInstance,
  NewsData,
  NewsArticle,
  DataBusInstance,
} from '@lensing/types';
import { DEFAULT_NEWS_MAX_ITEMS, DEFAULT_NEWS_MAX_STALE_MS } from '@lensing/types';
import type { NotificationQueueInstance } from './notification-queue.js';

const PLUGIN_ID = 'news-server';
const DATA_BUS_HEADLINES_CHANNEL = 'news.headlines';

// ── Internal fetch type (RSS uses text(), not json()) ─────────────────────────

interface RssFetchResponse {
  ok: boolean;
  status?: number;
  statusText?: string;
  text: () => Promise<string>;
}

type RssFetchFn = (url: string) => Promise<RssFetchResponse>;

// ── RSS Parsing ───────────────────────────────────────────────────────────────

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
  // Get title before first <item> so we don't pick up item titles
  const beforeFirstItem = channelContent.split(/<item/i)[0];
  return decodeEntities(extractCdata(extractTag(beforeFirstItem, 'title'))).trim();
}

function parseItems(xml: string, feedUrl: string, category: string, source: string): NewsArticle[] {
  const items: NewsArticle[] = [];
  const itemPattern = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = itemPattern.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = decodeEntities(extractCdata(extractTag(itemXml, 'title')));
    const rawDesc = extractCdata(extractTag(itemXml, 'description'));
    const summary = stripHtml(decodeEntities(rawDesc)).trim();
    const link =
      extractCdata(extractTag(itemXml, 'link')).trim() || extractTag(itemXml, 'guid').trim();
    const pubDate = extractCdata(extractTag(itemXml, 'pubDate'));

    items.push({
      id: `${feedUrl}#${index++}`,
      title,
      summary,
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
): { title: string; articles: NewsArticle[] } {
  const channelTitle = parseChannelTitle(xml) || feedUrl;
  const articles = parseItems(xml, feedUrl, category, channelTitle);
  return { title: channelTitle, articles };
}

// ── Defensive copies ──────────────────────────────────────────────────────────

function copyArticle(a: NewsArticle): NewsArticle {
  return { ...a };
}

function copyData(d: NewsData): NewsData {
  return {
    articles: d.articles.map(copyArticle),
    lastUpdated: d.lastUpdated,
  };
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function createNewsServer(options: NewsServerOptions): NewsServerInstance {
  const {
    feedUrls,
    categories = {},
    dataBus,
    notifications: _notifications,
    maxItems = DEFAULT_NEWS_MAX_ITEMS,
    maxStale_ms = DEFAULT_NEWS_MAX_STALE_MS,
    fetchFn,
  } = options;

  if (!feedUrls || feedUrls.length === 0) {
    throw new Error('NewsServer: feedUrls is required and must not be empty');
  }

  if (!Number.isFinite(maxItems) || maxItems < 1) {
    throw new Error(`NewsServer: maxItems must be a positive number, got ${maxItems}`);
  }

  const effectiveFetch = (fetchFn ?? fetch) as unknown as RssFetchFn;
  const _notificationQueue = _notifications as NotificationQueueInstance;

  let lastData: NewsData | null = null;
  let lastFetchedAt: number | null = null;
  let closed = false;
  let refreshing = false;
  const updateListeners: Array<(data: NewsData) => void> = [];
  const errorListeners: Array<(error: string) => void> = [];

  function notifyUpdate(data: NewsData): void {
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

  async function fetchFeed(url: string): Promise<NewsArticle[] | null> {
    let response: RssFetchResponse;
    try {
      response = await effectiveFetch(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`News fetch failed: ${message}`);
      return null;
    }

    if (!response.ok) {
      notifyError(`News feed error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`);
      return null;
    }

    let xml: string;
    try {
      xml = await response.text();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`News body read failed: ${message}`);
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
      const allArticles: NewsArticle[] = [];
      let anySuccess = false;

      for (const url of feedUrls) {
        const articles = await fetchFeed(url);
        if (articles !== null) {
          allArticles.push(...articles);
          anySuccess = true;
        }
      }

      if (!anySuccess) {
        // All feeds failed — preserve stale data, errors already notified
        return;
      }

      const now = Date.now();
      const trimmed = allArticles.slice(0, maxItems);

      lastData = {
        articles: trimmed.map(copyArticle),
        lastUpdated: now,
      };
      lastFetchedAt = now;

      const publishData: NewsData = {
        articles: trimmed.map(copyArticle),
        lastUpdated: now,
      };

      (dataBus as DataBusInstance).publish(DATA_BUS_HEADLINES_CHANNEL, PLUGIN_ID, publishData);
      notifyUpdate(publishData);
    } finally {
      refreshing = false;
    }
  }

  return {
    refresh,

    getHeadlines(): NewsData | null {
      if (!lastData) return null;
      return copyData(lastData);
    },

    onUpdate(callback: (data: NewsData) => void): () => void {
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
