---
# lensing-oekr
title: Build WeatherWidget.svelte
status: completed
type: task
priority: high
created_at: 2026-02-24T18:00:18Z
updated_at: 2026-02-24T22:27:32Z
parent: lensing-wbum
blocked_by:
    - lensing-zl2i
    - lensing-e0mr
---

No weather display widget exists. PluginRenderer has no 'weather' branch — it falls through to Placeholder.

## What to Build

- apps/display/src/lib/WeatherWidget.svelte
- Props: current temp, conditions, high/low, humidity, wind, icon/condition code
- Show current conditions prominently (temp, icon, description)
- Show high/low, humidity, wind speed
- Support compact mode for smaller zones
- Use lensing design system tokens (--event-horizon, --starlight, --ember, etc.)
- Add to PluginRenderer: {:else if pluginId === 'weather'} <WeatherWidget ... />

## Data Shape (from weather-server)

Check WeatherServerInstance.onUpdate() callback — what data shape does it provide?
May need to define a WeatherData type if one doesn't exist.

## Blocked By

- lensing-zl2i (PluginRenderer data wiring)

## Key Files

- apps/display/src/lib/WeatherWidget.svelte (NEW)
- apps/display/src/lib/PluginRenderer.svelte (add branch)

## Completed

**Files created:**
- apps/display/src/lib/WeatherWidget.svelte (223 lines)
- apps/display/__tests__/weather-widget.test.ts (100 lines)
- packages/types/src/weather.ts (24 lines)

**Files modified:**
- apps/display/src/lib/PluginRenderer.svelte (wired weather channel + component)
- apps/display/__tests__/plugin-renderer.test.ts (4 new integration tests)
- packages/types/src/index.ts (exported weather types)

**Key decisions:**
- Three layout modes: empty state, compact (temp + conditions), full (current + 5-day forecast)
- Temperature as hero element (--text-3xl, bold)
- Forecast limited to 5 days to prevent DOM bloat
- Uses tabular-nums for proper number alignment
- Full design system compliance (event-horizon, starlight, dim-light, etc.)
- Respects kiosk minimum text size (no --text-xs)

**Test results:**
- 22 new tests passing (18 widget + 4 integration)
- All 1,083 tests passing (246 display + 706 core + 355 ui + 61 types)
- Build: 186 modules, no type errors
- Code review: O-level complete, no issues

**Branch:** feature/lensing-oekr merged to main at c083814
