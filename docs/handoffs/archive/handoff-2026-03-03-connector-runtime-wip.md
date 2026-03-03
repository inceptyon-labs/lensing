# Session Handoff: Wire Connector Runtime for Third-Party Plugins

**Date**: 2026-03-03
**Issue**: lensing-gjrv (Feature)
**Status**: IN PROGRESS (2/4 tasks complete)

## What Was Done

### Task 1: Architecture Understanding ✓

- Read plugin-loader.ts, connector-runner.ts, module-boot.ts
- Understood how ConnectorRunner manages fetching and DataBus publishing
- Understood how plugins are discovered and loaded

### Task 2: Plugin Loader Wiring ✓

**Commit**: `b75b3e4` feat: wire connector.json registration into plugin-loader

Changes:

- Modified `packages/core/src/plugin-loader.ts`:
  - Added `connectorRunner?: ConnectorRunnerInstance` to PluginLoaderOptions
  - On plugin load: reads connector.json and calls `connectorRunner.register(id, manifest, config)`
  - On plugin unload: calls `connectorRunner.unregister(id)`
  - Handles missing/malformed connector.json gracefully (non-fatal)
  - Tracks connected plugins in a Set for reload cycles

- Added test file: `packages/core/src/__tests__/plugin-loader-connector.test.ts`
  - 11 tests covering: discovery, parsing, unload, reload
  - All tests passing

### Task 3: Admin Handler Lifecycle ✓

**Commit**: `f8aa4a0` feat: wire connector lifecycle to plugin enable/disable in admin handlers

Changes:

- Modified `packages/core/src/plugin-admin-handlers.ts`:
  - Added `connectorRunner?: ConnectorRunnerInstance` to PluginAdminHandlersOptions
  - Updated `setPluginEnabled()` to:
    - When enabled=true: reads connector.json and calls `connectorRunner.register()`
    - When enabled=false: calls `connectorRunner.unregister()`
    - Handles missing/malformed connector.json gracefully

- Added test file: `packages/core/src/__tests__/plugin-admin-handlers-lifecycle.test.ts`
  - 5 tests covering: enable/disable, tracking state
  - All tests passing

## Files Changed

**Modified**:

- `packages/core/src/plugin-loader.ts`
- `packages/core/src/plugin-admin-handlers.ts`

**New Test Files**:

- `packages/core/src/__tests__/plugin-loader-connector.test.ts` (11 tests)
- `packages/core/src/__tests__/plugin-admin-handlers-lifecycle.test.ts` (5 tests)

## Current Test Status

✓ All 1160 tests passing (67 test files)

- core: 1143 tests ✓
- display: 415 tests ✓

## Next Steps (Ordered)

1. **Task 4: End-to-end test - plugin data fetching** (pending)
   - Create integration test: plugin load → fetch → DataBus → WebSocket → frontend
   - Test all connector types (json_api, rss_feed, static_data)
   - Verify SSRF and timeout protection
   - File: `packages/core/src/__tests__/plugin-connector-integration.test.ts`

2. **Task 5: Code Review (OC tier)** (pending)
   - Opus review: architecture, edge cases, performance, security
   - Codex review: catch what Opus missed, subtle bugs, security gaps

3. **Task 6: Verification Gate** (pending)
   - Tests: fresh run, all pass
   - Build: no errors
   - Lint: no errors
   - Type check: no errors

4. **Merge to main**

## Files to Load Next Session

- `packages/core/src/plugin-loader.ts` (modified)
- `packages/core/src/plugin-admin-handlers.ts` (modified)
- `packages/core/src/__tests__/plugin-loader-connector.test.ts` (new)
- `packages/core/src/__tests__/plugin-admin-handlers-lifecycle.test.ts` (new)

## Key Decisions

1. **ConnectorRunner as optional dependency**: Plugin loader and admin handlers work fine without a runner (backward compatible). Only wire connectors if runner is provided.

2. **Malformed connector.json is non-fatal**: Plugin still loads successfully even if connector.json is invalid JSON. Only the connector registration fails gracefully.

3. **Unregister on disable, register on enable**: The enable/disable toggle in admin handlers both wires and unwires connectors. Connectors only run when plugin is enabled AND has a valid connector.json.

4. **No connector schema validation**: Plugin loader doesn't validate ConnectorRunnerConfig shape — just passes it through. Validation happens in ConnectorRunner.register(). Keeps loader simple.

## Open Questions

- Should we persist "enabled" state differently for connectors? Currently it's just the plugin's enabled flag, but we might want separate connector enable toggle in future.
- Should reloadPlugins() in admin handlers also trigger a connectorRunner reload? Currently it just calls pluginLoader.reload() which will re-register connectors. Seems sufficient.

## What NOT to Re-Read

- Architecture understanding (already complete)
- ConnectorRunner implementation (no changes needed)
- Module boot patterns (already reviewed)
