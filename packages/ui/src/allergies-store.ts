import type { AllergyData } from '@lensing/types';

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
  getSeverityColor(index: number): string;
  getSeverityLabel(index: number): string;
  onChange(callback: () => void): void;
}

// ── Severity maps (using design system CSS custom properties) ──────────────

const SEVERITY_COLORS: Record<number, string> = {
  0: 'var(--alert-success)',
  1: 'var(--alert-success)',
  2: 'var(--alert-success)',
  3: 'var(--alert-warning)',
  4: 'var(--alert-urgent)',
  5: 'var(--ember)',
};

const SEVERITY_LABELS: Record<number, string> = {
  0: 'None',
  1: 'Low',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Very High',
};

// ── Factory ────────────────────────────────────────────────────────────────

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

  function copyAllergens(d: AllergyData): AllergyData {
    return {
      index: d.index,
      allergens: d.allergens.map((a) => ({ ...a })),
      lastUpdated: d.lastUpdated,
    };
  }

  return {
    getState(): AllergiesStoreState {
      return {
        data: data ? copyAllergens(data) : null,
        isLoading,
        error,
      };
    },

    setData(newData: AllergyData): void {
      data = copyAllergens(newData);
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

    getSeverityColor(index: number): string {
      const clamped = Math.max(0, Math.min(5, Math.round(index)));
      return SEVERITY_COLORS[clamped] ?? SEVERITY_COLORS[0];
    },

    getSeverityLabel(index: number): string {
      const clamped = Math.max(0, Math.min(5, Math.round(index)));
      return SEVERITY_LABELS[clamped] ?? 'Unknown';
    },

    onChange(callback: () => void): void {
      callbacks.push(callback);
    },
  };
}
