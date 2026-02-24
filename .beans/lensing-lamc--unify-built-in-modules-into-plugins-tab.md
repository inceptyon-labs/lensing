---
# lensing-lamc
title: Unify built-in modules into Plugins tab
status: completed
type: feature
priority: normal
created_at: 2026-02-24T17:16:17Z
updated_at: 2026-02-24T17:21:08Z
---

Make plugin-admin-handlers synthesize PluginAdminEntry objects for MODULE_SCHEMAS entries alongside real plugins. Route enable/config mutations to flat DB settings. Zone assignment uses db.setPluginState() for both. Kill the Settings tab. Delete AdminModuleSettings and AdminModuleCard.

## Todo

- [x] Add builtin flag to PluginAdminEntry type
- [x] Synthesize module entries in plugin-admin-handlers
- [x] Add plugin-admin-handlers tests for modules
- [x] Add host-service integration tests
- [x] Add restart support to AdminPluginCard
- [x] Wire restart handler in AdminPluginList
- [x] Update PluginRenderer ID mappings
- [x] Remove Settings tab and delete module files
- [x] Verify: pnpm test + pnpm build pass

## Summary of Changes

Unified built-in modules into the Plugins tab:

1. **PluginAdminEntry** — added `builtin?: boolean` flag to types
2. **plugin-admin-handlers** — synthesizes `PluginAdminEntry` objects for all 8 MODULE_SCHEMAS entries, routes enable/config mutations to flat DB settings, redacts password fields
3. **AdminPluginCard** — added restart button state machine (idle→restarting→restarted/error), built-in module subtitle, card-footer flex layout
4. **AdminPluginList** — wires `handleRestart` (POST /modules/:id/restart) for builtin plugins only
5. **PluginRenderer + config.ts** — updated ID mappings from server names to module IDs (news-server→news, etc.)
6. **Admin page** — removed Settings tab, tab bar, and activeTab state; renders AdminPluginList directly
7. **Deleted** AdminModuleSettings.svelte, AdminModuleCard.svelte, admin-module-settings.test.ts
8. 882 tests passing, clean build
