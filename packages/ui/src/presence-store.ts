import type { PresenceData } from '@lensing/types';

// ── Types ──────────────────────────────────────────────────────────────────

export interface PresenceStoreOptions {
  // Reserved for future options (e.g., maxStale_ms)
}

export interface PresenceStoreState {
  detected: boolean;
  available: boolean;
  lastMotionAt: number;
  timeSinceMotionMs: number;
  lastUpdated: number;
}

export interface PresenceStore {
  getState(): PresenceStoreState;
  setData(data: PresenceData): void;
  isMotionDetected(): boolean;
  onChange(callback: () => void): () => void;
}

// ── Factory ────────────────────────────────────────────────────────────────

export function createPresenceStore(_options: PresenceStoreOptions = {}): PresenceStore {
  let data: PresenceData | null = null;
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

  function buildState(): PresenceStoreState {
    if (!data) {
      return {
        detected: false,
        available: false,
        lastMotionAt: 0,
        timeSinceMotionMs: 0,
        lastUpdated: 0,
      };
    }
    return {
      detected: data.detected,
      available: data.available,
      lastMotionAt: data.lastMotionAt,
      timeSinceMotionMs: data.lastMotionAt > 0 ? Date.now() - data.lastMotionAt : 0,
      lastUpdated: data.lastUpdated,
    };
  }

  return {
    getState(): PresenceStoreState {
      return buildState();
    },

    setData(newData: PresenceData): void {
      data = { ...newData };
      notifyChange();
    },

    isMotionDetected(): boolean {
      return data?.detected ?? false;
    },

    onChange(callback: () => void): () => void {
      callbacks.push(callback);
      return () => {
        const idx = callbacks.indexOf(callback);
        if (idx !== -1) callbacks.splice(idx, 1);
      };
    },
  };
}
