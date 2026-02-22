import type { SportsData, SportsGame } from '@lensing/types';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SportsStoreOptions {
  /** Max staleness in ms before isStale() returns true (default: 120000 = 2 min) */
  maxStale_ms?: number;
}

export interface SportsStoreState {
  data: SportsData | null;
  isLoading: boolean;
  error: string | null;
}

export interface SportsStore {
  getState(): SportsStoreState;
  setData(data: SportsData): void;
  setLoading(loading: boolean): void;
  setError(error: string): void;
  isStale(): boolean;
  onChange(callback: () => void): () => void;
  getByLeague(league: string): SportsGame[];
  getLiveGames(): SportsGame[];
  getUpcoming(): SportsGame[];
  getLeagues(): string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function copyGame(g: SportsGame): SportsGame {
  return { ...g };
}

function copyData(d: SportsData): SportsData {
  return {
    games: d.games.map(copyGame),
    lastUpdated: d.lastUpdated,
  };
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function createSportsStore(options: SportsStoreOptions = {}): SportsStore {
  const { maxStale_ms = 120_000 } = options;

  let data: SportsData | null = null;
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
    getState(): SportsStoreState {
      return {
        data: data ? copyData(data) : null,
        isLoading,
        error,
      };
    },

    setData(newData: SportsData): void {
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

    getByLeague(league: string): SportsGame[] {
      if (!data) return [];
      return data.games.filter((g) => g.league === league).map(copyGame);
    },

    getLiveGames(): SportsGame[] {
      if (!data) return [];
      return data.games.filter((g) => g.status === 'in_progress').map(copyGame);
    },

    getUpcoming(): SportsGame[] {
      if (!data) return [];
      return data.games.filter((g) => g.status === 'scheduled').map(copyGame);
    },

    getLeagues(): string[] {
      if (!data) return [];
      return [...new Set(data.games.map((g) => g.league))];
    },
  };
}
