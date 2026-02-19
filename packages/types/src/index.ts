/** Grid span size for widget layout */
export interface GridSpan {
  min: [cols: number, rows: number];
  preferred: [cols: number, rows: number];
  max: [cols: number, rows: number];
}

/** Widget size presets */
export type WidgetSize = 'small' | 'medium' | 'large';

/** Plugin manifest as defined in plugin.json */
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  ui_entry?: string;
  server_entry?: string;
  permissions?: PluginPermissions;
  widget_sizes?: WidgetSize[] | GridSpan;
  dependencies?: string[];
}

/** Plugin network and resource permissions */
export interface PluginPermissions {
  allowed_domains?: string[];
  max_refresh_ms?: number;
  max_request_burst?: number;
  secrets?: string[];
}

/** Layout zone identifiers */
export type ZoneName = 'top-bar' | 'left-col' | 'center' | 'right-col' | 'bottom-bar';

/** Zone configuration for the layout grid */
export interface ZoneConfig {
  zone: ZoneName;
  columns: number;
  rows: number;
  plugins: string[];
}

/** Notification priority levels */
export type NotificationPriority = 'info' | 'warning' | 'urgent';

/** A notification emitted by a plugin or the system */
export interface Notification {
  id: string;
  source: string;
  priority: NotificationPriority;
  title: string;
  body?: string;
  ttl_ms?: number;
  created_at: string;
}

/** Scene display mode names */
export type SceneName = 'morning' | 'evening' | 'ambient' | 'focus' | 'alert';

/** Visual settings for a scene */
export type ColorTemp = 'warm' | 'neutral' | 'cool';

export interface SceneVisuals {
  opacity: number; // 0-1
  color_temp: ColorTemp;
}

/** Scene configuration */
export interface SceneConfig {
  name: SceneName | string;
  layout: ZoneConfig[];
  active_plugins: string[];
  visuals?: SceneVisuals;
}

/** Scene manager persistence callbacks */
export interface ScenePersistence {
  save: (scenes: SceneConfig[], activeScene: string) => Promise<void>;
  load: () => Promise<{ scenes: SceneConfig[]; activeScene: string } | null>;
}

/** Scene manager instance */
export interface SceneManagerInstance {
  /** Get all scenes */
  getScenes(): SceneConfig[];

  /** Get a scene by name */
  getScene(name: string): SceneConfig | undefined;

  /** Get the currently active scene */
  getActiveScene(): SceneConfig;

  /** Get the active scene name */
  getActiveSceneName(): string;

  /** Switch to a named scene; returns the new active scene */
  switchTo(name: string): SceneConfig;

  /** Add a new scene */
  addScene(scene: SceneConfig): void;

  /** Update an existing scene */
  updateScene(name: string, updates: Partial<Omit<SceneConfig, 'name'>>): SceneConfig;

  /** Remove a scene by name (cannot remove the active scene) */
  removeScene(name: string): void;

  /** Register a listener called when the active scene changes */
  onSceneChange(callback: (scene: SceneConfig) => void): () => void;

  /** Close the manager, remove all listeners */
  close(): void;
}

/** Data bus channel message */
export interface DataBusMessage<T = unknown> {
  channel: string;
  data: T;
  timestamp: string;
  plugin_id: string;
}

/** Callback for data bus subscriptions */
export type DataBusSubscriber<T = unknown> = (message: DataBusMessage<T>) => void;

/** Data bus instance for inter-plugin communication */
export interface DataBusInstance {
  /** Publish data to a named channel */
  publish<T = unknown>(channel: string, pluginId: string, data: T): void;

  /** Subscribe to a named channel; returns an unsubscribe function */
  subscribe<T = unknown>(channel: string, callback: DataBusSubscriber<T>): () => void;

  /** Get the latest message on a channel, or undefined */
  getLatest<T = unknown>(channel: string): DataBusMessage<T> | undefined;

  /** List all channels that have had at least one publish */
  getChannels(): string[];

  /** Register a global listener called on every publish (for WS forwarding) */
  onMessage(callback: DataBusSubscriber): () => void;

  /** Clear all channel data and subscriptions */
  clear(): void;

  /** Close the bus, remove all subscriptions */
  close(): void;
}

/** Plugin runtime state */
export type PluginStatus = 'loading' | 'active' | 'error' | 'disabled';

/** Plugin instance tracked by the host */
export interface PluginInstance {
  id: string;
  manifest: PluginManifest;
  status: PluginStatus;
  last_refresh?: string;
  error?: string;
}

/** Loaded plugin with manifest and optional runtime modules */
export type PluginLoadStatus = 'loading' | 'loaded' | 'error';

export interface LoadedPlugin {
  manifest: PluginManifest;
  status: PluginLoadStatus;
  ui_module?: Record<string, unknown>;
  server_module?: Record<string, unknown>;
  error?: string;
}

/** Discovery result before loading */
export interface DiscoveredPlugin {
  id: string;
  manifest: PluginManifest;
  manifestPath: string;
}

/** Plugin loader interface */
export interface PluginLoader {
  /** Discover all plugin.json manifests without loading modules */
  discover(): Promise<DiscoveredPlugin[]>;

  /** Load all discovered plugins with validation and dynamic imports */
  load(): Promise<LoadedPlugin[]>;

  /** Reload all plugins (clean up and load again) */
  reload(): Promise<LoadedPlugin[]>;

  /** Get a loaded plugin by ID */
  getPlugin(id: string): LoadedPlugin | undefined;

  /** Get all loaded plugins */
  getAllPlugins(): LoadedPlugin[];

  /** Unload a plugin by ID */
  unload(id: string): Promise<void>;

  /** Get error map: plugin ID → error messages */
  getErrors(): Promise<Map<string, string>>;
}

/** WebSocket message types pushed from host to clients */
export type WsMessageType = 'layout_change' | 'plugin_data' | 'scene_change' | 'ping' | 'pong';

/** WebSocket message envelope */
export interface WsMessage<T = unknown> {
  type: WsMessageType;
  payload: T;
  timestamp: string;
}

/** Client connection status for UI indicator */
export type ConnectionStatus = 'connected' | 'disconnecting' | 'disconnected' | 'reconnecting';

/** Supported config field types for plugin settings forms */
export type ConfigFieldType = 'string' | 'number' | 'boolean' | 'select';

/** A single field in a plugin config schema */
export interface ConfigField {
  key: string;
  type: ConfigFieldType;
  label: string;
  description?: string;
  default?: string | number | boolean;
  required?: boolean;
  options?: Array<{ label: string; value: string | number }>; // for 'select' type
  min?: number; // for 'number' type
  max?: number; // for 'number' type
}

/** Plugin config schema declared in manifest */
export interface PluginConfigSchema {
  fields: ConfigField[];
}

/** Extended manifest with optional config schema */
export interface PluginManifestWithConfig extends PluginManifest {
  config_schema?: PluginConfigSchema;
}

/** Plugin admin state for the admin panel */
export interface PluginAdminEntry {
  plugin_id: string;
  manifest: PluginManifestWithConfig;
  status: PluginStatus;
  enabled: boolean;
  zone?: ZoneName;
  config: Record<string, string | number | boolean>;
  error?: string;
}

/** Zone assignment: which plugin is in which zone */
export interface ZoneAssignment {
  zone: ZoneName;
  plugin_id: string;
  position: number; // order within zone
}

/** Cache staleness policy */
export interface StalePolicy {
  max_stale_ms: number;
  source?: string;
}

/** Cache entry with value and metadata */
export interface CacheEntry<T = unknown> {
  value: T;
  createdAt: number;
  max_stale_ms: number;
  source?: string;
}

/** Staleness status of a cached entry */
export interface StaleStatus {
  stale: boolean;
  found: boolean;
  age_ms?: number;
}

/** Cache store interface */
export interface CacheStore {
  read<T = unknown>(key: string): CacheEntry<T> | undefined;
  write<T = unknown>(key: string, value: T, policy: StalePolicy): void;
  getStaleStatus(key: string): StaleStatus;
  invalidate(key: string): void;
  readOrFetch<T = unknown>(key: string, fetcher: () => Promise<T>, policy: StalePolicy): Promise<T>;
}

/** Widget size for calendar display */
export type CalendarWidgetSize = 'small' | 'large';

/** A single calendar event */
export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO 8601
  end: string; // ISO 8601
  location?: string;
  calendar: string; // calendar source name for color-coding
  color?: string; // optional hex color for calendar
  allDay?: boolean;
}

/** A notification with read/dismissed tracking for the store */
export interface NotificationEntry extends Notification {
  read: boolean;
  dismissed: boolean;
}

/** Quiet hours window (hours 0-23) */
export interface QuietHours {
  start: number; // 0-23
  end: number; // 0-23, if start > end spans midnight
}

/** Filter criteria for querying notifications */
export interface NotificationFilter {
  priority?: NotificationPriority;
  source?: string;
  read?: boolean;
}
