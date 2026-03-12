import type {
  FinanceServerOptions,
  FinanceServerInstance,
  FinanceData,
  StockQuote,
  FetchFn,
  DataBusInstance,
} from '@lensing/types';

const PLUGIN_ID = 'finance-server';
const DATA_BUS_CHANNEL = 'finance.prices';
const DEFAULT_MAX_STALE_MS = 300_000; // 5 minutes

// ── Yahoo Finance chart API types ─────────────────────────────────────────

interface YFChartResult {
  meta?: {
    symbol?: string;
    shortName?: string;
    regularMarketPrice?: number;
    previousClose?: number;
    currency?: string;
  };
  timestamp?: number[];
  indicators?: {
    quote?: Array<{ close?: Array<number | null> }>;
  };
}

interface YFChartResponse {
  chart?: {
    result?: YFChartResult[];
    error?: { code?: string; description?: string };
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────

function safeNumber(val: unknown): number {
  if (typeof val === 'number' && Number.isFinite(val)) return val;
  return 0;
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function buildChartUrl(symbol: string): string {
  return (
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?range=7d&interval=1h&includePrePost=false`
  );
}

function parseChartResponse(data: YFChartResponse, symbol: string): StockQuote | null {
  const result = data.chart?.result?.[0];
  if (!result?.meta) return null;

  const meta = result.meta;
  const price = safeNumber(meta.regularMarketPrice);
  if (price === 0) return null;

  // Extract close prices, filtering out nulls
  const rawCloses = result.indicators?.quote?.[0]?.close ?? [];
  const closes = rawCloses.filter((v): v is number => v !== null && Number.isFinite(v));

  if (closes.length === 0) {
    return {
      symbol: symbol.toUpperCase(),
      name: meta.shortName ?? symbol.toUpperCase(),
      price,
      change_1h: 0,
      change_24h: 0,
      change_7d: 0,
      sparkline: [price],
    };
  }

  // Calculate changes from historical data (1h intervals)
  const current = closes[closes.length - 1]!;
  const oneHourAgo = closes.length >= 2 ? closes[closes.length - 2]! : current;
  // ~24 data points = 24 hours at 1h intervals (market hours only, so approximate)
  const oneDayAgo = closes.length >= 7 ? closes[Math.max(0, closes.length - 7)]! : closes[0]!;
  const sevenDaysAgo = closes[0]!;

  return {
    symbol: symbol.toUpperCase(),
    name: meta.shortName ?? symbol.toUpperCase(),
    price,
    change_1h: percentChange(current, oneHourAgo),
    change_24h: percentChange(current, oneDayAgo),
    change_7d: percentChange(current, sevenDaysAgo),
    sparkline: closes,
  };
}

function copyQuote(q: StockQuote): StockQuote {
  return { ...q, sparkline: [...q.sparkline] };
}

// ── Factory ───────────────────────────────────────────────────────────────

export function createFinanceServer(options: FinanceServerOptions): FinanceServerInstance {
  const {
    watchlist,
    dataBus,
    fetchFn = fetch as unknown as FetchFn,
    maxStale_ms = DEFAULT_MAX_STALE_MS,
  } = options;

  if (!watchlist || watchlist.length === 0) {
    throw new Error('FinanceServer: watchlist is required and must not be empty');
  }

  let lastData: FinanceData | null = null;
  let lastFetchedAt: number | null = null;
  let closed = false;
  let refreshing = false;
  const updateListeners: Array<(data: FinanceData) => void> = [];
  const errorListeners: Array<(error: string) => void> = [];

  function notifyUpdate(data: FinanceData): void {
    for (const cb of [...updateListeners]) {
      try { cb(data); } catch { /* isolate */ }
    }
  }

  function notifyError(message: string): void {
    for (const cb of [...errorListeners]) {
      try { cb(message); } catch { /* isolate */ }
    }
  }

  async function fetchSymbol(symbol: string): Promise<StockQuote | null> {
    let response;
    try {
      response = await fetchFn(buildChartUrl(symbol));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      notifyError(`Finance fetch failed for ${symbol}: ${msg}`);
      return null;
    }

    if (!response.ok) {
      notifyError(`Finance API error for ${symbol}: ${response.status ?? 'unknown'}`);
      return null;
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      notifyError(`Finance parse error for ${symbol}: ${msg}`);
      return null;
    }

    return parseChartResponse(data as YFChartResponse, symbol);
  }

  async function refresh(): Promise<void> {
    if (closed) return;
    if (refreshing) return;

    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }

    refreshing = true;

    try {
      const results = await Promise.all(watchlist.map(fetchSymbol));
      const stocks = results.filter((r): r is StockQuote => r !== null);

      if (stocks.length === 0 && lastData) {
        // All failed — keep stale data
        return;
      }

      const now = Date.now();
      lastData = {
        stocks: stocks.map(copyQuote),
        lastUpdated: now,
      };
      lastFetchedAt = now;

      const publishData: FinanceData = {
        stocks: stocks.map(copyQuote),
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

    getData(): FinanceData | null {
      if (!lastData) return null;
      return {
        stocks: lastData.stocks.map(copyQuote),
        lastUpdated: lastData.lastUpdated,
      };
    },

    onUpdate(callback: (data: FinanceData) => void): () => void {
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
