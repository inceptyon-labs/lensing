import type { DataBusInstance, NotificationQueueInstance, FetchFn } from './index';

/** Default max staleness in ms for Home Assistant data (1 minute) */
export const DEFAULT_HA_MAX_STALE_MS = 60_000;

/** Default Home Assistant entity domains to track */
export const DEFAULT_HA_DOMAINS: string[] = [
  'light',
  'switch',
  'lock',
  'climate',
  'sensor',
  'binary_sensor',
];

/** A single Home Assistant entity state */
export interface HassEntity {
  entity_id: string;
  state: string;
  domain: string;
  friendly_name: string;
  attributes: Record<string, unknown>;
  last_changed: number; // Unix timestamp in ms
  last_updated: number; // Unix timestamp in ms
}

/** Full Home Assistant data payload */
export interface HomeAssistantData {
  devices: HassEntity[];
  sensors: HassEntity[];
  lastUpdated: number; // Unix timestamp in ms
}

/** Configuration for createHomeAssistantServer */
export interface HomeAssistantServerOptions {
  /** Base URL of the Home Assistant instance (e.g. http://homeassistant.local:8123) */
  url: string;
  /** Long-lived access token for authentication */
  token: string;
  /** Data bus instance for publishing entity data */
  dataBus: DataBusInstance;
  /** Notification queue for emitting alerts */
  notifications: NotificationQueueInstance;
  /** Optional filter function to include/exclude specific entities */
  entityFilter?: (entity: HassEntity) => boolean;
  /** Entity domains to track (default: DEFAULT_HA_DOMAINS) */
  domains?: string[];
  /** Max staleness in ms before cache is considered stale (default: DEFAULT_HA_MAX_STALE_MS) */
  maxStale_ms?: number;
  /** Injectable fetch function (defaults to global fetch) */
  fetchFn?: FetchFn;
  /** Injectable WebSocket factory (defaults to native WebSocket) */
  wsFn?: WsFactory;
}

/** Instance returned by createHomeAssistantServer */
export interface HomeAssistantServerInstance {
  /** Manually trigger a data refresh */
  refresh(): Promise<void>;
  /** Get the last fetched HA data (null if not yet fetched) */
  getData(): HomeAssistantData | null;
  /** Register a listener called when new data arrives; returns unsubscribe */
  onUpdate(callback: (data: HomeAssistantData) => void): () => void;
  /** Register a listener called when an error occurs */
  onError(callback: (error: string) => void): void;
  /** Stop background activity and release resources */
  close(): void;
}

/** Minimal WebSocket-like interface for dependency injection */
export interface WsLike {
  onopen: (() => void) | null;
  onmessage: ((event: { data: string }) => void) | null;
  onclose: ((event?: { code: number; reason: string }) => void) | null;
  onerror: ((event: unknown) => void) | null;
  send(data: string): void;
  close(): void;
  readyState: number;
}

/** Factory function type for creating WebSocket connections */
export type WsFactory = (url: string) => WsLike;
