---
# lensing-hyji
title: Replace placeholders with dynamic plugin widgets
status: todo
type: task
priority: high
tags:
    - area:frontend
    - size:M
created_at: 2026-02-24T02:46:17Z
updated_at: 2026-02-24T02:46:17Z
parent: lensing-o5do
blocked_by:
    - lensing-57h8
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
