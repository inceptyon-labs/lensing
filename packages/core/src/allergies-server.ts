import type {
  AllergiesServerOptions,
  AllergiesServerInstance,
  AllergyData,
  AllergenLevel,
  FetchFn,
  DataBusInstance,
} from '@lensing/types';
import type { NotificationQueueInstance, EmitOptions } from './notification-queue.js';

const PLUGIN_ID = 'allergies-server';
const DATA_BUS_CHANNEL = 'allergies.current';
const DEFAULT_ALERT_THRESHOLD = 3;
const DEFAULT_MAX_STALE_MS = 3_600_000; // 1 hour

// ── API response types ─────────────────────────────────────────────────────

interface ApiAllergen {
  name: string;
  level: number;
  category: string;
}

interface ApiResponse {
  current: {
    idx: number;
    allergens: ApiAllergen[];
  };
}

// ── Transform ──────────────────────────────────────────────────────────────

function clampLevel(n: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (!Number.isFinite(n)) return 0;
  const clamped = Math.max(0, Math.min(5, Math.round(n)));
  return clamped as 0 | 1 | 2 | 3 | 4 | 5;
}

function normalizeCategory(cat: unknown): AllergenLevel['category'] {
  if (typeof cat !== 'string') return 'other';
  const lower = cat.toLowerCase();
  if (lower === 'mold') return 'mold';
  if (lower === 'dust') return 'dust';
  if (lower === 'pollen') return 'pollen';
  return 'other';
}

function transformResponse(raw: ApiResponse): AllergyData {
  const allergens: AllergenLevel[] = (raw.current.allergens ?? []).map((a) => ({
    name: a.name,
    level: clampLevel(a.level),
    category: normalizeCategory(a.category),
  }));

  return {
    index: clampLevel(raw.current.idx),
    allergens,
    lastUpdated: Date.now(),
  };
}

// ── Factory ────────────────────────────────────────────────────────────────

export function createAllergiesServer(options: AllergiesServerOptions): AllergiesServerInstance {
  const {
    apiKey,
    location,
    dataBus,
    notifications,
    fetchFn = fetch as unknown as FetchFn,
    alertThreshold = DEFAULT_ALERT_THRESHOLD,
    maxStale_ms = DEFAULT_MAX_STALE_MS,
  } = options;

  if (!apiKey) {
    throw new Error('AllergiesServer: apiKey is required');
  }
  if (!Number.isFinite(location?.lat) || !Number.isFinite(location?.lon)) {
    throw new Error('AllergiesServer: location is required');
  }

  let lastData: AllergyData | null = null;
  let lastFetchedAt: number | null = null;
  let closed = false;
  const updateListeners: Array<(data: AllergyData) => void> = [];
  const errorListeners: Array<(error: string) => void> = [];
  const notificationQueue = notifications as NotificationQueueInstance;

  function notifyUpdate(data: AllergyData): void {
    for (const cb of updateListeners) {
      try {
        cb(data);
      } catch {
        // isolate listener errors
      }
    }
  }

  function notifyError(message: string): void {
    for (const cb of errorListeners) {
      try {
        cb(message);
      } catch {
        // isolate listener errors
      }
    }
  }

  function buildUrl(): string {
    return `https://api.ambeedata.com/latest/pollen?lat=${location.lat}&lng=${location.lon}&x-api-key=${apiKey}`;
  }

  function checkAndEmitAlert(data: AllergyData): void {
    if (data.index >= alertThreshold) {
      const emitOptions: EmitOptions = {
        source: PLUGIN_ID,
        priority: data.index >= 4 ? 'urgent' : 'warning',
        title: `High Pollen Alert — Level ${data.index}`,
        body: `Overall allergy index: ${data.index}/5`,
        dedupe_key: `${PLUGIN_ID}-alert`,
      };
      notificationQueue.emit(emitOptions);
    }
  }

  async function refresh(): Promise<void> {
    if (closed) return;

    // Return cached data if still fresh
    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }

    let response: Awaited<ReturnType<FetchFn>>;
    try {
      response = await fetchFn(buildUrl());
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Allergies fetch failed: ${message}`);
      return;
    }

    if (!response.ok) {
      notifyError(
        `Allergies API error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`
      );
      return;
    }

    let raw: ApiResponse;
    try {
      raw = (await response.json()) as ApiResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Allergies response parse error: ${message}`);
      return;
    }

    if (!raw?.current) {
      notifyError('Allergies response missing required fields');
      return;
    }

    const data = transformResponse(raw);
    // Keep a private defensive copy; publish/notify share the original
    lastData = {
      index: data.index,
      allergens: data.allergens.map((a) => ({ ...a })),
      lastUpdated: data.lastUpdated,
    };
    lastFetchedAt = Date.now();

    (dataBus as DataBusInstance).publish(DATA_BUS_CHANNEL, PLUGIN_ID, data);
    checkAndEmitAlert(data);
    notifyUpdate(data);
  }

  return {
    refresh,

    getAllergyData(): AllergyData | null {
      if (!lastData) return null;
      return {
        index: lastData.index,
        allergens: lastData.allergens.map((a) => ({ ...a })),
        lastUpdated: lastData.lastUpdated,
      };
    },

    onUpdate(callback: (data: AllergyData) => void): () => void {
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
