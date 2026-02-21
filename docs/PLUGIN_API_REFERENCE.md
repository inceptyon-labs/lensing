# Plugin API Reference

Complete API reference for the Lensing plugin system. For a hands-on development guide, see [PLUGIN_DEVELOPMENT.md](./PLUGIN_DEVELOPMENT.md).

## Table of Contents

1. [Plugin Manifest Spec](#plugin-manifest-spec)
2. [SDK Types Reference](#sdk-types-reference)
3. [Plugin Lifecycle](#plugin-lifecycle)
4. [Data Bus API](#data-bus-api)
5. [Permissions](#permissions)

---

## Plugin Manifest Spec

Every plugin declares a `plugin.json` manifest in its root directory. The host validates this manifest before loading the plugin.

### Required Fields

| Field     | Type     | Constraints                             | Description              |
| --------- | -------- | --------------------------------------- | ------------------------ |
| `id`      | `string` | Non-empty                               | Unique plugin identifier |
| `name`    | `string` | Non-empty                               | Display name             |
| `version` | `string` | Non-empty, semantic version recommended | Plugin version           |

### Optional Fields

| Field           | Type                         | Default     | Description                      |
| --------------- | ---------------------------- | ----------- | -------------------------------- |
| `ui_entry`      | `string`                     | `undefined` | Path to UI component (Svelte)    |
| `server_entry`  | `string`                     | `undefined` | Path to server module (Node.js)  |
| `permissions`   | `PluginPermissions`          | `undefined` | Network and resource constraints |
| `widget_sizes`  | `WidgetSize[]` or `GridSpan` | `undefined` | Supported display sizes          |
| `dependencies`  | `string[]`                   | `[]`        | IDs of plugins this depends on   |
| `config_schema` | `PluginConfigSchema`         | `undefined` | Admin settings form definition   |

### Widget Sizes

Widgets can declare supported sizes as presets or custom grid spans:

**Preset sizes:**

```json
{
  "widget_sizes": ["small", "medium", "large"]
}
```

Valid presets: `"small"`, `"medium"`, `"large"`

**Custom grid span:**

```json
{
  "widget_sizes": {
    "min": [1, 1],
    "preferred": [2, 2],
    "max": [4, 3]
  }
}
```

Each tuple is `[columns, rows]`.

### Config Schema

Plugins can declare a configuration schema for admin settings forms:

```json
{
  "config_schema": {
    "fields": [
      {
        "key": "api_key",
        "type": "string",
        "label": "API Key",
        "description": "Your service API key",
        "required": true
      },
      {
        "key": "refresh_interval",
        "type": "number",
        "label": "Refresh Interval (seconds)",
        "default": 300,
        "min": 60,
        "max": 3600
      },
      {
        "key": "theme",
        "type": "select",
        "label": "Theme",
        "default": "dark",
        "options": [
          { "label": "Dark", "value": "dark" },
          { "label": "Light", "value": "light" }
        ]
      },
      {
        "key": "notifications_enabled",
        "type": "boolean",
        "label": "Enable Notifications",
        "default": true
      }
    ]
  }
}
```

**Field types:**

| Type      | Rendered As     | Extra Properties     |
| --------- | --------------- | -------------------- |
| `string`  | Text input      | —                    |
| `number`  | Number input    | `min`, `max`         |
| `boolean` | Toggle/checkbox | —                    |
| `select`  | Dropdown        | `options` (required) |

### Permissions Object

```json
{
  "permissions": {
    "allowed_domains": ["api.example.com", "cdn.example.com"],
    "max_refresh_ms": 300000,
    "max_request_burst": 5,
    "secrets": ["API_KEY", "API_SECRET"]
  }
}
```

| Field               | Type       | Default     | Description                                                                                  |
| ------------------- | ---------- | ----------- | -------------------------------------------------------------------------------------------- |
| `allowed_domains`   | `string[]` | `undefined` | Domains the plugin can make HTTP requests to. Subdomains of listed domains are also allowed. |
| `max_refresh_ms`    | `number`   | `undefined` | Minimum milliseconds between data refreshes. Must be a positive finite number.               |
| `max_request_burst` | `number`   | `undefined` | Maximum number of HTTP requests within a 60-second sliding window.                           |
| `secrets`           | `string[]` | `undefined` | Environment variable names the plugin is allowed to read.                                    |

### Complete Example

```json
{
  "id": "crypto-prices",
  "name": "crypto-prices",
  "version": "1.0.0",
  "ui_entry": "CryptoPrices.svelte",
  "server_entry": "server.ts",
  "permissions": {
    "allowed_domains": ["api.coingecko.com"],
    "max_refresh_ms": 300000,
    "max_request_burst": 5,
    "secrets": ["COINGECKO_API_KEY"]
  },
  "widget_sizes": ["small", "medium"],
  "dependencies": [],
  "config_schema": {
    "fields": [
      {
        "key": "watchlist",
        "type": "string",
        "label": "Coin IDs (comma-separated)",
        "default": "bitcoin,ethereum"
      }
    ]
  }
}
```

### Validation Rules

The manifest validator enforces:

- All required fields (`id`, `name`, `version`) must be present and non-empty strings
- Optional string fields (`ui_entry`, `server_entry`) must be strings if present
- `dependencies` must be an array of strings if present
- `widget_sizes` must be an array of strings if present (preset mode)
- `permissions` must be an object if present, with:
  - `allowed_domains`: array of strings
  - `max_refresh_ms`: positive finite number
  - `max_request_burst`: positive finite number (enforced at runtime)
  - `secrets`: array of strings
- `config_schema.fields` must be an array of valid field definitions

---

## SDK Types Reference

The `@lensing/types` package exports all shared interfaces. Import them in your plugin:

```typescript
import type { PluginManifest, DataBusInstance, CacheStore } from '@lensing/types';
```

### Core Plugin Types

#### `PluginManifest`

```typescript
interface PluginManifest {
  id: string;
  name: string;
  version: string;
  ui_entry?: string;
  server_entry?: string;
  permissions?: PluginPermissions;
  widget_sizes?: WidgetSize[] | GridSpan;
  dependencies?: string[];
}
```

#### `PluginPermissions`

```typescript
interface PluginPermissions {
  allowed_domains?: string[];
  max_refresh_ms?: number;
  max_request_burst?: number;
  secrets?: string[];
}
```

#### `PluginInstance`

Runtime state of a loaded plugin tracked by the host.

```typescript
type PluginStatus = 'loading' | 'active' | 'error' | 'disabled';

interface PluginInstance {
  id: string;
  manifest: PluginManifest;
  status: PluginStatus;
  last_refresh?: string;
  error?: string;
}
```

#### `LoadedPlugin`

Result of the plugin loading process.

```typescript
type PluginLoadStatus = 'loading' | 'loaded' | 'error';

interface LoadedPlugin {
  manifest: PluginManifest;
  status: PluginLoadStatus;
  ui_module?: Record<string, unknown>;
  server_module?: Record<string, unknown>;
  error?: string;
}
```

### Data Bus Types

#### `DataBusMessage<T>`

```typescript
interface DataBusMessage<T = unknown> {
  channel: string; // Channel name (e.g., "crypto.prices")
  data: T; // Frozen payload
  timestamp: string; // ISO 8601
  plugin_id: string; // Publishing plugin ID
}
```

#### `DataBusSubscriber<T>`

```typescript
type DataBusSubscriber<T = unknown> = (message: DataBusMessage<T>) => void;
```

#### `DataBusInstance`

```typescript
interface DataBusInstance {
  publish<T>(channel: string, pluginId: string, data: T): void;
  subscribe<T>(channel: string, callback: DataBusSubscriber<T>): () => void;
  getLatest<T>(channel: string): DataBusMessage<T> | undefined;
  getChannels(): string[];
  onMessage(callback: DataBusSubscriber): () => void;
  clear(): void;
  close(): void;
}
```

### Cache Types

#### `CacheStore`

```typescript
interface CacheStore {
  read<T>(key: string): CacheEntry<T> | undefined;
  write<T>(key: string, value: T, policy: StalePolicy): void;
  getStaleStatus(key: string): StaleStatus;
  invalidate(key: string): void;
  readOrFetch<T>(key: string, fetcher: () => Promise<T>, policy: StalePolicy): Promise<T>;
}
```

#### `StalePolicy`

```typescript
interface StalePolicy {
  max_stale_ms: number; // Maximum age before entry is considered stale
  source?: string; // Optional source identifier
}
```

#### `StaleStatus`

```typescript
interface StaleStatus {
  stale: boolean;
  found: boolean;
  age_ms?: number;
}
```

#### `CacheEntry<T>`

```typescript
interface CacheEntry<T = unknown> {
  value: T;
  createdAt: number;
  max_stale_ms: number;
  source?: string;
}
```

### Notification Types

#### `NotificationQueueInstance`

```typescript
interface NotificationQueueInstance {
  emit(options: EmitOptions): string;
  list(filter?: NotificationFilter): NotificationEntry[];
  markRead(id: string): void;
  dismiss(id: string): void;
  clear(): void;
  emitSystemEvent(event: 'plugin_error' | 'connectivity_loss', detail: string): string;
  onNotification(callback: (entry: NotificationEntry) => void): () => void;
  close(): void;
}
```

#### `EmitOptions`

```typescript
interface EmitOptions {
  source: string;
  priority: NotificationPriority; // 'info' | 'warning' | 'urgent'
  title: string;
  body?: string;
  ttl_ms?: number;
  dedupe_key?: string;
}
```

### Layout Types

#### `ZoneName` and `ZoneConfig`

```typescript
type ZoneName = 'top-bar' | 'left-col' | 'center' | 'right-col' | 'bottom-bar';

interface ZoneConfig {
  zone: ZoneName;
  columns: number;
  rows: number;
  plugins: string[];
}
```

#### `GridSpan`

```typescript
interface GridSpan {
  min: [cols: number, rows: number];
  preferred: [cols: number, rows: number];
  max: [cols: number, rows: number];
}
```

### Scene Types

#### `SceneConfig`

```typescript
type SceneName = 'morning' | 'evening' | 'ambient' | 'focus' | 'alert';
type ColorTemp = 'warm' | 'neutral' | 'cool';

interface SceneVisuals {
  opacity: number; // 0-1
  color_temp: ColorTemp;
}

interface SceneConfig {
  name: SceneName | string;
  layout: ZoneConfig[];
  active_plugins: string[];
  visuals?: SceneVisuals;
}
```

### WebSocket Types

#### `WsMessage<T>`

```typescript
type WsMessageType =
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

interface WsMessage<T = unknown> {
  type: WsMessageType;
  payload: T;
  timestamp: string;
}
```

---

## Plugin Lifecycle

Plugins progress through a well-defined lifecycle managed by the host.

### Overview

```
Discovery → Loading → Scheduling → Execution → Unload
                                       ↑          |
                                       +-- Reload -+
```

### Phase 1: Discovery

The plugin loader scans the plugins directory for subdirectories containing `plugin.json`.

```typescript
const loader: PluginLoader = createPluginLoader({
  pluginsDir: '/path/to/plugins',
  readDir,
  readFile,
  importModule,
});

const discovered: DiscoveredPlugin[] = await loader.discover();
```

**What happens:**

1. Scans `pluginsDir` for subdirectories
2. Reads `plugin.json` from each subdirectory
3. Validates the manifest against the schema
4. Returns `DiscoveredPlugin[]` without loading any modules

```typescript
interface DiscoveredPlugin {
  id: string;
  manifest: PluginManifest;
  manifestPath: string;
}
```

**No side effects.** Discovery only reads and validates manifests.

### Phase 2: Loading

Loading dynamically imports plugin modules (UI and server entry points).

```typescript
const loaded: LoadedPlugin[] = await loader.load();
```

**What happens:**

1. Calls `discover()` internally
2. For each discovered plugin:
   - If `ui_entry` defined: dynamically imports the UI module
   - If `server_entry` defined: dynamically imports the server module
3. Sets `status` to `'loaded'` on success or `'error'` on failure
4. Errors are collected but do not block other plugins from loading

**State transitions:**

```
'loading' → 'loaded'   (success)
'loading' → 'error'    (import failure, invalid module)
```

**Query loaded plugins:**

```typescript
const plugin = loader.getPlugin('crypto-prices'); // Single plugin
const all = loader.getAllPlugins(); // All plugins
const errors = await loader.getErrors(); // Map<id, errorMessage>
```

### Phase 3: Scheduling

The plugin scheduler manages periodic refresh intervals for server modules.

```typescript
import { createPluginScheduler } from '@lensing/core';

const scheduler = createPluginScheduler({
  defaultInterval: 60000, // 1 minute default
});
```

**Register a plugin:**

```typescript
scheduler.register(
  'crypto-prices', // Plugin ID
  manifest, // PluginManifest (for permission limits)
  async () => {
    // Handler: called on each tick
    await fetchAndPublish();
  },
  300000 // Optional: override interval (ms)
);
```

**Interval resolution:**

1. If override provided: clamp to `max_refresh_ms` floor (never faster than declared)
2. If no override: use `max_refresh_ms` from manifest
3. If neither: use scheduler's `defaultInterval` (60000ms)
4. Minimum enforced: 100ms (prevents CPU churn)

**Start execution:**

```typescript
scheduler.start('crypto-prices'); // Start single plugin
scheduler.startAll(); // Start all registered plugins
```

**Scheduler entry state:**

```typescript
type SchedulerStatus = 'stopped' | 'running' | 'error';

interface SchedulerEntry {
  pluginId: string;
  interval: number; // Effective interval in ms
  status: SchedulerStatus;
  lastRun?: number; // Timestamp of last execution
  nextRun?: number; // Timestamp of next scheduled run
  runCount: number; // Total successful executions
  error?: string; // Last error message
}
```

**Query state:**

```typescript
const state = scheduler.getState(); // Map<id, SchedulerEntry>
const entry = scheduler.getPluginState('crypto-prices');
```

### Phase 4: Execution

On each scheduled tick, the handler executes:

1. **Generation check** — Validates the callback is still current (not stale from a stop/restart)
2. **Burst check** — Counts executions within a 60-second sliding window against `max_request_burst`
3. **Handler execution** — Calls `await handler()`
4. **State update** — Updates `lastRun`, `runCount`, schedules next tick
5. **Error handling** — Sets status to `'error'`, records message, continues scheduling

**Burst rate limiting:**

If `max_request_burst` is defined in the manifest, the scheduler enforces a sliding window:

```
Window: 60,000ms (1 minute)
If executions >= max_request_burst within window:
  → Skip execution, reschedule at normal interval
```

**Generation token pattern:**

Each `start()`, `stop()`, `restart()`, or `unregister()` increments an internal generation counter. When a timer fires, it checks if the generation still matches. This prevents race conditions when plugin state changes during an async handler.

### Phase 5: Unload

```typescript
// Stop scheduling
scheduler.stop('crypto-prices');
scheduler.unregister('crypto-prices');

// Unload module
await loader.unload('crypto-prices');
```

**What happens:**

1. `stop()` — Increments generation token, clears pending timer, sets status to `'stopped'`
2. `unregister()` — Removes the plugin from the scheduler entirely
3. `unload()` — Removes the plugin from the loader registry and clears errors

### Reload

Hot reload re-discovers and re-imports all plugins:

```typescript
const reloaded = await loader.reload();
```

This resets internal state and calls `load()` again. Used during development.

For the scheduler, use `restart()`:

```typescript
scheduler.restart('crypto-prices'); // Clears burst window, resets, restarts
```

---

## Data Bus API

The data bus provides channel-based publish/subscribe communication between plugins.

### Creating a Data Bus

```typescript
import { createDataBus } from '@lensing/core';

const dataBus: DataBusInstance = createDataBus();
```

### Publishing

```typescript
dataBus.publish<CryptoData>('crypto.prices', 'crypto-prices', {
  coins: [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      price: 45000,
      change_1h: 0.5,
      change_24h: 2.3,
      change_7d: -1.1,
    },
  ],
  lastUpdated: Date.now(),
});
```

**Parameters:**

| Parameter  | Type     | Description                            |
| ---------- | -------- | -------------------------------------- |
| `channel`  | `string` | Channel name (e.g., `"crypto.prices"`) |
| `pluginId` | `string` | ID of the publishing plugin            |
| `data`     | `T`      | Payload (will be frozen)               |

**Behavior:**

- Creates a `DataBusMessage` with the payload, plugin ID, and ISO 8601 timestamp
- **Freezes** the message with `Object.freeze()` to prevent mutation
- Stores as the latest message for the channel
- Notifies all channel-specific subscribers
- Notifies all global listeners
- Subscriber errors are caught and isolated (one failing subscriber does not affect others)

### Subscribing

```typescript
// Channel-specific subscription
const unsubscribe = dataBus.subscribe<CryptoData>('crypto.prices', (message) => {
  console.log(`Price update from ${message.plugin_id}:`, message.data.coins);
});

// Later: stop listening
unsubscribe();
```

**Returns:** An unsubscribe function. Call it to remove the subscription.

### Global Listeners

Global listeners receive every message on every channel. Useful for WebSocket forwarding.

```typescript
const removeListener = dataBus.onMessage((message) => {
  // Forward to connected WebSocket clients
  wsServer.broadcast(message);
});
```

### Querying

```typescript
// Get the most recent message on a channel
const latest = dataBus.getLatest<CryptoData>('crypto.prices');
if (latest) {
  console.log(`Last update: ${latest.timestamp}`);
}

// List all channels that have received at least one publish
const channels: string[] = dataBus.getChannels();
// → ['crypto.prices', 'weather.current', 'calendar.events']
```

### Channel Naming Conventions

Use dot-separated namespaces:

| Pattern               | Example            | Description           |
| --------------------- | ------------------ | --------------------- |
| `{plugin}.{data}`     | `crypto.prices`    | Plugin-specific data  |
| `{plugin}.{data}`     | `weather.current`  | Current weather data  |
| `{plugin}.{data}`     | `calendar.events`  | Calendar events       |
| `{domain}.{resource}` | `allergies.levels` | Allergy/pollen levels |

### Error Isolation

Subscriber callbacks are wrapped in try/catch:

```typescript
// If this subscriber throws, other subscribers still receive the message
dataBus.subscribe('crypto.prices', () => {
  throw new Error('Bug in my handler');
});

// This subscriber is unaffected
dataBus.subscribe('crypto.prices', (msg) => {
  // Still called successfully
});
```

### Lifecycle

```typescript
dataBus.clear(); // Remove all channels, subscriptions, and cached messages
dataBus.close(); // Fully close the bus (prevents future publishes)
```

---

## Permissions

The permission system enforces resource constraints declared in the plugin manifest. There are three enforcement points: network domains, refresh rates, and secret access.

### Permission Enforcer

Create an enforcer for a plugin to wrap all permission checks:

```typescript
import { createPermissionEnforcer } from '@lensing/core';

const enforcer = createPermissionEnforcer(manifest, {
  onViolation: (violation) => {
    console.warn(`Permission violation: ${violation.type}`, violation.details);
  },
});
```

### Network Domain Validation

Controls which domains a plugin can make HTTP requests to.

**Declaration:**

```json
{
  "permissions": {
    "allowed_domains": ["api.coingecko.com", "example.com"]
  }
}
```

**Enforcement:**

```typescript
// Create a fetch proxy that validates domains
const safeFetch = enforcer.createFetchProxy(globalThis.fetch);

// Allowed: domain is in the whitelist
await safeFetch('https://api.coingecko.com/api/v3/coins'); // ✓

// Allowed: subdomain of a whitelisted domain
await safeFetch('https://sub.example.com/data'); // ✓

// Blocked: domain not in whitelist → throws Error
await safeFetch('https://evil.com/steal'); // ✗ Error thrown
```

**Matching rules:**

- Exact match: `api.coingecko.com` matches `api.coingecko.com`
- Subdomain match: `sub.example.com` matches parent domain `example.com`
- Invalid URLs are blocked by default
- If no `allowed_domains` declared, all domains are allowed

**Standalone validation:**

```typescript
import { validateNetworkDomain } from '@lensing/core';

const allowed = validateNetworkDomain('https://api.example.com/data', permissions);
// → true
```

### Refresh Rate Enforcement

Controls how frequently a plugin can refresh its data.

**Declaration:**

```json
{
  "permissions": {
    "max_refresh_ms": 300000
  }
}
```

This means the plugin cannot refresh more frequently than once every 300 seconds (5 minutes).

**Enforcement:**

```typescript
const validation = enforcer.validateRefresh(lastRefreshTimestamp);

if (validation.allowed) {
  await refresh();
} else {
  // Wait before retrying
  console.log(`Retry after ${validation.retryAfter}ms`);
}
```

**Standalone validation:**

```typescript
import { validateRefreshRate } from '@lensing/core';

const allowed = validateRefreshRate(lastRefreshMs, permissions);
// → true (enough time has elapsed) or false (too soon)
```

**Rules:**

- First refresh is always allowed (no previous timestamp)
- Calculates: `now - lastRefreshMs >= max_refresh_ms`
- If no `max_refresh_ms` declared, all refreshes are allowed
- The scheduler also enforces this via interval clamping

### Burst Rate Limiting

Controls the maximum number of requests within a sliding window.

**Declaration:**

```json
{
  "permissions": {
    "max_request_burst": 5
  }
}
```

**Enforcement:**

The plugin scheduler enforces burst limits automatically:

- Sliding window: 60,000ms (1 minute)
- If executions within the window >= `max_request_burst`, the tick is skipped
- Execution resumes on the next scheduled interval
- The burst window is cleared on `restart()`

### Secret Access Control

Controls which environment variables a plugin can read.

**Declaration:**

```json
{
  "permissions": {
    "secrets": ["API_KEY", "API_SECRET"]
  }
}
```

**Enforcement:**

```typescript
// Only returns secrets declared in the manifest
const authorized = enforcer.getAuthorizedSecrets({
  API_KEY: 'abc123',
  API_SECRET: 'xyz789',
  DATABASE_URL: 'postgres://...', // Not declared → filtered out
});
// → { API_KEY: 'abc123', API_SECRET: 'xyz789' }
```

**Standalone validation:**

```typescript
import { validateSecretAccess } from '@lensing/core';

validateSecretAccess('API_KEY', permissions); // → true
validateSecretAccess('DATABASE_URL', permissions); // → false
```

**Rules:**

- If `secrets` is not declared or is empty, all secret access is blocked
- Only secrets explicitly listed in the manifest are allowed
- Unauthorized access attempts are recorded as violations

### Violation Tracking

All permission violations are recorded for audit:

```typescript
interface PermissionViolation {
  plugin_id: string;
  type: 'network' | 'refresh_rate' | 'secret_access';
  timestamp: string; // ISO 8601
  details: string;
}
```

**Query violations:**

```typescript
const violations = enforcer.getViolations();
enforcer.clearViolations();
```

**Violation callback:**

```typescript
const enforcer = createPermissionEnforcer(manifest, {
  onViolation: (violation) => {
    notificationQueue.emit({
      source: 'system',
      priority: 'warning',
      title: `Permission violation: ${violation.type}`,
      body: violation.details,
    });
  },
});
```

### Integration Example

Complete example showing all permission enforcement points together:

```typescript
import { createPermissionEnforcer } from '@lensing/core';
import type { PluginManifest, DataBusInstance } from '@lensing/types';

function initializePlugin(
  manifest: PluginManifest,
  dataBus: DataBusInstance,
  envSecrets: Record<string, string>
) {
  // 1. Create permission enforcer
  const enforcer = createPermissionEnforcer(manifest, {
    onViolation: (v) => console.warn(`[${manifest.id}] ${v.type}: ${v.details}`),
  });

  // 2. Get authorized secrets only
  const secrets = enforcer.getAuthorizedSecrets(envSecrets);

  // 3. Create domain-checked fetch
  const safeFetch = enforcer.createFetchProxy(globalThis.fetch);

  // 4. Refresh with rate validation
  let lastRefresh: number | undefined;

  async function refresh() {
    const check = enforcer.validateRefresh(lastRefresh);
    if (!check.allowed) return;

    const response = await safeFetch('https://api.example.com/data', {
      headers: { Authorization: `Bearer ${secrets.API_KEY}` },
    });
    const data = await response.json();

    lastRefresh = Date.now();
    dataBus.publish('my-plugin.data', manifest.id, data);
  }

  return { refresh, enforcer };
}
```

---

## Further Reading

- [Plugin Development Guide](./PLUGIN_DEVELOPMENT.md) — Hands-on walkthrough for building plugins
- [`@lensing/types`](../packages/types/src/index.ts) — Full type definitions (source of truth)
- [`@lensing/core`](../packages/core/src/) — Core module implementations
