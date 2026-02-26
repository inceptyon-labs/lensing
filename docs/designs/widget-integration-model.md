# Widget + Integration Model

**Status**: Draft
**Date**: 2026-02-25
**Inspiration**: Framerr's widget/integration pattern

## Problem

The current system has two overlapping controls for whether a module runs:

1. **Admin panel**: enabled/disabled toggle per module
2. **Dashboard grid**: add/remove widgets in edit mode

A module can be "enabled" but not on the grid (wasting API calls), or on the grid but "disabled" (showing nothing). The admin panel is also the only place to configure API keys AND display preferences, all mixed together in one form.

## Proposal

Replace enabled/disabled with a two-tier model:

### Tier 1: Integrations (central, set up once)

Service connections and credentials. Configured in a **Settings** page (the current admin route, redesigned). You set these up once and forget about them.

| Integration     | Fields                         |
| --------------- | ------------------------------ |
| OpenWeatherMap  | API key                        |
| CalDAV          | server URL, username, password |
| Home Assistant  | URL, access token              |
| Allergies API   | API key                        |
| Photo Directory | directory path                 |

Some modules need **no integration** — they use free public APIs:

- Crypto (CoinGecko — free)
- News (RSS — public)
- Sports (ESPN — public)
- PIR (local hardware)

### Tier 2: Widget Config (per instance, on the grid)

Display preferences specific to each widget placement. Configured via the gear icon on the widget in edit mode.

| Widget          | Config Fields                       |
| --------------- | ----------------------------------- |
| Weather         | location (lat/lon), units (F/C)     |
| Crypto          | watchlist (which coins)             |
| News            | feed URLs, max items                |
| Sports          | leagues                             |
| Calendar        | calendar path, days ahead           |
| Home Assistant  | which domains to show               |
| Allergies       | location (lat/lon), alert threshold |
| PIR             | idle timeout                        |
| Photo Slideshow | _(none — uses integration path)_    |

### Widget States

A widget on the grid can be in one of three states:

1. **Active** — integration configured (or not needed), widget config set, data flowing
2. **Needs Config** — integration exists but widget hasn't been configured yet (e.g., weather widget with no location). Shows gear icon + "Configure" message.
3. **Needs Integration** — requires a service connection that hasn't been set up. Shows "Not Configured — Go to Settings" (like Framerr).

```
┌─────────────────────────┐
│  ⚙                      │
│                         │
│     ⚙ Not Configured    │
│   Select an integration │
│                         │
└─────────────────────────┘
```

### Flow

1. **User adds widget to grid** → module boots if integration is ready; shows "Not Configured" state if not
2. **Gear icon → Configure** → per-widget display settings panel. If integration is missing, shows banner: "No integration configured. Go to Settings."
3. **Settings page** → central place for all service connections and API keys
4. **User removes widget from grid** → if no other widgets use that module, server stops polling

### Multiple Instances

Because widget config is per-instance, users can place multiple widgets of the same type:

- Two weather widgets: one for home (imperial), one for vacation spot (metric)
- Two crypto widgets: one for BTC/ETH, one for altcoins
- Two news widgets: one for tech, one for world news

Each instance has its own config but shares the same integration.

## What Changes

### Remove

- `enabled` field from `PluginAdminEntry`
- Enable/disable toggle from admin panel
- `setPluginEnabled` handler
- `bootEnabledModules` logic (replaced by grid-driven boot)

### Add

- Integration settings store (separate from widget config)
- Widget instance config (keyed by widget placement ID, not just module ID)
- "Not Configured" widget state component
- Settings page redesign (integrations only, not per-widget config)
- Grid-driven module lifecycle: add widget → boot, remove last widget → stop

### Modify

- `MODULE_SCHEMAS` split into `integration_fields` and `widget_fields`
- `PluginAdminEntry` gains `integration_status: 'ready' | 'missing' | 'not_needed'`
- Module boot logic reads integration config from central store + widget config from grid placement
- Config panel shows only widget fields + integration status banner

## Module Field Classification

| Module          | Integration Fields                  | Widget Fields                  |
| --------------- | ----------------------------------- | ------------------------------ |
| weather         | `provider`, `apiKey`                | `lat`, `lon`, `units`          |
| crypto          | _(none)_                            | `watchlist`                    |
| news            | _(none)_                            | `feedUrls`, `maxItems`         |
| sports          | _(none)_                            | `leagues`                      |
| calendar        | `serverUrl`, `username`, `password` | `calendarPath`, `rangeDays`    |
| home-assistant  | `url`, `token`                      | `domains`                      |
| allergies       | `apiKey`                            | `lat`, `lon`, `alertThreshold` |
| pir             | _(none)_                            | `idleTimeout_ms`               |
| photo-slideshow | `photoDirectory`                    | _(none)_                       |

## Open Questions

- **OPEN**: Should widgets that need no integration auto-boot with defaults when added to the grid? (e.g., crypto with default `bitcoin,ethereum` watchlist)
- **OPEN**: Should removing a widget immediately stop the module, or only after the layout is saved?
- **OPEN**: Multiple widget instances sharing one module — does the module run one refresh cycle with merged config (union of all watchlists), or does each instance get its own module?
