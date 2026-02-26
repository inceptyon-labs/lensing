# Session Handoff: Widget + Integration Model

Date: 2026-02-25
Issue: lensing-ht6n - Widget + Integration Model (Framerr-style)

## What Was Done

### Completed Feature: lensing-wkqw — Config field categories + integration status types

**Task lensing-b7ye** (merged): Added `category: 'integration' | 'widget'` to ConfigField, tagged all MODULE_SCHEMAS fields, added helpers to `@lensing/types`:

- `packages/types/src/index.ts` — ConfigFieldCategory type, category field on ConfigField, re-exports helpers
- `packages/types/src/module-settings.ts` — all fields tagged, getIntegrationFields/getWidgetFields/moduleNeedsIntegration
- `packages/types/src/__tests__/module-settings.test.ts` — 16 tests

**Task lensing-33yf** (merged): Added `integration_status?: 'ready' | 'missing' | 'not_needed'` to PluginAdminEntry, computed in buildModuleEntry:

- `packages/types/src/index.ts` — integration_status field on PluginAdminEntry
- `packages/core/src/plugin-admin-handlers.ts` — logic: not_needed (no integration fields), missing (required fields unset), ready (all required set)
- `packages/core/src/__tests__/plugin-admin-handlers.test.ts` — 5 new tests

**Bug fix** (merged): WS reconnect race condition in handleConfigSaved — removed close/reconnect, data bus → WS pipeline handles updates naturally.

- `apps/display/src/routes/+page.svelte` — simplified handleConfigSaved

### Key Decisions

- `integration_status` is computed from `required` integration fields only. Non-required fields (e.g. weather's `apiKey`) don't affect status — open-meteo works without an API key.
- Weather defaults to 'ready' with open-meteo (no required integration fields), which is correct behavior.
- `category` on ConfigField is optional (not required) for backwards compat with third-party plugins.

## Next Steps (ordered)

### 1. lensing-97w9 — Grid-driven module lifecycle (BACKEND)

Create tasks for this feature first — it's a significant refactor:

- Remove `enabled` field, `setPluginEnabled`, `bootEnabledModules`
- Add grid-driven boot: boot when widget added to grid, stop when last widget removed
- New endpoint: `POST /modules/sync` takes layout, boots/stops modules accordingly
- Files: `packages/core/src/module-boot.ts`, `packages/core/src/plugin-admin-handlers.ts`, `packages/core/src/rest-server.ts`, `apps/display/src/routes/+page.svelte`

### 2. lensing-0htp — Widget states + config panel redesign (FRONTEND)

Depends on integration_status being available (done ✓):

- PluginRenderer: show "Not Configured" state when integration_status === 'missing'
- WidgetConfigPanel: show only widget-category fields (filter out integration fields), add integration banner if missing
- Files: `apps/display/src/lib/PluginRenderer.svelte`, `apps/display/src/lib/grid/WidgetConfigPanel.svelte`

### 3. lensing-zgdi — Settings page integration management (FRONTEND)

- Admin page redesign: show only integration-category fields per module
- Only show modules that have integration fields
- Files: `apps/display/src/routes/admin/+page.svelte`, `apps/display/src/lib/AdminConfigForm.svelte`

## Files to Load Next Session

- `packages/core/src/module-boot.ts` (module boot logic)
- `packages/core/src/rest-server.ts` (REST endpoints)
- `packages/core/src/plugin-admin-handlers.ts` (buildModuleEntry)
- `apps/display/src/lib/PluginRenderer.svelte` (widget rendering)
- `apps/display/src/lib/grid/WidgetConfigPanel.svelte` (config panel)
- `docs/designs/widget-integration-model.md` (design reference)

## What NOT to Re-Read

- packages/types/src/module-settings.ts (already done)
- packages/types/src/index.ts (already done)
