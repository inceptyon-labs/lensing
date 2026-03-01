---
# lensing-odrh
title: Integrate connectors with plugin scheduler
status: completed
type: task
priority: high
created_at: 2026-02-28T15:45:21Z
updated_at: 2026-03-01T23:30:30Z
parent: lensing-r333
---

Wire connector execution into the existing plugin scheduler for periodic data refresh.

## Acceptance Criteria

- [x] Register builder-created plugins with scheduler using connector.refresh_ms
- [x] Scheduler triggers connector fetch on interval
- [x] Connector results published to data bus for display clients
- [x] Respects existing burst limiting from plugin scheduler
- [x] Clean shutdown: stop connector polling on plugin disable/uninstall

---

**Size:** M
**Area:** backend

## Summary

**Implementation completed and merged to main.**

**Files Created:**

- packages/core/src/connector-runner.ts (123 lines)
- packages/core/src/**tests**/connector-runner.test.ts (338 lines, 17 tests)

**Files Modified:**

- packages/core/src/index.ts (exports added)

**Key Decisions:**

- SSRF check runs on every handler invocation (not just registration) — protects against URL changes
- Channel naming convention: `plugin:<pluginId>` for data bus
- Static connectors publish immediately, skip scheduler
- RSS feeds publish `{raw: text}` for downstream template parsing
- Injectable fetchFn for testability
- Handler propagates errors to scheduler for burst/error tracking

**Notes for Next Task:**

- Use `createConnectorRunner({ dataBus, scheduler })` to wire connectors
- Call `register(pluginId, manifest, connectorConfig)` after loading a plugin
- Call `unregister(pluginId)` on plugin disable/uninstall
- Data published to `plugin:<pluginId>` channel, subscribe via `dataBus.subscribe('plugin:<id>', handler)`
