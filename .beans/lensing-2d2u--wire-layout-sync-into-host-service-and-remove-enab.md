---
# lensing-2d2u
title: Wire layout sync into host-service and remove enabled flag
status: completed
type: task
priority: normal
tags:
  - area:backend
created_at: 2026-02-26T02:51:57Z
updated_at: 2026-02-26T13:28:53Z
parent: lensing-97w9
blocked_by:
  - lensing-hqrt
---

Wire `syncModulesWithLayout` into the host-service boot sequence and REST layout endpoint. Remove the `enabled` flag for built-in modules.

## Changes

1. **host-service.ts**: Replace `bootEnabledModules()` with sync against saved layout at startup
2. **rest-server.ts**: Add `syncModules` handler to `RestServerHandlers`, call after `PUT /layout`
3. **plugin-admin-handlers.ts**: Remove `setPluginEnabled` for built-in modules, remove `enabled` from built-in module entry status logic
4. **module-boot.ts**: Remove `config.enabled` check from `rebootModule`
5. **+page.svelte**: Stop filtering `plugins.filter(p => p.enabled)` — all plugins on grid are active

## Files

- packages/core/src/host-service.ts
- packages/core/src/rest-server.ts
- packages/core/src/plugin-admin-handlers.ts
- packages/core/src/module-boot.ts
- apps/display/src/routes/+page.svelte

## Acceptance Criteria

- [ ] Host boots modules based on saved layout, not enabled flag
- [ ] PUT /layout triggers module sync (boot new, stop removed)
- [ ] setPluginEnabled removed for built-in modules
- [ ] enabled field removed from built-in PluginAdminEntry
- [ ] Display app shows all plugins from server (no client-side enabled filter)
- [ ] Tests updated for new behavior
