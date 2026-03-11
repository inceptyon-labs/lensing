import type { AllergyData, PollenLevel } from '@lensing/types';

// ── Types ──────────────────────────────────────────────────────────────────

export interface AllergiesStoreOptions {
  /** Max staleness in ms before isStale() returns true (default: 3600000 = 1 hour) */
  maxStale_ms?: number;
}

export interface AllergiesStoreState {
  data: AllergyData | null;
  isLoading: boolean;
  error: string | null;
}

export interface AllergiesStore {
  getState(): AllergiesStoreState;
  setData(data: AllergyData): void;
  setLoading(loading: boolean): void;
  setError(error: string): void;
  isStale(): boolean;
  getPollenLevel(index: number): PollenLevel;
  getPollenColor(index: number): string;
  onChange(callback: () => void): void;
}

// ── Severity maps ──────────────────────────────────────────────────────────

function pollenLevel(index: number): PollenLevel {
  if (index <= 2.4) return 'Low';
  if (index <= 4.8) return 'Low-Medium';
  if (index <= 7.2) return 'Medium';
  if (index <= 9.6) return 'Medium-High';
  return 'High';
}

function pollenColor(index: number): string {
  if (index <= 2.4) return '#4caf50';
  if (index <= 4.8) return '#8bc34a';
  if (index <= 7.2) return '#ffeb3b';
  if (index <= 9.6) return '#ff9800';
  return '#f44336';
}

// ── Factory ────────────────────────────────────────────────────────────────

function copyData(d: AllergyData): AllergyData {
  return {
    index: d.index,
    level: d.level,
    color: d.color,
    location: d.location,
    periods: d.periods.map((p) => ({
      type: p.type,
      index: p.index,
      triggers: p.triggers.map((t) => ({ ...t })),
    })),
    triggers: d.triggers.map((t) => ({ ...t })),
    lastUpdated: d.lastUpdated,
  };
}

export function createAllergiesStore(options: AllergiesStoreOptions = {}): AllergiesStore {
  const { maxStale_ms = 3_600_000 } = options;

  let data: AllergyData | null = null;
  let isLoading = false;
  let error: string | null = null;
  const callbacks: Array<() => void> = [];
  let notifying = false;

  function notifyChange(): void {
    if (notifying) return;
    notifying = true;
    try {
      for (const cb of callbacks) {
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
    getState(): AllergiesStoreState {
      return {
        data: data ? copyData(data) : null,
        isLoading,
        error,
      };
    },

    setData(newData: AllergyData): void {
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

    getPollenLevel(index: number): PollenLevel {
      return pollenLevel(index);
    },

    getPollenColor(index: number): string {
      return pollenColor(index);
    },

    onChange(callback: () => void): void {
      callbacks.push(callback);
    },
  };
}
