import type {
  HomeAssistantServerOptions,
  HomeAssistantServerInstance,
  HomeAssistantData,
  HassEntity,
  DataBusInstance,
  FetchFn,
} from '@lensing/types';
import { DEFAULT_HA_MAX_STALE_MS } from '@lensing/types';

const PLUGIN_ID = 'home-assistant-server';
const DATA_BUS_DEVICES_CHANNEL = 'home.devices';
const DATA_BUS_SENSORS_CHANNEL = 'home.sensors';

const SENSOR_DOMAINS = new Set(['sensor', 'binary_sensor']);

// ── HA API raw types ───────────────────────────────────────────────────────

interface HaStateRaw {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

// ── Transform helpers ──────────────────────────────────────────────────────

function transformEntity(raw: HaStateRaw): HassEntity {
  const domain = raw.entity_id.split('.')[0] ?? '';
  const friendly_name =
    typeof raw.attributes.friendly_name === 'string'
      ? raw.attributes.friendly_name
      : raw.entity_id;

  return {
    entity_id: raw.entity_id,
    state: raw.state,
    domain,
    friendly_name,
    attributes: { ...raw.attributes },
    last_changed: Date.parse(raw.last_changed),
    last_updated: Date.parse(raw.last_updated),
  };
}

// ── Defensive copies ───────────────────────────────────────────────────────

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

// ── Factory ────────────────────────────────────────────────────────────────

export function createHomeAssistantServer(
  options: HomeAssistantServerOptions,
): HomeAssistantServerInstance {
  const {
    url,
    token,
    dataBus,
    maxStale_ms = DEFAULT_HA_MAX_STALE_MS,
    fetchFn,
    domains,
  } = options;

  // Cast to support (url, options) call signature used internally
  type FetchWithOptions = (url: string, init?: RequestInit) => Promise<{
    ok: boolean;
    status?: number;
    statusText?: string;
    json: () => Promise<unknown>;
  }>;

  const effectiveFetch = (fetchFn ?? fetch) as unknown as FetchWithOptions;

  let lastData: HomeAssistantData | null = null;
  let lastFetchedAt: number | null = null;
  let closed = false;
  let refreshing = false;
  const updateListeners: Array<(data: HomeAssistantData) => void> = [];
  const errorListeners: Array<(error: string) => void> = [];

  function notifyUpdate(data: HomeAssistantData): void {
    for (const cb of [...updateListeners]) {
      try {
        cb(data);
      } catch {
        // isolate listener errors
      }
    }
  }

  function notifyError(message: string): void {
    for (const cb of [...errorListeners]) {
      try {
        cb(message);
      } catch {
        // isolate listener errors
      }
    }
  }

  async function refresh(): Promise<void> {
    if (closed) return;
    if (refreshing) return;

    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }

    refreshing = true;

    try {
      let response: Awaited<ReturnType<FetchWithOptions>>;

      try {
        response = await effectiveFetch(`${url}/api/states`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        notifyError(`Home Assistant fetch failed: ${message}`);
        return;
      }

      if (!response.ok) {
        notifyError(
          `Home Assistant API error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`,
        );
        return;
      }

      let raw: unknown;
      try {
        raw = await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        notifyError(`Home Assistant response parse error: ${message}`);
        return;
      }

      const rawStates = raw as HaStateRaw[];
      let entities = rawStates.map(transformEntity);

      // Apply domain filter if provided
      if (domains && domains.length > 0) {
        const domainSet = new Set(domains);
        entities = entities.filter((e) => domainSet.has(e.domain));
      }

      const sensors = entities.filter((e) => SENSOR_DOMAINS.has(e.domain));
      const devices = entities.filter((e) => !SENSOR_DOMAINS.has(e.domain));

      const now = Date.now();

      lastData = {
        devices: devices.map(copyEntity),
        sensors: sensors.map(copyEntity),
        lastUpdated: now,
      };
      lastFetchedAt = now;

      const publishData: HomeAssistantData = {
        devices: devices.map(copyEntity),
        sensors: sensors.map(copyEntity),
        lastUpdated: now,
      };

      (dataBus as DataBusInstance).publish(DATA_BUS_DEVICES_CHANNEL, PLUGIN_ID, publishData);
      (dataBus as DataBusInstance).publish(DATA_BUS_SENSORS_CHANNEL, PLUGIN_ID, publishData);

      notifyUpdate(publishData);
    } finally {
      refreshing = false;
    }
  }

  return {
    refresh,

    getData(): HomeAssistantData | null {
      if (!lastData) return null;
      return copyData(lastData);
    },

    onUpdate(callback: (data: HomeAssistantData) => void): () => void {
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
