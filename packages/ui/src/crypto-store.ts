import type { CryptoData, CoinPrice } from '@lensing/types';

// ── Types ──────────────────────────────────────────────────────────────────

export interface CryptoStoreOptions {
  /** Max staleness in ms before isStale() returns true (default: 300000 = 5 min) */
  maxStale_ms?: number;
}

export interface CryptoStoreState {
  data: CryptoData | null;
  isLoading: boolean;
  error: string | null;
}

export interface CryptoStore {
  getState(): CryptoStoreState;
  setData(data: CryptoData): void;
  setLoading(loading: boolean): void;
  setError(error: string): void;
  getChangeColor(pct: number): string;
  getChangeLabel(pct: number): string;
  formatPrice(price: number): string;
  isStale(): boolean;
  onChange(callback: () => void): () => void;
  getCoinById(id: string): CoinPrice | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function copyCoin(coin: CoinPrice): CoinPrice {
  return { ...coin };
}

function copyData(d: CryptoData): CryptoData {
  return {
    coins: d.coins.map(copyCoin),
    lastUpdated: d.lastUpdated,
  };
}

// ── Factory ────────────────────────────────────────────────────────────────

export function createCryptoStore(options: CryptoStoreOptions = {}): CryptoStore {
  const { maxStale_ms = 300_000 } = options;

  let data: CryptoData | null = null;
  let isLoading = false;
  let error: string | null = null;
  const callbacks: Array<() => void> = [];
  let notifying = false;

  function notifyChange(): void {
    if (notifying) return;
    notifying = true;
    try {
      for (const cb of [...callbacks]) {
        try {
          cb();
        } catch {
          // isolate listener errors
        }
      }
    } finally {
      notifying = false;
    }
  }

  return {
    getState(): CryptoStoreState {
      return {
        data: data ? copyData(data) : null,
        isLoading,
        error,
      };
    },

    setData(newData: CryptoData): void {
      data = copyData(newData);
      error = null;
      isLoading = false;
      notifyChange();
    },

    setLoading(loading: boolean): void {
      isLoading = loading;
      notifyChange();
    },

    setError(errorMessage: string): void {
      error = errorMessage;
      data = null;
      isLoading = false;
      notifyChange();
    },

    getChangeColor(pct: number): string {
      if (!Number.isFinite(pct)) return 'var(--dim-light)';
      if (Math.abs(pct) < 0.1) return 'var(--dim-light)';
      return pct > 0 ? 'var(--alert-success)' : 'var(--alert-urgent)';
    },

    getChangeLabel(pct: number): string {
      const safe = Number.isFinite(pct) ? pct : 0;
      const prefix = safe >= 0 ? '+' : '';
      return `${prefix}${safe.toFixed(2)}%`;
    },

    formatPrice(price: number): string {
      if (!Number.isFinite(price)) return '$0';
      // Use Intl.NumberFormat for locale-aware formatting
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: price < 1 ? 4 : 2,
        maximumFractionDigits: price < 1 ? 6 : 2,
      }).format(price);
    },

    isStale(): boolean {
      if (!data) return false;
      if (!Number.isFinite(data.lastUpdated)) return true;
      return Date.now() - data.lastUpdated > maxStale_ms;
    },

    onChange(callback: () => void): () => void {
      callbacks.push(callback);
      return () => {
        const idx = callbacks.indexOf(callback);
        if (idx !== -1) callbacks.splice(idx, 1);
      };
    },

    getCoinById(id: string): CoinPrice | null {
      if (!data) return null;
      const coin = data.coins.find((c) => c.id === id);
      return coin ? copyCoin(coin) : null;
    },
  };
}
