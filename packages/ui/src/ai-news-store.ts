import type { AiNewsData, AiNewsSummary } from '@lensing/types';

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

function copySummary(s: AiNewsSummary): AiNewsSummary {
  return { ...s };
}

function copyData(d: AiNewsData): AiNewsData {
  return {
    summaries: d.summaries.map(copySummary),
    lastUpdated: d.lastUpdated,
  };
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function createAiNewsStore(options: AiNewsStoreOptions = {}): AiNewsStore {
  const { maxStale_ms = 1_800_000 } = options;

  let data: AiNewsData | null = null;
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
    getState(): AiNewsStoreState {
      return {
        data: data ? copyData(data) : null,
        isLoading,
        error,
      };
    },

    setData(newData: AiNewsData): void {
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

    getByCategory(category: string): AiNewsSummary[] {
      if (!data) return [];
      return data.summaries.filter((s) => s.category === category).map(copySummary);
    },

    getBySource(source: string): AiNewsSummary[] {
      if (!data) return [];
      const needle = source.toLowerCase();
      return data.summaries.filter((s) => s.source.toLowerCase().includes(needle)).map(copySummary);
    },

    getCategories(): string[] {
      if (!data) return [];
      return [...new Set(data.summaries.map((s) => s.category))];
    },

    getSources(): string[] {
      if (!data) return [];
      return [...new Set(data.summaries.map((s) => s.source))];
    },
  };
}
