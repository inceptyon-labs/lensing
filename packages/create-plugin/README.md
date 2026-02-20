# @lensing/create-plugin

Starter plugin template for Lensing — a fully-documented reference
implementation for building ambient display plugins.

## Quickstart

```bash
# Copy this template to start a new plugin
cp -r packages/create-plugin packages/my-plugin
cd packages/my-plugin

# Rename the package
# Edit package.json: "name": "@lensing/my-plugin"
# Edit plugin.json: "id": "my-plugin", "name": "My Plugin"

# Install and test
pnpm install
pnpm test

# Preview in live dashboard
lensing dev
```

## File Structure

```
create-plugin/
├── plugin.json           # Plugin manifest — id, permissions, entry points
├── src/
│   ├── server.ts         # Server module — data fetching, secrets, lifecycle hooks
│   ├── widget.svelte     # Svelte 5 UI component — rendering, interaction
│   ├── index.ts          # Package entry point — exports and types
│   └── __tests__/
│       └── plugin.test.ts  # Test harness — sample data payloads, assertions
└── README.md
```

## Plugin Manifest (`plugin.json`)

```json
{
  "id": "starter-plugin",
  "name": "Starter Plugin",
  "version": "1.0.0",
  "ui_entry": "widget.svelte",
  "server_entry": "server.ts",
  "permissions": {
    "allowed_domains": ["api.example.com"],
    "max_refresh_ms": 5000,
    "max_request_burst": 10,
    "secrets": ["API_KEY"]
  },
  "widget_sizes": ["small", "medium"]
}
```

**Required fields**: `id`, `name`, `version`

**Permissions**:
- `allowed_domains` — External domains the server module may call
- `max_refresh_ms` — Minimum milliseconds between data refreshes
- `max_request_burst` — Maximum concurrent requests allowed
- `secrets` — Secret env vars injected as `process.env.PLUGIN_<NAME>`

## Server Module (`server.ts`)

The server module runs in the Lensing core process (Node.js). It handles
data fetching, secret management, and computation. The widget communicates
with it via `sdk.request()`.

### Lifecycle hooks

```ts
// Called once when the plugin loads
export async function initialize(config: ServerConfig): Promise<{ ready: boolean }>

// Called for each widget request
export async function handleRequest(payload: RequestPayload): Promise<RequestResult>

// Called when widget becomes visible
export async function onActivate(): Promise<{ status: string }>

// Called when widget is hidden
export async function onDeactivate(): Promise<{ status: string }>
```

### Example server module

```ts
export async function initialize(config: ServerConfig) {
  if (!config.apiKey) throw new Error('API key required');
  _config = config;
  return { ready: true };
}

export async function handleRequest(payload: RequestPayload) {
  switch (payload.action) {
    case 'fetch-weather':
      const res = await fetch(`${_config.endpoint}/weather`, {
        headers: { Authorization: `Bearer ${_config.apiKey}` },
      });
      const data = await res.json();
      return { success: true, data: { temperature: data.temp } };
    default:
      return { success: false, error: `Unknown action: ${payload.action}` };
  }
}
```

## Widget Component (`widget.svelte`)

The widget is a Svelte 5 component rendered inside the Lensing display.
It receives data as props and calls back to the server module via `onUpdate`.

### Props

```ts
let { id, data, onUpdate }: {
  id: string;                          // Unique widget instance ID
  data: Record<string, unknown>;       // Data from server module
  onUpdate: (newData?: unknown) => void; // Trigger server refresh
} = $props();
```

### Example widget

```svelte
<script lang="ts">
  let { data, onUpdate } = $props();
</script>

<div class="plugin-widget">
  <h2>{data.temperature}°F</h2>
  <button onclick={() => onUpdate()}>Refresh</button>
</div>
```

## Testing

The test harness (`__tests__/plugin.test.ts`) covers:
- Plugin manifest schema validation
- Server lifecycle functions
- Widget props interface
- Sample data payloads (weather, calendar, generic)
- Error handling

```bash
pnpm test                  # Run tests
pnpm --filter @lensing/create-plugin test  # Run from monorepo root
```

### Sample data payloads

```ts
// Weather
const weatherData = {
  temperature: 68, humidity: 65, condition: 'Cloudy',
  forecast: [{ time: '12pm', temp: 70 }, { time: '3pm', temp: 72 }],
};

// Calendar
const calendarData = {
  current_date: '2026-02-19',
  events: [{ title: 'Team Meeting', start: '...', end: '...' }],
};
```

## SDK Conventions

Following these patterns ensures your plugin integrates correctly:

1. **Factory pattern** — Use `createX()` functions returning typed interfaces
2. **Type safety** — TypeScript strict mode; always type your exports
3. **Error handling** — Return `{ success: false, error }` instead of throwing from `handleRequest()`
4. **Scoped styles** — Prefix all CSS with `.plugin-widget` to avoid leaking
5. **Secret handling** — Never pass secrets as props; keep them in server.ts
6. **Permissions first** — Declare all domains in `allowed_domains` before calling them

## Publishing

This package is published as `@lensing/create-plugin`. It serves as:

- A documentation reference for the plugin SDK
- A copy-paste starting point for new plugins
- A test suite template that validates plugin structure

```bash
pnpm build       # Compile TypeScript
pnpm publish     # Publish to npm registry
```
