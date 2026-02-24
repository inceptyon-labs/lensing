---
# lensing-oekr
title: Build WeatherWidget.svelte
status: in-progress
type: task
priority: high
created_at: 2026-02-24T18:00:18Z
updated_at: 2026-02-24T22:21:30Z
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
