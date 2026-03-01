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
  description?: string;
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
export type WsMessageType =
  | 'layout_change'
  | 'plugin_data'
  | 'scene_change'
  | 'ping'
  | 'pong'
  | 'ask_response'
  | 'agent_request'
  | 'agent_response'
  | 'data_snapshot_request'
  | 'data_snapshot_response';

/** A single conversation entry from the Ask Lensing interface */
export interface ConversationEntry {
  id: string;
  question: string;
  response: string;
  timestamp: string;
  tool_calls_made: number;
}

/** WebSocket message envelope */
export interface WsMessage<T = unknown> {
  type: WsMessageType;
  payload: T;
  timestamp: string;
}

/** Client connection status for UI indicator */
export type ConnectionStatus = 'connected' | 'disconnecting' | 'disconnected' | 'reconnecting';

/** Supported config field types for plugin settings forms.
 * 'password' is a presentation hint — stored and coerced identically to 'string',
 * but rendered as <input type="password"> in the admin UI. */
export type ConfigFieldType = 'string' | 'number' | 'boolean' | 'select' | 'password';

/** Whether a config field belongs to an integration (central service) or a widget instance */
export type ConfigFieldCategory = 'integration' | 'widget';

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
  /** Whether this field is part of an integration (credentials, server URLs) or widget display config */
  category?: ConfigFieldCategory;
}

/** Plugin config schema declared in manifest */
export interface PluginConfigSchema {
  fields: ConfigField[];
  /** User-facing setup instructions shown in the admin config modal */
  setupGuide?: string;
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
  enabled?: boolean;
  zone?: ZoneName;
  config: Record<string, string | number | boolean>;
  error?: string;
  /** True for built-in modules synthesized from MODULE_SCHEMAS */
  builtin?: boolean;
  /** Integration readiness for built-in modules */
  integration_status?: 'ready' | 'missing' | 'not_needed';
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

/** Full calendar data payload published by calendar-server */
export interface CalendarData {
  events: CalendarEvent[];
  lastUpdated: number; // Unix timestamp in ms
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

/** Database configuration options */
export interface DatabaseOptions {
  /** Path to the SQLite database file, or ':memory:' for in-memory */
  path?: string;
}

/** Options for emitting a notification */
export interface EmitOptions {
  source: string;
  priority: NotificationPriority;
  title: string;
  body?: string;
  ttl_ms?: number;
  dedupe_key?: string;
}

/** Notification queue instance (minimal interface for cross-package use) */
export interface NotificationQueueInstance {
  emit(options: EmitOptions): string;
  list(filter?: NotificationFilter): NotificationEntry[];
  markRead(id: string): void;
  dismiss(id: string): void;
  clear(): void;
  emitSystemEvent(event: 'plugin_error' | 'connectivity_loss', detail: string): string;
  onNotification(callback: (entry: NotificationEntry) => void): () => void;
  close(): void;
}

// ── Scene Scheduling ───────────────────────────────────────────────────────
import type { CronTime, SceneScheduleEntry, SceneSchedule } from './schedule-types';
export type { CronTime, SceneScheduleEntry, SceneSchedule };
export { cronTime, isCronTimeReached, getNextScheduleEntry } from './schedule-types';

/** Schema migration definition */
export interface SchemaMigration {
  version: number;
  description: string;
}

/** Database instance for SQLite persistence */
export interface DatabaseInstance {
  /** Get the current schema version */
  getSchemaVersion(): number;

  /** Get all applied migrations */
  getMigrations(): SchemaMigration[];

  // --- Settings (key-value) ---

  /** Get a setting by key */
  getSetting(key: string): string | undefined;

  /** Set a setting value */
  setSetting(key: string, value: string): void;

  /** Get all settings as a record */
  getAllSettings(): Record<string, string>;

  /** Delete a setting by key */
  deleteSetting(key: string): boolean;

  // --- Layouts (named zone configs) ---

  /** Get a layout by name */
  getLayout(name: string): ZoneConfig[] | undefined;

  /** Set a layout (stores as JSON) */
  setLayout(name: string, zones: ZoneConfig[]): void;

  /** Get all layouts as a record */
  getAllLayouts(): Record<string, ZoneConfig[]>;

  /** Delete a layout by name */
  deleteLayout(name: string): boolean;

  // --- Plugin state (per-plugin JSON cache) ---

  /** Get plugin state by ID */
  getPluginState<T = unknown>(pluginId: string): T | undefined;

  /** Set plugin state (stores as JSON) */
  setPluginState<T = unknown>(pluginId: string, state: T): void;

  /** Get all plugin states */
  getAllPluginStates(): Record<string, unknown>;

  /** Delete plugin state by ID */
  deletePluginState(pluginId: string): boolean;

  // --- Scene Schedules (cron-style scene switching) ---

  /** Get a schedule by ID */
  getSchedule(id: string): SceneSchedule | undefined;

  /** Set/upsert a schedule */
  setSchedule(schedule: SceneSchedule): void;

  /** Get all schedules as a record */
  getAllSchedules(): Record<string, SceneSchedule>;

  /** Delete a schedule by ID */
  deleteSchedule(id: string): boolean;

  /** Close the database connection */
  close(): void;
}

// --- Agent Service Types ---

/** LLM message role */
export type LlmRole = 'user' | 'assistant' | 'tool_result';

/** LLM message in conversation */
export interface LlmMessage {
  role: LlmRole;
  content: string;
  tool_use_id?: string;
}

/** LLM tool definition for the model */
export interface LlmToolDef {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

/** LLM tool call request from the model */
export interface LlmToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

/** LLM response from the provider */
export interface LlmResponse {
  content: string;
  tool_calls?: LlmToolCall[];
  stop_reason: 'end_turn' | 'tool_use';
}

/** Abstract LLM provider (for testability) */
export interface LlmProvider {
  chat(messages: LlmMessage[], tools?: LlmToolDef[]): Promise<LlmResponse>;
}

/** Agent tool definition */
export interface AgentTool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
  execute(params: Record<string, unknown>): Promise<unknown>;
}

/** Audit log entry */
export interface AuditEntry {
  timestamp: string;
  action: string;
  tool?: string;
  params?: Record<string, unknown>;
  result?: unknown;
  error?: string;
}

/** Agent alert from condition evaluation */
export interface AgentAlert {
  condition: string;
  message: string;
  action?: string;
}

/** Condition rule for cross-plugin reasoning */
export interface ConditionRule {
  name: string;
  channels: string[];
  evaluate(data: Record<string, unknown>): AgentAlert | null;
}

/** Result from agent task execution */
export interface AgentTaskResult {
  response: string;
  tool_calls_made: number;
  audit_entries: AuditEntry[];
}

/** Agent service options — notificationQueue typed loosely to avoid circular dep */
export interface AgentServiceOptions {
  dataBus: DataBusInstance;
  notificationQueue: {
    emit(options: {
      source: string;
      priority: NotificationPriority;
      title: string;
      body?: string;
    }): string;
  };
  sceneManager: SceneManagerInstance;
  llmProvider: LlmProvider;
}

/** Agent service instance */
export interface AgentServiceInstance {
  /** Execute a task with LLM tool calling */
  executeTask(prompt: string): Promise<AgentTaskResult>;

  /** Generate Morning Brief from data bus channels */
  generateMorningBrief(): Promise<string>;

  /** Evaluate condition rules against current data */
  evaluateConditions(rules: ConditionRule[]): AgentAlert[];

  /** Get the full audit log */
  getAuditLog(): AuditEntry[];

  /** Clear the audit log */
  clearAuditLog(): void;

  /** Get all registered tools */
  getTools(): AgentTool[];

  /** Register a custom tool */
  registerTool(tool: AgentTool): void;

  /** Close the agent service */
  close(): void;
}

/** Health status of a single plugin */
export interface PluginHealthReport {
  pluginId: string;
  status: PluginStatus;
  lastRefreshAt: string;
  nextRefreshAt: string;
  errorCount: number;
  errors: string[];
  refreshCount: number;
  resourceUsage: {
    cpuMs: number;
    memoryBytes: number;
  };
}

/** System-wide health metrics */
export interface SystemHealthSnapshot {
  cpuPercent: number;
  memoryUsedBytes: number;
  memoryTotalBytes: number;
  diskUsedBytes: number;
  diskTotalBytes: number;
  chromiumMemoryBytes: number;
  timestamp: string;
}

/** Network connectivity status */
export interface ConnectivityStatus {
  online: boolean;
  latencyMs: number;
  lastCheckAt: string;
}

/** Resource budget violation record */
export interface ResourceBudgetViolation {
  pluginId: string;
  violationType: string;
  limit: number;
  actual: number;
  timestamp: string;
}

/** Aggregate health store state */
export interface HealthStoreState {
  plugins: Map<string, PluginHealthReport>;
  system: SystemHealthSnapshot;
  connectivity: ConnectivityStatus;
  violations: ResourceBudgetViolation[];
}

// --- Agent Gateway Types ---

/** Payload for agent_request messages sent to remote Agent Service */
export interface AgentRequestPayload {
  requestId: string;
  prompt: string;
}

/** Payload for agent_response messages received from remote Agent Service */
export interface AgentResponsePayload {
  requestId: string;
  result: AgentTaskResult;
}

/** Payload for data_snapshot_response messages */
export interface DataSnapshotPayload {
  requestId: string;
  channels: string[];
  snapshots: Record<string, DataBusMessage>;
}

/** Minimal WebSocket-compatible interface for dependency injection */
export interface AgentWebSocket {
  readonly readyState: number;
  send(data: string): void;
  close(code?: number, reason?: string): void;
  onopen: (() => void) | null;
  onclose: ((event: { code: number; reason: string }) => void) | null;
  onmessage: ((event: { data: string }) => void) | null;
  onerror: ((event: unknown) => void) | null;
}

/** Agent gateway configuration */
export interface AgentGatewayOptions {
  /** WebSocket URL of the remote Agent Service (e.g. ws://agent-host:8080) */
  url: string;
  /** Data bus instance for snapshot forwarding */
  dataBus: DataBusInstance;
  /** Callback invoked when an agent response is received */
  onResponse: (result: AgentTaskResult) => void;
  /** Optional callback for connection status changes */
  onStatusChange?: (status: ConnectionStatus) => void;
  /** Base delay for reconnect backoff in ms (default: 1000) */
  baseDelay?: number;
  /** Max delay for reconnect backoff in ms (default: 30000) */
  maxDelay?: number;
  /** Max reconnect retries (default: Infinity) */
  maxRetries?: number;
  /** Optional WebSocket factory for testing (uses native WebSocket by default) */
  createWebSocket?: (url: string) => AgentWebSocket;
}

/** Agent gateway client instance */
export interface AgentGatewayInstance {
  /** Current connection status */
  readonly status: ConnectionStatus;
  /** Number of reconnect attempts since last successful connection */
  readonly reconnectAttempts: number;
  /** Connect to the remote Agent Service */
  connect(): void;
  /** Send a user prompt to the remote Agent Service; returns the request ID */
  sendRequest(prompt: string): string;
  /** Disconnect from the remote Agent Service */
  disconnect(): void;
  /** Close and clean up all resources */
  close(): void;
}

// ── Allergies/Pollen Server ────────────────────────────────────────────────

/** Fetch function signature (matches global `fetch`) */
export type FetchFn = (url: string) => Promise<{
  ok: boolean;
  status?: number;
  statusText?: string;
  json: () => Promise<unknown>;
}>;

/** A single allergen with its level */
export interface AllergenLevel {
  name: string; // e.g., "Pollen", "Ragweed", "Grass"
  level: 0 | 1 | 2 | 3 | 4 | 5; // 0=none, 5=very high
  category: 'pollen' | 'mold' | 'dust' | 'other';
}

/** Full allergy/pollen data payload */
export interface AllergyData {
  index: number; // 0-5 overall index
  allergens: AllergenLevel[];
  lastUpdated: number; // Unix timestamp in ms
}

/** Location for allergy queries */
export interface AllergyLocation {
  lat: number;
  lon: number;
}

/** Configuration for createAllergiesServer */
export interface AllergiesServerOptions {
  /** API key for pollen data service */
  apiKey: string;
  /** Geographic location to query */
  location: AllergyLocation;
  /** Alert threshold (0-5) — emit notification when index >= this (default: 3) */
  alertThreshold?: number;
  /** Refresh interval in ms (default: 600000 = 10 min) */
  refreshInterval_ms?: number;
  /** Max staleness in ms before cache considered stale (default: 3600000 = 1 hour) */
  maxStale_ms?: number;
  /** Data bus instance for publishing allergen data */
  dataBus: DataBusInstance;
  /** Notification queue for emitting alerts */
  notifications: NotificationQueueInstance;
  /** Injectable fetch function (defaults to global fetch) */
  fetchFn?: FetchFn;
}

/** Instance returned by createAllergiesServer */
export interface AllergiesServerInstance {
  /** Manually trigger an allergy data refresh */
  refresh(): Promise<void>;
  /** Get the last fetched allergy data (null if not yet fetched) */
  getAllergyData(): AllergyData | null;
  /** Register a listener called when new data arrives; returns unsubscribe */
  onUpdate(callback: (data: AllergyData) => void): () => void;
  /** Register a listener called when an error occurs */
  onError(callback: (error: string) => void): void;
  /** Stop background refresh and release resources */
  close(): void;
}

// ── Crypto Prices Server ───────────────────────────────────────────────────

/** Price data for a single cryptocurrency */
export interface CoinPrice {
  id: string; // e.g., "bitcoin"
  symbol: string; // e.g., "btc"
  name: string; // e.g., "Bitcoin"
  price: number; // USD price
  change_1h: number; // percent change in 1 hour
  change_24h: number; // percent change in 24 hours
  change_7d: number; // percent change in 7 days
}

/** Full crypto prices payload */
export interface CryptoData {
  coins: CoinPrice[];
  lastUpdated: number; // Unix timestamp in ms
}

/** Alert configuration for a specific coin and change window */
export interface CryptoAlertConfig {
  coinId: string; // e.g., "bitcoin"
  threshold_pct: number; // absolute percent change threshold (e.g., 5 = ±5%)
  window: '1h' | '24h' | '7d'; // which change window to watch
}

/** Configuration for createCryptoServer */
export interface CryptoServerOptions {
  /** List of coin IDs to watch (CoinGecko IDs, e.g., ["bitcoin", "ethereum"]) */
  watchlist: string[];
  /** Alert configurations (optional) */
  alertConfigs?: CryptoAlertConfig[];
  /** Max staleness in ms before cache is stale (default: 300000 = 5 min) */
  maxStale_ms?: number;
  /** Data bus instance for publishing price data */
  dataBus: DataBusInstance;
  /** Notification queue for emitting alerts */
  notifications: NotificationQueueInstance;
  /** Injectable fetch function (defaults to global fetch) */
  fetchFn?: FetchFn;
}

/** Instance returned by createCryptoServer */
export interface CryptoServerInstance {
  /** Manually trigger a price refresh */
  refresh(): Promise<void>;
  /** Get the last fetched price data (null if not yet fetched) */
  getPrices(): CryptoData | null;
  /** Register a listener called when new data arrives; returns unsubscribe */
  onUpdate(callback: (data: CryptoData) => void): () => void;
  /** Register a listener called when an error occurs */
  onError(callback: (error: string) => void): void;
  /** Stop and release resources */
  close(): void;
}

// ── Photo Slideshow ────────────────────────────────────────────────────────
export type { PhotoSlideshow, KenBurnsConfig } from './photo-slideshow';

/** Full photo slideshow data payload published by photo-slideshow-server */
export interface PhotoSlideshowData {
  photoPaths: string[];
  lastUpdated: number; // Unix timestamp in ms
}
export {
  DEFAULT_KEN_BURNS_CONFIG,
  DEFAULT_CYCLE_INTERVAL_MS,
  SUPPORTED_IMAGE_EXTENSIONS,
} from './photo-slideshow';

// ── News ───────────────────────────────────────────────────────────────────
export type { NewsArticle, NewsData, NewsServerOptions, NewsServerInstance } from './news';
export { DEFAULT_NEWS_MAX_ITEMS, DEFAULT_NEWS_MAX_STALE_MS } from './news';

// ── Sports Scores ───────────────────────────────────────────────────────────
export type {
  SportsGame,
  GameStatus,
  LeagueConfig,
  SportsData,
  SportsServerOptions,
  SportsServerInstance,
} from './sports';
export { DEFAULT_SPORTS_MAX_STALE_MS, DEFAULT_SPORTS_LEAGUES } from './sports';

// ── Config Transfer ─────────────────────────────────────────────────────────
export type {
  ConfigExportV1,
  ConfigExport,
  ImportResult,
  ConfigMigration,
  ConfigTransferOptions,
  ConfigTransferInstance,
} from './config-transfer';
export { CURRENT_CONFIG_VERSION } from './config-transfer';

// ── Home Assistant ──────────────────────────────────────────────────────────
export type {
  HassEntity,
  HomeAssistantData,
  HomeAssistantServerOptions,
  HomeAssistantServerInstance,
  WsLike,
  WsFactory,
} from './home-assistant';
export { DEFAULT_HA_MAX_STALE_MS, DEFAULT_HA_DOMAINS } from './home-assistant';

// ── Weather ─────────────────────────────────────────────────────────────────
export type { WeatherProvider, WeatherCurrent, WeatherForecastDay, WeatherData } from './weather';

// ── PIR Sensor / Presence Detection ────────────────────────────────────────
export type {
  PresenceData,
  GpioWatcher,
  GpioWatcherFactory,
  PIRServerOptions,
  PIRServerInstance,
} from './pir-sensor';
export { DEFAULT_PIR_IDLE_TIMEOUT_MS, DEFAULT_PIR_GPIO_PIN } from './pir-sensor';

// ── Display Hardware Settings ────────────────────────────────────────────────
export type {
  DisplayMethod,
  DisplayCapability,
  DisplayCapabilities,
  DisplaySettings,
  RotationValue,
  DisplayHardwareOptions,
  DisplayHardwareInstance,
} from './display-settings';

// ── Module Settings ─────────────────────────────────────────────────────────
export type { ModuleId, ModuleSettingsSchema } from './module-settings';
export {
  MODULE_IDS,
  MODULE_SCHEMAS,
  SYSTEM_MODULE_IDS,
  getIntegrationFields,
  getWidgetFields,
  moduleNeedsIntegration,
} from './module-settings';

// ── Marketplace Browse Types ─────────────────────────────────────────────────

/** A plugin entry in the marketplace catalog */
export type MarketplaceConnectorType = 'json-api' | 'rss' | 'static';

export interface MarketplacePlugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  tags: string[];
  downloadUrl: string;
  /** Optional thumbnail image URL */
  thumbnail?: string;
  /** API connector type used by this plugin */
  connectorType?: MarketplaceConnectorType;
  /** Whether this plugin is currently installed on the device */
  installed: boolean;
  /** Whether an update is available for an installed plugin */
  updateAvailable: boolean;
}

/** A category in the marketplace with plugin count */
export interface MarketplaceCategory {
  name: string;
  count: number;
}

/** Paginated response from GET /marketplace */
export interface MarketplaceListResponse {
  plugins: MarketplacePlugin[];
  total: number;
  page: number;
  pageSize: number;
  /** True when serving from local cache due to network unavailability */
  offline: boolean;
}

/** Marketplace index from remote repository (index.json) */
export interface MarketplaceIndex {
  version: string;
  plugins: MarketplacePlugin[];
}

// ── Marketplace Settings ────────────────────────────────────────────────────
/** Marketplace configuration for publishing plugins */
export interface MarketplaceSettings {
  /** GitHub personal access token (encrypted at rest) */
  gitHubToken?: string;
  /** GitHub repository URL for the marketplace (default: lensing-marketplace) */
  marketplaceRepoUrl: string;
}

// ── Host Service (unified boot sequence) ────────────────────────────────────
import type { GpioWatcherFactory } from './pir-sensor';
/** Logger interface for host service */
export interface HostServiceLogger {
  debug(msg: string, data?: unknown): void;
  info(msg: string, data?: unknown): void;
  error(msg: string, error?: unknown): void;
}

/** Configuration options for the Host Service factory */
export interface HostServiceOptions {
  /** Port to listen on for REST API and WebSocket. Defaults to 3100 */
  port?: number;
  /** Directory to search for plugins. Defaults to './plugins' */
  pluginsDir?: string;
  /** Path to SQLite database file. Defaults to './data/lensing.db' */
  dbPath?: string;
  /** Logger for startup and errors. Defaults to console */
  logger?: HostServiceLogger;
  /** Directory containing pre-built static display files to serve */
  staticDir?: string;
  /** GPIO watcher factory for PIR sensor (auto-detected on Linux if omitted) */
  gpioFactory?: GpioWatcherFactory;
  /** Enable display DPMS control via PIR presence (default: false) */
  displayControl?: boolean;
}

// ── Connector Configuration ──────────────────────────────────────────────────
/** Field name to JSONPath/selector mapping for field extraction */
export interface ConnectorMapping {
  [fieldName: string]: string; // e.g., { title: '$.data.title', link: '$.url' }
}

/** JSON API connector configuration for REST API data sources */
export interface JsonApiConnectorConfig {
  type: 'json-api';
  /** URL to fetch JSON data from (must be http/https) */
  url: string;
  /** HTTP method (GET, POST, PUT, DELETE, PATCH) */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Optional HTTP headers to send with request */
  headers?: Record<string, string>;
  /** Refresh interval in milliseconds */
  refresh_ms: number;
  /** Map field names to JSONPath expressions for extracting data */
  mapping: ConnectorMapping;
}

/** RSS/Atom connector configuration for feed data sources */
export interface RssConnectorConfig {
  type: 'rss';
  /** URL to fetch RSS/Atom feed from (must be http/https) */
  url: string;
  /** Refresh interval in milliseconds */
  refresh_ms: number;
  /** Map field names to CSS selectors or standard feed field names (title, description, link, date, image) */
  mapping: ConnectorMapping;
}

/** Static data connector configuration for hardcoded/passthrough data */
export interface StaticConnectorConfig {
  type: 'static';
  /** Static data object to provide as-is (no fetching) */
  data: Record<string, unknown>;
}

/** Union type for all connector configurations (discriminated by type field) */
export type ConnectorConfig = JsonApiConnectorConfig | RssConnectorConfig | StaticConnectorConfig;

/**
 * Type guard for ConnectorConfig validation
 * Ensures URL format for JSON API and RSS connectors
 */
export function isValidConnectorConfig(value: unknown): value is ConnectorConfig {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;

  // Must have a type field
  if (!obj.type || typeof obj.type !== 'string') return false;

  const type = obj.type as string;

  if (type === 'json-api') {
    const config = obj as Record<string, unknown>;
    // Check required fields
    if (typeof config.url !== 'string' || !isValidHttpUrl(config.url)) return false;
    if (
      typeof config.method !== 'string' ||
      !['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method)
    ) {
      return false;
    }
    if (typeof config.refresh_ms !== 'number' || config.refresh_ms <= 0) return false;
    if (typeof config.mapping !== 'object' || config.mapping === null) return false;
    // Optional headers must be Record<string, string>
    if (config.headers !== undefined) {
      if (typeof config.headers !== 'object' || config.headers === null) return false;
      const headers = config.headers as Record<string, unknown>;
      if (!Object.values(headers).every((v) => typeof v === 'string')) return false;
    }
    return true;
  }

  if (type === 'rss') {
    const config = obj as Record<string, unknown>;
    // Check required fields
    if (typeof config.url !== 'string' || !isValidHttpUrl(config.url)) return false;
    if (typeof config.refresh_ms !== 'number' || config.refresh_ms <= 0) return false;
    if (typeof config.mapping !== 'object' || config.mapping === null) return false;
    return true;
  }

  if (type === 'static') {
    const config = obj as Record<string, unknown>;
    // Static just needs a data object
    if (typeof config.data !== 'object' || config.data === null) return false;
    return true;
  }

  return false;
}

/**
 * Validate that a URL is http or https
 */
function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
