# Lensing — Build Plan

> *"A surface that bends information into clarity."*

**Lensing** is a modern, open-source personal information dashboard. It replaces MagicMirror² with a fast, plugin-driven system built on SvelteKit, designed for Raspberry Pi but runnable on any display, tablet, or browser.

---

## 0) Name & Brand

### Name Origin
**Gravitational lensing** — the phenomenon where spacetime curves around massive objects, bending light to reveal what would otherwise be hidden. Your dashboard is a data gravity well: it bends disparate information feeds into a single, curated, visible surface.

Direct connection to Christopher Nolan's *Interstellar* — the visual of light bending around Gargantua is one of the most iconic images in modern sci-fi. The name is technical enough to signal sophistication, accessible enough that anyone can say and spell it.

### Taglines (pick one)
- **"Bend your data into focus."** — primary, action-oriented
- **"A surface that bends information into clarity."** — descriptive, for docs/README
- **"What's hidden, revealed."** — minimal, mysterious
- **"Your personal gravity well."** — playful, physics-forward
- **"See what matters."** — clean, universal

### Naming Details
- **GitHub**: `lensing` or `lensing-dashboard`
- **npm scope**: `@lensing/core`, `@lensing/plugin-weather`, etc.
- **CLI**: `lensing dev`, `lensing start`, `lensing plugin add weather`
- **Aesthetic**: dark, ambient, glanceable — the UI should feel like looking through a lens at structured light

### Known Namespace Notes
- npm `lensing` (unscoped) is taken by an inactive OpenSeadragon plugin — use `@lensing/*` scoped packages
- "Lensing" in search results skews toward astrophysics tooling (LensTools, lenstronomy) — no consumer software conflicts
- SEO-winnable queries: "lensing dashboard", "lensing smart display", "lensing home screen"

---

## 1) Guiding constraints (Pi 3B)
- **No Electron**: use **Chromium kiosk mode** for lower overhead.
- Keep the Pi as **display host + lightweight controller**.
- Do heavy AI work **off-device** (homelab/VM/hosted API).
- Prefer **server-side data plugins** and push small JSON updates to the UI.
- **Presence-aware**: use PIR sensor (GPIO) or USB camera with simple motion detection to wake/sleep the display — saves power and extends screen longevity on a device running 24/7.

---

## 2) Target architecture

### Two UIs
1. **Lensing Display (kiosk)**
   - Fullscreen dashboard
   - Big typography, low CPU
   - Minimal animations, minimal client JS
   - Svelte error boundaries per widget — a bad plugin never crashes the whole display

2. **Lensing Admin (web)**
   - Open from phone/laptop
   - Configure layout, enable/disable plugins, set refresh rates, manage keys
   - Logs + health indicators
   - Notification feed + plugin resource monitoring

### Processes
1. **Lensing Host (Node)**
   - Serves the app
   - Plugin manager + scheduler
   - Caching + persistence (SQLite)
   - WebSocket push to display UI (with automatic reconnection on network hiccups / Pi wake)
   - Local API for admin actions
   - Notification queue + routing

2. **Chromium Kiosk**
   - Renders the UI fullscreen
   - Auto-start on boot and auto-recover via systemd
   - Recommended flags: `--disable-gpu`, `--memory-pressure-off` to manage Pi 3B memory pressure

### Layout & Composition System
An early architectural decision that ripples through the plugin SDK.

- **Zone-based layout**: named regions (top-bar, left-col, center, right-col, bottom-bar) — plugins are assigned to zones via admin UI
- **Grid cells within zones**: CSS grid with configurable rows/columns; plugins snap to cells and declare preferred/min/max sizes
- **Layout profiles**: multiple saved layouts that switch by time-of-day, presence state, or manual toggle
- Layout configuration persisted in SQLite, editable via drag-and-drop in admin UI

### Display Modes (Scenes)
The display isn't one static view — it shifts based on context.

- **Morning mode**: calendar-heavy, weather prominent, morning brief front and center
- **Evening mode**: sports scores, news digest, next-day preview
- **Ambient / sleep mode**: clock only (dimmed), or cycle through photos/art — doubles as a digital photo frame
- **Focus mode**: single plugin fullscreen (e.g., just the calendar before a meeting)
- **Alert mode**: urgent notification overlay (severe weather, imminent calendar event)

Scene triggers:
- **Time-based**: cron-style schedule (morning at 6am, evening at 6pm, sleep at 11pm)
- **Presence-based**: PIR/camera detects motion → wake from ambient; no motion for N minutes → dim to ambient
- **Agent-driven**: the agent service can push a scene change (e.g., "focus on calendar" when an event is 10 minutes away)
- **Manual**: switch from admin UI or CLI

### Notification System
Cross-cutting concern that spans plugins, agent, and both UIs.

- **Priority levels**: `info`, `warning`, `urgent`
- **Display overlay**: urgent notifications appear as a banner/toast on the kiosk display
- **Admin push**: notifications forwarded to admin UI (phone/laptop) — consider Web Push API for native notifications
- **Notification queue**: persisted in SQLite, deduplicated, with TTL expiry
- **Sources**: any plugin can emit notifications; the agent can generate and route them; system events (plugin error, connectivity loss) are automatic
- **User controls**: per-plugin notification toggle, quiet hours, priority threshold

---

## 3) Recommended tech stack

### Base
- **Raspberry Pi OS (Bookworm)**
- **Chromium** in kiosk mode, started by **systemd**

### App
- **SvelteKit + TypeScript** (UI + admin panel)
- **Node.js LTS** runtime on Pi (host service)
- **SQLite** for settings/layout/plugin state/cache/notifications
- **WebSockets** for live updates + REST for admin actions

### Monorepo Tooling
- **pnpm workspaces** + **Turborepo** for the `@lensing/*` package structure
- Shared packages:
  - `@lensing/types` — plugin SDK types, shared interfaces
  - `@lensing/ui` — common widget primitives (cards, charts, text blocks, loading states)
  - `@lensing/cli` — the `lensing` command-line tool
  - `@lensing/core` — host service, plugin loader, scheduler, cache

### Optional packaging
- Simple: **systemd + node** directly
- Later: Docker Compose if you want portability

---

## 4) Plugin system (designed to not rot)

### Plugin contract
Plugins are packages (folder or npm-style) with:
- `plugin.json` manifest:
  - `id`, `name`, `version`
  - `ui_entry` (widget component)
  - optional `server_entry` (data collector)
  - permissions (allowed network domains, refresh caps, secrets required)
  - `widget_sizes`: declared supported sizes — `['small', 'medium', 'large']` or explicit grid spans (e.g., `{ min: [1,1], preferred: [2,1], max: [4,2] }`)
  - optional `dependencies`: other plugin IDs this plugin requires (e.g., morning brief depends on weather, calendar, news)
- UI widget component (Svelte/TS)
- optional server module for fetch + caching + push events

### Execution model (v1)
- **Server-side plugins (preferred)**: plugin fetches and caches data, then publishes compact payloads to the UI.
- **UI-only plugins**: for simple rendering, no heavy work.

### Resource Budgets
Beyond refresh rate caps, each plugin operates within defined resource boundaries:
- **Network**: max refresh rate, max request burst, allowed domains
- **Render**: complexity score based on DOM node count — plugins exceeding budget get a warning in admin UI
- **Memory**: soft budget with monitoring exposed in admin panel health view
- **Staleness**: plugins declare `max_stale` duration — cached data older than this shows an "unavailable" indicator instead of silently serving stale info

### Inter-Plugin Communication
Plugins need to share data (the morning brief needs weather + calendar + crypto + news).

- **Shared data bus**: plugins publish to named channels (`weather.current`, `calendar.today`), other plugins or the agent subscribe
- **Read-only access**: subscribers get immutable snapshots — no plugin can mutate another's data
- **Agent integration**: the agent service subscribes to the data bus to build composite summaries and cross-plugin alerts (e.g., "pollen is high AND you have an outdoor event → alert")

### Loading
- Start with local `/plugins/<id>/dist/...` bundles and **dynamic imports**.
- Dev mode: hot reload plugins from a dev machine.
- Package convention: `@lensing/plugin-<name>` for first-party plugins

### Long-term hardening
- Permissions enforcement (domains, intervals)
- Optional sandboxing (iframe or isolated worker) for untrusted plugins
- Error boundaries per widget from day one — a crashing plugin shows a graceful error tile, never takes down the display

### Plugin Development Experience
Make-or-break for open source adoption.

- **Scaffolding**: `lensing plugin create <name>` generates a new plugin from template with manifest, component stub, and test harness
- **Isolated dev server**: render a single plugin in isolation with mock data — no need to run the full host
- **Hot reload**: change plugin code, see it update on the display instantly without restarting the host
- **Test harness**: feed sample data payloads, assert render output, validate manifest schema
- **DevTools panel**: in admin UI, a plugin inspector showing data flow, refresh timing, resource usage, and error logs per plugin

---

## 5) First-party plugins to build
Each plugin uses: schedule → fetch → cache → publish diff updates → render.

1. **Weather**
   - Config: location(s), units, provider
   - Cache + refresh controls
   - Publishes to data bus: `weather.current`, `weather.forecast`

2. **Allergies**
   - Config: location(s), thresholds
   - Cache + refresh controls
   - Publishes to data bus: `allergies.current`

3. **Crypto Prices**
   - Watchlist, alerts, percent-change windows
   - Polling or provider streaming when available
   - Publishes to data bus: `crypto.prices`, `crypto.alerts`

4. **News**
   - RSS-first for speed and reliability
   - Categories + "headlines only" mode
   - Publishes to data bus: `news.headlines`

5. **Apple Calendar (iCloud)**
   - Use **CalDAV** with app-specific password
   - Render: today + next 7 days (configurable)
   - Cache + refresh interval
   - Publishes to data bus: `calendar.today`, `calendar.upcoming`

6. **Sports Scores**
   - Config: leagues/teams
   - Throttled polling with diff updates
   - Publishes to data bus: `sports.scores`, `sports.schedule`

7. **Home Assistant**
   - Connect via HA REST / WebSocket API
   - Show device states: lights, locks, thermostat, sensors
   - Agent can trigger HA automations ("dim the lights", "set thermostat to 72")
   - Publishes to data bus: `home.devices`, `home.sensors`

8. **Photo / Art Ambient**
   - Cycle through a local photo directory or iCloud shared album
   - Subtle Ken Burns effect (low-CPU pan/zoom via CSS transforms)
   - Primary content for ambient/sleep scene — doubles as a digital photo frame
   - Household appeal: non-technical users see a beautiful photo display that occasionally shows useful info

---

## 6) Agentic AI capabilities (designed for Pi 3B reality)

### Core idea
- Pi runs an **Agent Gateway** client only.
- A separate **Agent Service** runs the orchestration + tool calling.

### Agent Service responsibilities (remote)
- Summarize news into a "Morning Brief"
- Explain crypto moves
- Generate "today at a glance"
- Trigger Lensing notifications (routed through the notification system with appropriate priority)
- Trigger scene changes (e.g., focus mode before a meeting)
- Cross-plugin reasoning via data bus subscriptions (e.g., "pollen high + outdoor event → proactive alert")
- Maintain audit logs of actions and tool calls

### Agent Gateway responsibilities (Pi)
- Send user requests to Agent Service
- Display responses on Lensing display
- Trigger local UI events/notifications
- Forward data bus snapshots to Agent Service on request

### UX concepts
- **Morning Brief tile**: weather + calendar + news + crypto + sports summary — generated by agent, not just concatenated
- **Proactive alerts**: pollen high, event in 30 minutes, market move threshold — agent evaluates cross-plugin conditions
- **Ask Lensing**: from admin UI (phone/laptop) type a question; display shows the answer
- Voice (optional): capture on phone/ESP32 mic, send to Agent Service for transcription; display shows and optionally plays TTS
- **Scene orchestration**: agent manages scene transitions based on time, presence, and upcoming events

---

## 7) Theming system

### Design Tokens
CSS custom properties for a consistent visual language across all plugins.

- **Colors**: background, surface, text-primary, text-secondary, accent, warning, urgent
- **Typography**: font-family, font-size scale, font-weight scale, line-height
- **Spacing**: 4px base unit scale (4, 8, 12, 16, 24, 32, 48, 64)
- **Depth**: box-shadow levels, border-radius, backdrop-blur
- **Opacity**: for layering, disabled states, ambient dimming

### Rules
- Plugins **must** use theme tokens — no plugin brings its own color palette
- `@lensing/ui` primitives (cards, charts, text blocks) consume tokens automatically
- Default theme: dark, high-contrast, optimized for glanceable reading at distance

### Customization
- Accent color picker in admin UI
- Potential for user-created themes (override token values via JSON)
- **Time-adaptive tones**: slightly warmer color temperature at night (like f.lux for your dashboard) — shift `--color-background` and `--color-text` hue/warmth based on time

---

## 8) Reliability, performance, and safety

### Performance rules (important on Pi 3B)
- Plugins must publish **small payloads** and avoid frequent UI re-render
- Centralized caching and request coalescing (prevent duplicate API calls)
- Resource budgets per plugin: max refresh rate, max request burst, DOM complexity score
- Measure Chromium memory early — set `--max-old-space-size` and monitor via admin health panel

### Offline Resilience
When the internet drops, the dashboard should degrade gracefully, not break.

- Display last-cached data with a **staleness indicator** (subtle badge showing age)
- Plugins declare `max_stale` duration; after expiry, the tile shows "unavailable" rather than silently serving ancient data
- Local-only plugins remain fully functional: clock, system stats, photo slideshow, cached calendar
- Connectivity status indicator in the display corner (optional, can be hidden)
- Auto-recovery: plugins resume normal operation when connectivity returns, no manual intervention

### Reliability
- `systemd` restarts Lensing host and kiosk on failure
- Health checks and a simple on-screen "plugin error" overlay in admin mode
- WebSocket auto-reconnect with exponential backoff — handles Pi sleep, network blips, host restarts
- Per-widget error boundaries — a crashing plugin shows a graceful error tile, never takes down the display

### Security (especially for open source)
- **Secrets storage**: OS keyring (`libsecret`) where available; fall back to AES-encrypted SQLite column
- **Plugin permission model**: domains + intervals + secrets access — no plugin can read other plugins' secrets
- **Admin UI auth**: PIN/password at minimum; optional mTLS or Tailscale for secure remote access
- **Plugin network sandbox** (future): on Linux, `iptables` rules per plugin process if running in separate workers
- **No ambient credential leakage**: plugins declare required secrets explicitly in manifest; host injects only what's declared

### Backup & Portability
- **Export**: full config (layout, plugin settings, themes, scene schedules) as a single JSON file via admin UI or CLI
- **Import**: restore config on a new Pi for easy replication or recovery
- **Schema versioning**: config schema is versioned for forward compatibility — migrations run automatically on import

---

## 9) CLI design

```
lensing dev                    # start dev server with hot reload
lensing start                  # production mode
lensing stop                   # stop running instance

lensing plugin add <name>      # install from registry or local path
lensing plugin remove <name>   # uninstall a plugin
lensing plugin create <name>   # scaffold new plugin from template
lensing plugin list            # show installed plugins + status

lensing config export          # dump full config as JSON
lensing config import <file>   # restore config from JSON
lensing config reset           # reset to defaults (with confirmation)

lensing scene <name>           # switch to a named scene
lensing scene list             # show available scenes

lensing agent status           # check agent service connection
lensing agent ask "<question>" # send a question to the agent

lensing health                 # show system health + plugin status
lensing logs [plugin-id]       # tail logs, optionally filtered by plugin
```

---

## 10) Milestones (recommended build sequence)

### Milestone 1: Lensing host + kiosk skeleton
- Pi OS + kiosk + systemd services (with recommended Chromium flags)
- SvelteKit app: zone-based layout system + routing
- Node host: REST + WebSocket push (with auto-reconnect)
- SQLite: settings + layout persistence
- Basic theming: dark theme with CSS custom property tokens
- Error boundaries per widget slot

### Milestone 2: Plugin SDK v1
- `plugin.json` spec (including widget sizes, dependencies, resource declarations)
- Plugin loader + config UI in admin panel
- Scheduler + caching helpers
- Data bus: publish/subscribe for inter-plugin communication
- Basic permission enforcement
- `lensing plugin create` scaffolding CLI
- Plugin dev server for isolated development with mock data

### Milestone 3: Core plugins
- Weather, allergies, crypto, news, calendar (CalDAV), sports
- Optimize: diff updates, minimized DOM churn
- Each plugin publishes to the data bus
- Notification integration: plugins emit alerts at appropriate priority levels

### Milestone 4: Scenes + presence
- Display modes: morning, evening, ambient, focus, alert
- Scene scheduler (time-based triggers)
- Presence detection: PIR sensor GPIO integration
- Photo / art ambient plugin for sleep mode
- Home Assistant plugin

### Milestone 5: Agent integration v1
- Agent Gateway (Pi) + Agent Service (remote)
- Morning Brief plugin (agent-generated from data bus)
- "Ask" flow from admin UI
- Agent-driven scene changes + cross-plugin alerts
- Basic audit log

### Milestone 6: Notification system + admin polish
- Notification queue with priority, TTL, deduplication
- Display overlay for urgent alerts
- Admin UI: plugin health dashboard, resource monitoring, notification feed
- Backup/restore: config export/import with schema versioning

### Milestone 7: Open source polish
- Starter plugin template + comprehensive docs
- Plugin API reference, permissions guide, dev workflow guide
- CI pipeline, semantic versioning, compatibility checks
- `CONTRIBUTING.md` with plugin submission guidelines
- Curated plugin registry (start as awesome-list, graduate to registry API later)

---

## 11) Known pitfalls

| Area | Risk | Mitigation |
|------|------|------------|
| **CalDAV + iCloud** | Apple's CalDAV is notoriously finicky — auth edge cases, rate limits, inconsistent responses | Budget extra time; use a battle-tested caldav adapter library; comprehensive error handling + retry logic |
| **Chromium on Pi 3B** | Memory pressure — Chromium can easily exceed available RAM | Measure early; use `--disable-gpu --memory-pressure-off`; monitor via admin health panel; keep DOM minimal |
| **WebSocket stability** | Disconnects on Pi sleep, network hiccups, host restarts | Auto-reconnect with exponential backoff; display stale data gracefully during reconnection |
| **Plugin isolation** | Without iframes/workers, a bad plugin can crash the whole UI | Error boundaries per widget from day one; future: iframe/worker sandboxing for untrusted plugins |
| **Plugin ecosystem rot** | Third-party plugins break when APIs change or SDK evolves | Semantic versioning; SDK compatibility checks in CI; plugin health monitoring in admin |
| **Secret management** | Leaking API keys in plugin code or logs | Secrets injected by host, never available in plugin source; redaction in logs; manifest-declared secrets only |
| **Scope creep** | Trying to build everything at once | Strict milestone discipline; each milestone is a usable product increment |

---

## 12) Open source strategy

### Release Approach
- Ship **Milestone 1–2** as the initial public release (skeleton + SDK) — a working system people can extend
- First-party plugins (Milestone 3) demonstrate the SDK and set the quality bar
- Each milestone after that is a public release with changelog

### Community
- `CONTRIBUTING.md` with clear plugin submission guidelines
- Plugin registry: start with a curated awesome-list in the repo, graduate to a hosted registry API when the community warrants it
- Issue templates for bug reports, feature requests, and plugin proposals
- Discussion forum (GitHub Discussions) for plugin ideas and architecture questions

### Quality Bar
- All first-party plugins include tests and follow the SDK conventions
- CI validates plugin manifests, runs type checks, and tests
- Semantic versioning with compatibility matrix (SDK version ↔ plugin version)

---

## 13) Deliverables checklist
- Repo: `lensing` (monorepo via pnpm + Turborepo: host service, display UI, admin UI, plugins, shared packages)
- Shared packages: `@lensing/types`, `@lensing/ui`, `@lensing/cli`, `@lensing/core`
- systemd unit files for host + kiosk
- Plugin SDK + template plugin (`@lensing/create-plugin`)
- First-party plugin suite (`@lensing/plugin-weather`, `@lensing/plugin-calendar`, etc.)
- Agent Service + Gateway interface
- Theming system with dark default + CSS custom property tokens
- Notification system with priority routing
- Scene/display mode system with time + presence triggers
- Backup/restore: config export/import
- CLI tool: `@lensing/cli`
- Docs + CI + release process
- `CONTRIBUTING.md` + plugin submission guidelines
- README with tagline: *"A surface that bends information into clarity."*
