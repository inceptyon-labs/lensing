# Lensing

A modern, plugin-driven personal information dashboard built on SvelteKit. Designed for always-on displays like Raspberry Pi, but runs on any browser, tablet, or screen.

Named after gravitational lensing — the phenomenon where spacetime bends light to reveal hidden information. This dashboard bends disparate data feeds into a single, glanceable surface.

## Quick Start

```bash
# Prerequisites: Node.js >= 22, pnpm >= 8

git clone https://github.com/your-org/lensing.git
cd lensing
pnpm install
pnpm build
pnpm dev
```

## Architecture

Lensing is a monorepo with two runtime layers connected by WebSocket:

```
Host (Node.js)                         Display (Chromium)
┌─────────────────────────┐            ┌──────────────────────┐
│  Plugin Loader           │            │  SvelteKit App        │
│  Scheduler & Cache       │  WebSocket │  Zone Layout (5)      │
│  Data Bus (pub/sub)      │ ─────────> │  Widget Rendering     │
│  REST API & WebSocket    │            │  Scene Switching      │
│  SQLite Database         │            │  Admin Panel          │
│  Built-in Servers        │            │  Error Boundaries     │
└─────────────────────────┘            └──────────────────────┘
```

### Monorepo Structure

| Package                  | Description                                                     |
| ------------------------ | --------------------------------------------------------------- |
| `packages/types`         | Shared TypeScript types and interfaces                          |
| `packages/core`          | Host services: plugin loader, scheduler, database, data servers |
| `packages/ui`            | Svelte stores and UI state management                           |
| `packages/cli`           | CLI commands for dev, plugin management, and scenes             |
| `packages/create-plugin` | Starter template for building plugins                           |
| `apps/display`           | SvelteKit display application (kiosk frontend)                  |

## Built-in Plugins

| Plugin          | Source         | Description                              |
| --------------- | -------------- | ---------------------------------------- |
| Weather         | OpenWeatherMap | Current conditions and forecast          |
| Calendar        | CalDAV/iCloud  | Upcoming events via CalDAV               |
| Crypto          | CoinGecko      | Prices with change tracking and alerts   |
| News            | RSS            | Headline aggregation from multiple feeds |
| Sports          | ESPN           | Live scores and upcoming schedules       |
| Allergies       | Pollen API     | Allergen levels with thresholds          |
| Home Assistant  | HA REST/WS     | Smart home device states                 |
| Photo Slideshow | Local          | Ambient slideshow with Ken Burns effect  |
| PIR Sensor      | GPIO           | Motion-based display wake/sleep          |

## Display Layout

The display uses a 5-zone grid system. Scenes define which widgets appear in each zone along with visual settings (opacity, color temperature).

```
┌──────────────────────────────────┐
│           top-bar                │
├────┬────────────────────┬───────┤
│    │                    │       │
│ L  │      center        │   R   │
│    │                    │       │
├────┴────────────────────┴───────┤
│          bottom-bar              │
└──────────────────────────────────┘
```

Scenes can switch automatically on a schedule (e.g., morning dashboard at 7am, ambient photos at 10pm) or be triggered manually via the CLI or admin panel.

## Creating a Plugin

Scaffold a new plugin:

```bash
pnpm lensing plugin create my-plugin
```

Or manually create a `plugin.json` manifest:

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "server_entry": "./server.ts",
  "ui_entry": "./Widget.svelte",
  "permissions": {
    "allowed_domains": ["api.example.com"],
    "max_refresh_ms": 60000,
    "secrets": ["API_KEY"]
  },
  "widget_sizes": ["small", "medium"]
}
```

Implement the server module using the factory pattern:

```typescript
export function createMyServer(options: MyServerOptions) {
  return {
    async initialize() {
      /* setup */
    },
    async handleRequest() {
      /* fetch data */
    },
    onActivate() {
      /* start polling */
    },
    onDeactivate() {
      /* cleanup */
    },
  };
}
```

See `packages/create-plugin/` for a complete reference implementation.

## CLI

```bash
lensing dev                     # Start dev server with hot reload
lensing plugin create <name>    # Scaffold a new plugin
lensing scene list              # List available scenes
lensing scene switch <name>     # Switch active scene
```

## Development

```bash
pnpm dev          # Start all packages in dev mode
pnpm build        # Build in dependency order
pnpm test         # Run all tests (vitest)
pnpm lint         # ESLint
pnpm format       # Prettier
```

Individual packages:

```bash
pnpm --filter @lensing/core test
pnpm --filter @lensing/ui build
```

## Deployment (Raspberry Pi)

1. Build the project: `pnpm build`
2. Start the host service (manages plugins, database, WebSocket)
3. Launch Chromium in kiosk mode pointed at the display app
4. Optional: configure as a systemd service for auto-start

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, plugin guidelines, and PR process.

## License

[MIT](LICENSE)
