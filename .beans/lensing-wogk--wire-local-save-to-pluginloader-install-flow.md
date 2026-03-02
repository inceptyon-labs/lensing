---
# lensing-wogk
title: Wire local save to PluginLoader install flow
status: completed
type: task
priority: high
created_at: 2026-02-28T15:46:25Z
updated_at: 2026-03-01T23:39:50Z
parent: lensing-rq0o
---

After packaging, trigger PluginLoader reload so the new plugin appears immediately.

## Acceptance Criteria

- [x] After save, call PluginLoader.reload() to discover the new plugin
- [x] Plugin appears in admin plugin list without page refresh
- [x] Plugin can be assigned to a zone and displays on the dashboard
- [x] Edit flow: re-open builder for existing builder-created plugins
- [x] Overwrite flow: saving an existing plugin updates files in place

---

**Size:** S
**Area:** backend

## Summary of Changes

**Files changed:**

- packages/core/src/plugin-admin-handlers.ts (modified — added saveBuiltPlugin handler)
- packages/core/src/**tests**/plugin-admin-handlers.test.ts (modified — added 6 saveBuiltPlugin tests)

**Key decisions:**

- Always uses overwrite: true — acceptance criteria say edit/save always overwrites existing plugin files
- Mirrors installPlugin pattern exactly (save → reload → onChange → buildEntry)
- onChange action is 'saved' (distinct from 'installed' for marketplace flow)

**Notes for next task:**

- saveBuiltPlugin is now available in createPluginAdminHandlers return value
- REST endpoint POST /api/admin/builder/save already wired (rest-server.ts line 517) — calls handlers.saveBuiltPlugin
- Plugin immediately discoverable via getPlugin/getPlugins after save (no page refresh needed)
- Overwrite always enabled — re-saving from builder always updates existing plugin
