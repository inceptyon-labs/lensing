---
# lensing-hyji
title: Replace placeholders with dynamic plugin widgets
status: in-progress
type: task
priority: high
tags:
    - area:frontend
    - size:M
created_at: 2026-02-24T02:46:17Z
updated_at: 2026-02-24T14:10:12Z
parent: lensing-o5do
---

Update the display app to render actual plugin widgets based on zone assignments.

## What to build

- apps/display/src/lib/PluginRenderer.svelte — loads and renders a plugin widget
- Update +page.svelte to:
  1. Fetch zone assignments from GET /plugins on mount
  2. For each zone, render assigned plugin widget (or Placeholder if none)
  3. Connect to WebSocket for live layout_change updates
- Plugin widgets: for built-in plugins, import components directly
  (PhotoSlideshow, NewsHeadlines, SportsScores, etc. already exist as .svelte files)
- For external plugins: dynamic import from plugin ui_entry path
- Each widget wrapped in ErrorBoundary (already exists)

## Implementation notes

- Start with built-in plugin mapping (plugin_id → Svelte component)
- Zone assignments come from adminStore/REST API
- WebSocket reconnect manager already exists in @lensing/core

## Completed

**Files changed:**
- apps/display/src/lib/PluginRenderer.svelte (new — maps plugin_id to widget component)
- apps/display/src/lib/config.ts (added BUILTIN_PLUGIN_MAP)
- apps/display/src/routes/+page.svelte (dynamic zone rendering + WebSocket)
- apps/display/__tests__/plugin-renderer.test.ts (new — 11 tests)
- apps/display/__tests__/page.test.ts (6 new dynamic rendering tests)

**Key decisions:**
- PluginRenderer uses inline if/else (not a runtime lookup map) for Svelte-compatible component selection
- Actual plugin IDs from manifests: photo-slideshow, news-server, sports-server, home-assistant-server
- Zone validation uses Object.hasOwn() to prevent prototype pollution
- WebSocket URL uses ws:// (Pi display is always local HTTP)
- Build failure is pre-existing (PhotoSlideshow imports @lensing/core — not caused by this task)

**Notes for next task:**
- PluginRenderer currently renders widgets with empty data props (data wiring is future work)
- WebSocket layout_change listening is wired on client; server-side broadcast not yet implemented
- BUILTIN_PLUGIN_MAP in config.ts is a reference map; PluginRenderer uses inline conditionals
- Test count: 151 display tests passing
