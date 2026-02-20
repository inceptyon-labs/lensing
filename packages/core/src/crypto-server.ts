import type {
  CryptoServerOptions,
  CryptoServerInstance,
  CryptoData,
  CoinPrice,
  CryptoAlertConfig,
  FetchFn,
  DataBusInstance,
} from '@lensing/types';
import type { NotificationQueueInstance, EmitOptions } from './notification-queue.js';

const PLUGIN_ID = 'crypto-server';
const DATA_BUS_PRICES_CHANNEL = 'crypto.prices';
const DATA_BUS_ALERTS_CHANNEL = 'crypto.alerts';
const DEFAULT_MAX_STALE_MS = 300_000; // 5 minutes

// ── API response types ─────────────────────────────────────────────────────

interface ApiCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: unknown;
  price_change_percentage_1h_in_currency: unknown;
  price_change_percentage_24h_in_currency: unknown;
  price_change_percentage_7d_in_currency: unknown;
}

// ── Transform ──────────────────────────────────────────────────────────────

function safeNumber(val: unknown): number {
  if (typeof val === 'number' && Number.isFinite(val)) return val;
  return 0;
}

function transformCoin(raw: ApiCoin): CoinPrice {
  return {
    id: typeof raw.id === 'string' ? raw.id : '',
    symbol: typeof raw.symbol === 'string' ? raw.symbol : '',
    name: typeof raw.name === 'string' ? raw.name : '',
    price: safeNumber(raw.current_price),
    change_1h: safeNumber(raw.price_change_percentage_1h_in_currency),
    change_24h: safeNumber(raw.price_change_percentage_24h_in_currency),
    change_7d: safeNumber(raw.price_change_percentage_7d_in_currency),
  };
}

function copyCoin(coin: CoinPrice): CoinPrice {
  return { ...coin };
}

// ── Factory ────────────────────────────────────────────────────────────────

export function createCryptoServer(options: CryptoServerOptions): CryptoServerInstance {
  const {
    watchlist,
    alertConfigs = [],
    dataBus,
    notifications,
    fetchFn = fetch as unknown as FetchFn,
    maxStale_ms = DEFAULT_MAX_STALE_MS,
  } = options;

  if (!watchlist || watchlist.length === 0) {
    throw new Error('CryptoServer: watchlist is required and must not be empty');
  }

  let lastData: CryptoData | null = null;
  let lastFetchedAt: number | null = null;
  let closed = false;
  let refreshing = false;
  const updateListeners: Array<(data: CryptoData) => void> = [];
  const errorListeners: Array<(error: string) => void> = [];
  const notificationQueue = notifications as NotificationQueueInstance;

  function notifyUpdate(data: CryptoData): void {
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

  function buildUrl(): string {
    const ids = watchlist.join(',');
    return (
      `https://api.coingecko.com/api/v3/coins/markets` +
      `?vs_currency=usd` +
      `&ids=${ids}` +
      `&price_change_percentage=1h,24h,7d`
    );
  }

  function getChangeForWindow(coin: CoinPrice, window: CryptoAlertConfig['window']): number {
    if (window === '1h') return coin.change_1h;
    if (window === '7d') return coin.change_7d;
    return coin.change_24h;
  }

  function checkAndEmitAlerts(coins: CoinPrice[]): void {
    for (const config of alertConfigs) {
      const coin = coins.find((c) => c.id === config.coinId);
      if (!coin) continue;

      const change = getChangeForWindow(coin, config.window);
      if (Math.abs(change) >= config.threshold_pct) {
        const direction = change >= 0 ? '+' : '';
        const emitOptions: EmitOptions = {
          source: PLUGIN_ID,
          priority: Math.abs(change) >= config.threshold_pct * 2 ? 'urgent' : 'warning',
          title: `${coin.name} moved ${direction}${change.toFixed(1)}% (${config.window})`,
          body: `${coin.name} is now $${coin.price.toLocaleString()}`,
          dedupe_key: `${PLUGIN_ID}-alert-${config.coinId}-${config.window}`,
        };
        notificationQueue.emit(emitOptions);

        (dataBus as DataBusInstance).publish(DATA_BUS_ALERTS_CHANNEL, PLUGIN_ID, {
          coinId: config.coinId,
          change,
          window: config.window,
          price: coin.price,
        });
      }
    }
  }

  async function refresh(): Promise<void> {
    if (closed) return;
    if (refreshing) return;

    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }

    refreshing = true;

    try {
      let response: Awaited<ReturnType<FetchFn>>;
      try {
        response = await fetchFn(buildUrl());
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        notifyError(`Crypto fetch failed: ${message}`);
        return;
      }

      if (!response.ok) {
        notifyError(
          `Crypto API error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`
        );
        return;
      }

      let raw: unknown;
      try {
        raw = await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        notifyError(`Crypto response parse error: ${message}`);
        return;
      }

      if (!Array.isArray(raw)) {
        notifyError('Crypto response is not an array');
        return;
      }

      const coins = (raw as ApiCoin[]).map(transformCoin);
      const now = Date.now();

      // Store private defensive copy
      lastData = {
        coins: coins.map(copyCoin),
        lastUpdated: now,
      };
      lastFetchedAt = now;

      // Publish a copy to the data bus
      const publishData: CryptoData = {
        coins: coins.map(copyCoin),
        lastUpdated: now,
      };
      (dataBus as DataBusInstance).publish(DATA_BUS_PRICES_CHANNEL, PLUGIN_ID, publishData);

      checkAndEmitAlerts(coins);
      notifyUpdate(publishData);
    } finally {
      refreshing = false;
    }
  }

  return {
    refresh,

    getPrices(): CryptoData | null {
      if (!lastData) return null;
      return {
        coins: lastData.coins.map(copyCoin),
        lastUpdated: lastData.lastUpdated,
      };
    },

    onUpdate(callback: (data: CryptoData) => void): () => void {
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
