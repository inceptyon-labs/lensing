import type { DataBusInstance, NotificationQueueInstance } from './index';
/** A single AI-summarized news article */
export interface AiNewsSummary {
    id: string;
    title: string;
    summary: string;
    link: string;
    published: number;
    source: string;
    category: string;
}
/** Full AI news summary data payload */
export interface AiNewsData {
    summaries: AiNewsSummary[];
    lastUpdated: number;
}
/** Fetch function for RSS (returns text, not json) */
export type AiNewsRssFetchFn = (url: string) => Promise<{
    ok: boolean;
    status?: number;
    statusText?: string;
    text: () => Promise<string>;
}>;
/** LLM summarize function — takes headlines, returns summaries */
export type SummarizeFn = (articles: Array<{
    title: string;
    summary: string;
}>) => Promise<string[]>;
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
export declare const DEFAULT_AI_NEWS_MAX_ITEMS = 10;
/** Default max staleness in ms (30 minutes — longer due to LLM cost) */
export declare const DEFAULT_AI_NEWS_MAX_STALE_MS = 1800000;
/** A news category with curated RSS feeds */
export interface AiNewsCategory {
    id: string;
    label: string;
    feeds: string[];
}
/** Curated news categories with reliable RSS feeds */
export declare const AI_NEWS_CATEGORIES: AiNewsCategory[];
/** Resolve category IDs to deduplicated feed URLs */
export declare function resolveCategoriesToFeeds(categoryIds: string[]): string[];
/** Schedule presets mapping to refresh intervals in ms */
export declare const AI_NEWS_SCHEDULES: Record<string, number>;
//# sourceMappingURL=ai-news.d.ts.map