import type { DataBusInstance, NotificationQueueInstance, FetchFn } from './index';

/** A single news article parsed from an RSS feed */
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  link: string;
  published: number; // Unix timestamp in ms
  source: string;
  category: string;
}

/** Full news data payload */
export interface NewsData {
  articles: NewsArticle[];
  lastUpdated: number; // Unix timestamp in ms
}

/** Configuration for createNewsServer */
export interface NewsServerOptions {
  /** List of RSS feed URLs to poll (must come from trusted admin config, not user input) */
  feedUrls: string[];
  /** Optional category overrides keyed by feed URL */
  categories?: Record<string, string>;
  /** Max articles to retain total (default: 20) */
  maxItems?: number;
  /** Max staleness in ms before cache is stale (default: 600000 = 10 min) */
  maxStale_ms?: number;
  /** Data bus instance for publishing headlines */
  dataBus: DataBusInstance;
  /** Notification queue for emitting alerts */
  notifications: NotificationQueueInstance;
  /** Injectable fetch function (defaults to global fetch) */
  fetchFn?: FetchFn;
}

/** Instance returned by createNewsServer */
export interface NewsServerInstance {
  /** Manually trigger a news refresh */
  refresh(): Promise<void>;
  /** Get the last fetched news data (null if not yet fetched) */
  getHeadlines(): NewsData | null;
  /** Register a listener called when new data arrives; returns unsubscribe */
  onUpdate(callback: (data: NewsData) => void): () => void;
  /** Register a listener called when an error occurs */
  onError(callback: (error: string) => void): void;
  /** Stop and release resources */
  close(): void;
}

/** Default maximum number of articles to retain */
export const DEFAULT_NEWS_MAX_ITEMS = 20;

/** Default max staleness in ms (10 minutes) */
export const DEFAULT_NEWS_MAX_STALE_MS = 600_000;
