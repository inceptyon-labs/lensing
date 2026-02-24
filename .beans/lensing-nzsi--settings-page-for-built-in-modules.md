---
# lensing-nzsi
title: Settings page for built-in modules
status: completed
type: feature
priority: normal
created_at: 2026-02-24T15:52:37Z
updated_at: 2026-02-24T16:01:53Z
---

Module settings schemas, admin settings tab, host service boot wiring. Steps: 1) module-settings schemas in types, 2) read/write helpers in core, 3) module boot registry in core, 4) wire host service, 5) admin UI settings tab, 6) verify

## Summary of Changes

### New Files

- `packages/types/src/module-settings.ts` — ModuleId, MODULE_IDS, ModuleSettingsSchema, MODULE_SCHEMAS for all 8 built-in modules
- `packages/types/src/__tests__/module-settings.test.ts` — 8 tests for schema validation
- `packages/core/src/module-settings.ts` — readModuleConfig/writeModuleConfig DB helpers
- `packages/core/src/__tests__/module-settings.test.ts` — 10 tests for read/write round-trip
- `packages/core/src/module-boot.ts` — bootEnabledModules registry, wires all 8 factories
- `packages/core/src/__tests__/module-boot.test.ts` — 6 tests with mocked factories
- `apps/display/src/lib/AdminModuleSettings.svelte` — Settings tab content, fetches/saves via /settings API
- `apps/display/src/lib/AdminModuleCard.svelte` — Per-module card with enable toggle + config form
- `apps/display/__tests__/admin-module-settings.test.ts` — 26 source analysis tests

### Modified Files

- `packages/types/src/index.ts` — added 'password' to ConfigFieldType, exported module-settings
- `packages/core/src/index.ts` — exported module-settings and module-boot
- `packages/core/src/host-service.ts` — boots modules after WS, closes on shutdown, exposes .modules
- `packages/core/src/__tests__/host-service.test.ts` — added 0-modules test
- `apps/display/src/routes/admin/+page.svelte` — tabs (Plugins | Settings)
- `apps/display/src/lib/AdminConfigForm.svelte` — password field type support
- `apps/display/package.json` — added @lensing/types as dependency
- `packages/cli/src/__tests__/start.test.ts` — added modules:[] to mocks
