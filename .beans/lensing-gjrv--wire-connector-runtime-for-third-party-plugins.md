---
# lensing-gjrv
title: Wire connector runtime for third-party plugins
status: in-progress
type: feature
priority: high
created_at: 2026-03-03T13:14:58Z
updated_at: 2026-03-03T13:17:23Z
---

Plugin loader currently only reads plugin.json manifests — it never reads connector.json.
The connector infrastructure exists (ConnectorRunner, json-api-connector, rss-connector, static-connector)
but is not wired up for third-party plugins. Built-in modules have their own hardcoded fetch logic.

## Requirements

- [ ] Plugin loader reads connector.json from each plugin directory on load/reload
- [ ] Register third-party plugin connectors with ConnectorRunner
- [ ] Data flows through DataBus → WebSocket → frontend dataStore → template interpolation
- [ ] Connector types supported: json_api, rss_feed, static_data
- [ ] Respect refreshInterval from connector config
- [ ] SSRF protection applies (existing blocklist)
- [ ] Timeout protection applies (existing 10s default)
- [ ] Plugin enable/disable toggles connector on/off
- [ ] Tests for the full data flow

## Key Files
- packages/core/src/plugin-loader.ts — needs to read connector.json
- packages/core/src/connector-runner.ts — orchestrates fetching
- packages/core/src/json-api-connector.ts — JSON API fetcher
- packages/core/src/rss-connector.ts — RSS fetcher
- packages/core/src/static-connector.ts — Static data
- packages/core/src/module-boot.ts — reference for how built-in modules do it
- apps/display/src/lib/PluginWidget.svelte — frontend data consumption
- apps/display/src/lib/template-engine.ts — {{placeholder}} interpolation
