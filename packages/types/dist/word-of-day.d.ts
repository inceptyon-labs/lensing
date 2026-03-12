import type { DataBusInstance } from './index';
/** Word of the Day data */
export interface WordOfDayData {
    word: string;
    partOfSpeech: string;
    definition: string;
    date: string;
    lastUpdated: number;
}
/** Fetch function for RSS */
export type WotdFetchFn = (url: string) => Promise<{
    ok: boolean;
    status?: number;
    text: () => Promise<string>;
}>;
/** Options for createWordOfDayServer */
export interface WordOfDayServerOptions {
    dataBus: DataBusInstance;
    fetchFn?: WotdFetchFn;
}
/** Instance returned by createWordOfDayServer */
export interface WordOfDayServerInstance {
    refresh(): Promise<void>;
    getData(): WordOfDayData | null;
    onUpdate(callback: (data: WordOfDayData) => void): () => void;
    onError(callback: (error: string) => void): void;
    close(): void;
}
//# sourceMappingURL=word-of-day.d.ts.map