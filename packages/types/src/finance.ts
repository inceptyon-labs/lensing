import type { DataBusInstance, FetchFn } from './index';

/** Price data for a single stock */
export interface StockQuote {
  symbol: string; // e.g., "AAPL"
  name: string; // e.g., "Apple Inc."
  price: number; // current price in USD
  change_1h: number; // percent change over 1 hour
  change_24h: number; // percent change over 24 hours
  change_7d: number; // percent change over 7 days
  sparkline: number[]; // close prices for chart (7d, ~1h intervals)
}

/** Full finance payload */
export interface FinanceData {
  stocks: StockQuote[];
  lastUpdated: number; // Unix timestamp in ms
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
