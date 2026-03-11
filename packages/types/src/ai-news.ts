import type { DataBusInstance, NotificationQueueInstance } from './index';
import type { AiProviderId } from './index';

/** A single AI-summarized news article */
export interface AiNewsSummary {
  id: string;
  title: string;
  summary: string; // 2-3 line AI-generated summary
  link: string;
  published: number; // Unix timestamp in ms
  source: string;
  category: string;
}

/** Full AI news summary data payload */
export interface AiNewsData {
  summaries: AiNewsSummary[];
  lastUpdated: number; // Unix timestamp in ms
}

/** Fetch function for RSS (returns text, not json) */
export type AiNewsRssFetchFn = (url: string) => Promise<{
  ok: boolean;
  status?: number;
  statusText?: string;
  text: () => Promise<string>;
}>;

/** LLM summarize function — takes headlines, returns summaries */
export type SummarizeFn = (
  articles: Array<{ title: string; summary: string }>
) => Promise<string[]>;

/** Configuration for createAiNewsServer */
export interface AiNewsServerOptions {
  /** RSS feed URLs to poll */
  feedUrls: string[];
  /** Optional category overrides keyed by feed URL */
  categories?: Record<string, string>;
  /** Max articles to summarize per refresh (default: 10) */
  maxItems?: number;
  /** Max staleness in ms before cache is stale (default: 1800000 = 30 min) */
  maxStale_ms?: number;
  /** Data bus for publishing summaries */
  dataBus: DataBusInstance;
  /** Notification queue */
  notifications: NotificationQueueInstance;
  /** Injectable RSS fetch function (defaults to global fetch) */
  fetchFn?: AiNewsRssFetchFn;
  /** LLM summarize function — caller provides the AI integration */
  summarize: SummarizeFn;
}

/** Instance returned by createAiNewsServer */
export interface AiNewsServerInstance {
  /** Manually trigger a refresh (fetch RSS + summarize) */
  refresh(): Promise<void>;
  /** Get the last data (null if not yet fetched) */
  getData(): AiNewsData | null;
  /** Register listener for new data; returns unsubscribe */
  onUpdate(callback: (data: AiNewsData) => void): () => void;
  /** Register error listener */
  onError(callback: (error: string) => void): void;
  /** Stop and release resources */
  close(): void;
}

/** Default max articles to summarize */
export const DEFAULT_AI_NEWS_MAX_ITEMS = 10;

/** Default max staleness in ms (30 minutes — longer due to LLM cost) */
export const DEFAULT_AI_NEWS_MAX_STALE_MS = 1_800_000;

/** A news category with curated RSS feeds */
export interface AiNewsCategory {
  id: string;
  label: string;
  feeds: string[];
}

/** Curated news categories with reliable RSS feeds */
export const AI_NEWS_CATEGORIES: AiNewsCategory[] = [
  {
    id: 'top-news',
    label: 'Top News',
    feeds: [
      'https://feeds.bbci.co.uk/news/rss.xml',
      'https://feeds.npr.org/1001/rss.xml',
      'https://rsshub.app/apnews/topics/apf-topnews',
    ],
  },
  {
    id: 'technology',
    label: 'Technology',
    feeds: [
      'https://hnrss.org/frontpage',
      'https://feeds.arstechnica.com/arstechnica/index',
    ],
  },
  {
    id: 'world',
    label: 'World',
    feeds: [
      'https://feeds.bbci.co.uk/news/world/rss.xml',
      'https://www.reutersagency.com/feed/',
    ],
  },
  {
    id: 'business',
    label: 'Business & Finance',
    feeds: [
      'https://feeds.bbci.co.uk/news/business/rss.xml',
      'https://feeds.marketwatch.com/marketwatch/topstories',
    ],
  },
  {
    id: 'science',
    label: 'Science & Health',
    feeds: [
      'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
      'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml',
    ],
  },
  {
    id: 'sports',
    label: 'Sports',
    feeds: ['https://www.espn.com/espn/rss/news'],
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    feeds: ['https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml'],
  },
];

/** Resolve category IDs to deduplicated feed URLs */
export function resolveCategoriesToFeeds(categoryIds: string[]): string[] {
  const idSet = new Set(categoryIds);
  const feeds: string[] = [];
  for (const cat of AI_NEWS_CATEGORIES) {
    if (idSet.has(cat.id)) {
      feeds.push(...cat.feeds);
    }
  }
  return [...new Set(feeds)];
}

/** Schedule presets mapping to refresh intervals in ms */
export const AI_NEWS_SCHEDULES: Record<string, number> = {
  '2x-daily': 43_200_000, // 12 hours
  '3x-daily': 28_800_000, // 8 hours
  '4x-daily': 21_600_000, // 6 hours
  hourly: 3_600_000, // 1 hour
};
