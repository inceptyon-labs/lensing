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
export type WsMessageType =
  | 'layout_change'
  | 'plugin_data'
  | 'scene_change'
  | 'ping'
  | 'pong'
  | 'ask_response';

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

/** Database configuration options */
export interface DatabaseOptions {
  /** Path to the SQLite database file, or ':memory:' for in-memory */
  path?: string;
}

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
