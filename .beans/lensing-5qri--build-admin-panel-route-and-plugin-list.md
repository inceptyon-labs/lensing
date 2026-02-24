---
# lensing-5qri
title: Build admin panel route and plugin list
status: completed
type: task
priority: high
tags:
  - area:frontend
  - size:M
created_at: 2026-02-24T02:46:02Z
updated_at: 2026-02-24T03:55:48Z
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
[icon] Plugin Name [zone: ▼ center] [● enabled]
Status: active | Version: 1.0.0

## Completed

Admin panel with plugin management UI fully implemented and merged.

**Commits:**

- 1c6c272 feat: add AdminPluginCard, AdminPluginList, admin route, and nav link
- 569646c fix: address lint errors
- 034eac0 fix: address Sonnet review findings
- 92d6d3d fix: address Codex review findings
- eabb930 fix: resolve lint errors

**Features:**

- AdminPluginCard component with plugin enable/disable toggle and zone selector
- AdminPluginList component with plugin fetching and state management
- Admin route at /admin for plugin management
- Navigation link from main display to admin panel
- Full SC review (Sonnet + Codex) with all findings addressed
- Error handling for network failures
- Zone validation on client and server
- All 1302 tests passing

**Test Results:** 34 admin-plugin tests, 1302 total tests all passing
