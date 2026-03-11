import type {
  AllergiesServerOptions,
  AllergiesServerInstance,
  AllergyData,
  PollenTrigger,
  PollenPeriod,
  PollenLevel,
  FetchFn,
  DataBusInstance,
} from '@lensing/types';
import type { NotificationQueueInstance, EmitOptions } from './notification-queue.js';

const PLUGIN_ID = 'allergies-server';
const DATA_BUS_CHANNEL = 'allergies.current';
const DEFAULT_ALERT_THRESHOLD = 7.3; // Medium-High
const DEFAULT_MAX_STALE_MS = 3_600_000; // 1 hour

const USER_AGENT =
  'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// ── Pollen.com API response types ────────────────────────────────────────

interface ApiTrigger {
  LGID: number;
  Name: string;
  Genus: string;
  PlantType: string;
}

interface ApiPeriod {
  Triggers: ApiTrigger[];
  Period: string;
  Type: string;
  Index: number;
}

interface ApiLocation {
  ZIP: string;
  City: string;
  State: string;
  periods: ApiPeriod[];
  DisplayLocation: string;
}

interface ApiResponse {
  Type: string;
  ForecastDate: string;
  Location: ApiLocation;
}

// ── Severity mapping ─────────────────────────────────────────────────────

const SEVERITY_LEVELS: Array<{ max: number; level: PollenLevel; color: string }> = [
  { max: 2.4, level: 'Low', color: '#4caf50' },
  { max: 4.8, level: 'Low-Medium', color: '#8bc34a' },
  { max: 7.2, level: 'Medium', color: '#ffeb3b' },
  { max: 9.6, level: 'Medium-High', color: '#ff9800' },
  { max: 12, level: 'High', color: '#f44336' },
];

export function getPollenLevel(index: number): PollenLevel {
  for (const s of SEVERITY_LEVELS) {
    if (index <= s.max) return s.level;
  }
  return 'High';
}

export function getPollenColor(index: number): string {
  for (const s of SEVERITY_LEVELS) {
    if (index <= s.max) return s.color;
  }
  return '#f44336';
}

// ── Transform ────────────────────────────────────────────────────────────

function transformTriggers(triggers: ApiTrigger[]): PollenTrigger[] {
  return (triggers ?? []).map((t) => ({
    name: t.Name,
    plantType: t.PlantType,
  }));
}

function transformResponse(raw: ApiResponse): AllergyData | null {
  const loc = raw.Location;
  if (!loc || !Array.isArray(loc.periods)) return null;

  const periods: PollenPeriod[] = loc.periods.map((p) => ({
    type: p.Type,
    index: p.Index,
    triggers: transformTriggers(p.Triggers),
  }));

  const today = periods.find((p) => p.type === 'Today') ?? periods[1] ?? periods[0];
  if (!today) return null;

  return {
    index: today.index,
    level: getPollenLevel(today.index),
    color: getPollenColor(today.index),
    location: loc.DisplayLocation || `${loc.City}, ${loc.State}`,
    periods,
    triggers: today.triggers,
    lastUpdated: Date.now(),
  };
}

// ── Factory ──────────────────────────────────────────────────────────────

export function createAllergiesServer(options: AllergiesServerOptions): AllergiesServerInstance {
  const {
    zipCode,
    dataBus,
    notifications,
    fetchFn = fetch as unknown as FetchFn,
    alertThreshold = DEFAULT_ALERT_THRESHOLD,
    maxStale_ms = DEFAULT_MAX_STALE_MS,
  } = options;

  if (!zipCode || !/^\d{5}$/.test(zipCode.trim())) {
    throw new Error('AllergiesServer: zipCode is required (5-digit US zip code)');
  }

  const zip = zipCode.trim();
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
    return `https://www.pollen.com/api/forecast/current/pollen/${zip}`;
  }

  function checkAndEmitAlert(data: AllergyData): void {
    if (data.index >= alertThreshold) {
      const emitOptions: EmitOptions = {
        source: PLUGIN_ID,
        priority: data.index >= 9.7 ? 'urgent' : 'warning',
        title: `Pollen Alert — ${data.level}`,
        body: `Pollen index: ${data.index.toFixed(1)}/12 in ${data.location}`,
        dedupe_key: `${PLUGIN_ID}-alert`,
      };
      notificationQueue.emit(emitOptions);
    }
  }

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

  async function refresh(): Promise<void> {
    if (closed) return;

    // Return cached data if still fresh
    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }

    let response: Awaited<ReturnType<FetchFn>>;
    try {
      response = await fetchFn(buildUrl(), {
        headers: {
          Referer: `https://www.pollen.com/forecast/current/pollen/${zip}`,
          'User-Agent': USER_AGENT,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Pollen fetch failed: ${message}`);
      return;
    }

    if (!response.ok) {
      notifyError(`Pollen API error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`);
      return;
    }

    let raw: ApiResponse;
    try {
      raw = (await response.json()) as ApiResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Pollen response parse error: ${message}`);
      return;
    }

    if (!raw?.Location) {
      notifyError('Pollen response missing Location data');
      return;
    }

    const data = transformResponse(raw);
    if (!data) {
      notifyError('Pollen response missing period data');
      return;
    }

    lastData = copyData(data);
    lastFetchedAt = Date.now();

    (dataBus as DataBusInstance).publish(DATA_BUS_CHANNEL, PLUGIN_ID, data);
    checkAndEmitAlert(data);
    notifyUpdate(data);
  }

  return {
    refresh,

    getAllergyData(): AllergyData | null {
      if (!lastData) return null;
      return copyData(lastData);
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
