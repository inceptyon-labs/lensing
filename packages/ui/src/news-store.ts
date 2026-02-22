import type { NewsData, NewsArticle } from '@lensing/types';

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

function copyArticle(a: NewsArticle): NewsArticle {
  return { ...a };
}

function copyData(d: NewsData): NewsData {
  return {
    articles: d.articles.map(copyArticle),
    lastUpdated: d.lastUpdated,
  };
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function createNewsStore(options: NewsStoreOptions = {}): NewsStore {
  const { maxStale_ms = 600_000 } = options;

  let data: NewsData | null = null;
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
          // isolate callback errors
        }
      }
    } finally {
      notifying = false;
    }
  }

  return {
    getState(): NewsStoreState {
      return {
        data: data ? copyData(data) : null,
        isLoading,
        error,
      };
    },

    setData(newData: NewsData): void {
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

    getByCategory(category: string): NewsArticle[] {
      if (!data) return [];
      return data.articles.filter((a) => a.category === category).map(copyArticle);
    },

    getCategories(): string[] {
      if (!data) return [];
      return [...new Set(data.articles.map((a) => a.category))];
    },

    truncateSummary(text: string, maxLength: number): string {
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + '...';
    },
  };
}
