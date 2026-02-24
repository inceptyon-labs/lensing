---
# lensing-5qri
title: Build admin panel route and plugin list
status: todo
type: task
priority: high
tags:
    - area:frontend
    - size:M
created_at: 2026-02-24T02:46:02Z
updated_at: 2026-02-24T02:46:02Z
parent: lensing-aim8
blocked_by:
    - lensing-b6ki
---

Create /admin route in the display app with plugin list and management controls.

## What to build
- apps/display/src/routes/admin/+page.svelte — admin panel
- apps/display/src/lib/AdminPluginList.svelte — plugin list component
- apps/display/src/lib/AdminPluginCard.svelte — individual plugin card
- Fetch plugins from GET /plugins on mount
- Show: plugin name, status badge, enable/disable toggle, zone dropdown
- Toggle calls PUT /plugins/:id/enabled
- Zone dropdown calls PUT /plugins/:id/zone
- Navigation: link from main display to /admin and back
- Design system: use tokens from tokens.css (void, event-horizon, ember, etc.)

## UI sketch
Each plugin card shows:
  [icon] Plugin Name          [zone: ▼ center] [● enabled]
  Status: active | Version: 1.0.0
