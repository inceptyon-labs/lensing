import type { AiNewsData, AiNewsSummary } from '@lensing/types';
export interface AiNewsStoreOptions {
    /** Max staleness in ms before isStale() returns true (default: 1800000 = 30 min) */
    maxStale_ms?: number;
}
export interface AiNewsStoreState {
    data: AiNewsData | null;
    isLoading: boolean;
    error: string | null;
}
export interface AiNewsStore {
    getState(): AiNewsStoreState;
    setData(data: AiNewsData): void;
    setLoading(loading: boolean): void;
    setError(error: string): void;
    isStale(): boolean;
    onChange(callback: () => void): () => void;
    getByCategory(category: string): AiNewsSummary[];
    getBySource(source: string): AiNewsSummary[];
    getCategories(): string[];
    getSources(): string[];
}
export declare function createAiNewsStore(options?: AiNewsStoreOptions): AiNewsStore;
//# sourceMappingURL=ai-news-store.d.ts.map