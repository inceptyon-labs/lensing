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

/** Scene configuration */
export interface SceneConfig {
  name: SceneName | string;
  layout: ZoneConfig[];
  active_plugins: string[];
}

/** Data bus channel message */
export interface DataBusMessage<T = unknown> {
  channel: string;
  data: T;
  timestamp: string;
  plugin_id: string;
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
