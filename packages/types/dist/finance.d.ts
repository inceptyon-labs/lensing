import type { DataBusInstance, FetchFn } from './index';
/** Price data for a single stock */
export interface StockQuote {
    symbol: string;
    name: string;
    price: number;
    change_1h: number;
    change_24h: number;
    change_7d: number;
    sparkline: number[];
}
/** Full finance payload */
export interface FinanceData {
    stocks: StockQuote[];
    lastUpdated: number;
}
/** Configuration for createFinanceServer */
export interface FinanceServerOptions {
    /** Stock ticker symbols to watch (e.g., ["AAPL", "MSFT", "GOOGL"]) */
    watchlist: string[];
    /** Max staleness in ms before re-fetching (default: 300000 = 5 min) */
    maxStale_ms?: number;
    /** Data bus for publishing updates */
    dataBus: DataBusInstance;
    /** Injectable fetch function (defaults to global fetch) */
    fetchFn?: FetchFn;
}
/** Instance returned by createFinanceServer */
export interface FinanceServerInstance {
    /** Manually trigger a price refresh */
    refresh(): Promise<void>;
    /** Get the last fetched data (null if not yet fetched) */
    getData(): FinanceData | null;
    /** Register a listener called when new data arrives; returns unsubscribe */
    onUpdate(callback: (data: FinanceData) => void): () => void;
    /** Register a listener called when an error occurs */
    onError(callback: (error: string) => void): void;
    /** Stop and release resources */
    close(): void;
}
//# sourceMappingURL=finance.d.ts.map