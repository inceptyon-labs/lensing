import type { HomeAssistantData, HassEntity } from '@lensing/types';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface HomeAssistantStoreOptions {
  /** Max staleness in ms before isStale() returns true (default: 120000 = 2 min) */
  maxStale_ms?: number;
}

export interface HomeAssistantStoreState {
  data: HomeAssistantData | null;
  isLoading: boolean;
  error: string | null;
}

export interface HomeAssistantStore {
  getState(): HomeAssistantStoreState;
  setData(data: HomeAssistantData): void;
  setLoading(loading: boolean): void;
  setError(error: string): void;
  isStale(): boolean;
  onChange(callback: () => void): () => void;
  getLights(): HassEntity[];
  getSwitches(): HassEntity[];
  getLocks(): HassEntity[];
  getClimate(): HassEntity[];
  getSensorsByType(deviceClass: string): HassEntity[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function copyEntity(e: HassEntity): HassEntity {
  return { ...e, attributes: { ...e.attributes } };
}

function copyData(d: HomeAssistantData): HomeAssistantData {
  return {
    devices: d.devices.map(copyEntity),
    sensors: d.sensors.map(copyEntity),
    lastUpdated: d.lastUpdated,
  };
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function createHomeAssistantStore(
  options: HomeAssistantStoreOptions = {}
): HomeAssistantStore {
  const { maxStale_ms = 120_000 } = options;

  let data: HomeAssistantData | null = null;
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
    getState(): HomeAssistantStoreState {
      return {
        data: data ? copyData(data) : null,
        isLoading,
        error,
      };
    },

    setData(newData: HomeAssistantData): void {
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

    getLights(): HassEntity[] {
      if (!data) return [];
      return data.devices.filter((e) => e.domain === 'light').map(copyEntity);
    },

    getSwitches(): HassEntity[] {
      if (!data) return [];
      return data.devices.filter((e) => e.domain === 'switch').map(copyEntity);
    },

    getLocks(): HassEntity[] {
      if (!data) return [];
      return data.devices.filter((e) => e.domain === 'lock').map(copyEntity);
    },

    getClimate(): HassEntity[] {
      if (!data) return [];
      return data.devices.filter((e) => e.domain === 'climate').map(copyEntity);
    },

    getSensorsByType(deviceClass: string): HassEntity[] {
      if (!data) return [];
      return data.sensors
        .filter((e) => e.attributes['device_class'] === deviceClass)
        .map(copyEntity);
    },
  };
}
