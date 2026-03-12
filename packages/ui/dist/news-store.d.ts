import type { NewsData, NewsArticle } from '@lensing/types';
export interface NewsStoreOptions {
    /** Max staleness in ms before isStale() returns true (default: 600000 = 10 min) */
    maxStale_ms?: number;
}
export interface NewsStoreState {
    data: NewsData | null;
    isLoading: boolean;
    error: string | null;
}
export interface NewsStore {
    getState(): NewsStoreState;
    setData(data: NewsData): void;
    setLoading(loading: boolean): void;
    setError(error: string): void;
    isStale(): boolean;
    onChange(callback: () => void): () => void;
    getByCategory(category: string): NewsArticle[];
    getCategories(): string[];
    truncateSummary(text: string, maxLength: number): string;
}
export declare function createNewsStore(options?: NewsStoreOptions): NewsStore;
//# sourceMappingURL=news-store.d.ts.map