---
# lensing-gjrv
title: Wire connector runtime for third-party plugins
status: completed
type: feature
priority: high
created_at: 2026-03-03T13:14:58Z
updated_at: 2026-03-03T13:50:58Z
---

Plugin loader currently only reads plugin.json manifests — it never reads connector.json.
The connector infrastructure exists (ConnectorRunner, json-api-connector, rss-connector, static-connector)
but is not wired up for third-party plugins. Built-in modules have their own hardcoded fetch logic.

## Requirements

- [x] Plugin loader reads connector.json from each plugin directory on load/reload
- [x] Register third-party plugin connectors with ConnectorRunner
- [x] Data flows through DataBus → WebSocket → frontend dataStore → template interpolation
- [x] Connector types supported: json_api, rss_feed, static_data
- [x] Respect refreshInterval from connector config
- [x] SSRF protection applies (existing blocklist)
- [x] Timeout protection applies (existing 10s default)
- [x] Plugin enable/disable toggles connector on/off
- [x] Tests for the full data flow

## Key Files

- packages/core/src/plugin-loader.ts — needs to read connector.json
- packages/core/src/connector-runner.ts — orchestrates fetching
- packages/core/src/json-api-connector.ts — JSON API fetcher
- packages/core/src/rss-connector.ts — RSS fetcher
- packages/core/src/static-connector.ts — Static data
- packages/core/src/module-boot.ts — reference for how built-in modules do it
- apps/display/src/lib/PluginWidget.svelte — frontend data consumption
- apps/display/src/lib/template-engine.ts — {{placeholder}} interpolation

## Summary of Changes

### Files Modified
- packages/core/src/plugin-loader.ts — connector.json discovery, register on load, unregister on unload/reload
- packages/core/src/plugin-admin-handlers.ts — connector lifecycle on enable/disable, re-apply disabled state after reload
- packages/core/src/connector-runner.ts — normalize static_data as alias for static

### Files Created
- packages/core/src/__tests__/plugin-loader-connector.test.ts (11 tests)
- packages/core/src/__tests__/plugin-admin-handlers-lifecycle.test.ts (6 tests)
- packages/core/src/__tests__/plugin-connector-integration.test.ts (8 tests)

### Key Decisions
- ConnectorRunner is optional dependency — backward compatible
- Malformed connector.json is non-fatal — plugin still loads
- Disabled state re-applied after reloadPlugins (Codex review catch)
- static_data normalized as alias for static (Codex review catch)
