---
# lensing-57h8
title: Wire plugin endpoints to host service
status: completed
type: task
priority: normal
tags:
  - area:backend
  - size:S
created_at: 2026-02-24T02:45:48Z
updated_at: 2026-02-24T13:49:39Z
parent: lensing-ij9t
---

Connect plugin REST endpoints to PluginLoader + Database in the host service.

## Completed

Plugin endpoints fully wired to host service with comprehensive test coverage.

**Implementation:**

- Created createPluginAdminHandlers factory that merges pluginLoader state with DB persistence
- Wired handlers into host-service boot sequence
- Exported factory from @lensing/core for reusability
- Full test coverage: 11 new tests in plugin-admin-handlers.test.ts, 2 integration tests in host-service.test.ts

**Features:**

- getPlugins: List all plugins with merged state (enabled, config, zone)
- getPlugin: Single plugin query
- setPluginEnabled: Persist enabled/disabled state to DB
- updatePluginConfig: Persist merged config to DB
- assignPluginZone: Persist zone assignment to DB
- reloadPlugins: Call pluginLoader.reload()

**Architecture:**

- DB schema: plugin_state table stores {enabled, config, zone?}
- Status mapping: 'loaded'→'active'|'disabled' (based on enabled flag), 'loading'/'error' preserved
- Defaults: enabled=true, config={}, zone=undefined for new plugins
- Type safety: Validates unknown config values, filters to string|number|boolean

**Test Results:** 646/646 tests passing (was 633 baseline)

**Merge:** Feature commits to feature/issue-lensing-57h8

## What to build

- In createHostService, wire the new plugin handler callbacks:
  - getPlugins → adminStore.getPlugins()
  - setPluginEnabled → adminStore.setEnabled() + db.setPluginState()
  - updatePluginConfig → adminStore.updateConfig() + db.setPluginState()
  - assignPluginZone → adminStore.assignZone() + db.setLayout()
  - reloadPlugins → pluginLoader.reload() + re-register in adminStore
- On AdminStore onChange, broadcast via wsServer.broadcast()
- Persist plugin state (enabled, config, zone) across restarts via database
