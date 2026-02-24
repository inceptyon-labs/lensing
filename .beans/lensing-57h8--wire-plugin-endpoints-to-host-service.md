---
# lensing-57h8
title: Wire plugin endpoints to host service
status: todo
type: task
priority: normal
tags:
    - area:backend
    - size:S
created_at: 2026-02-24T02:45:48Z
updated_at: 2026-02-24T02:45:48Z
parent: lensing-ij9t
blocked_by:
    - lensing-k2p7
---

Connect plugin REST endpoints to AdminStore + PluginLoader + Database in the host service.

## What to build
- In createHostService, wire the new plugin handler callbacks:
  - getPlugins → adminStore.getPlugins()
  - setPluginEnabled → adminStore.setEnabled() + db.setPluginState()
  - updatePluginConfig → adminStore.updateConfig() + db.setPluginState()
  - assignPluginZone → adminStore.assignZone() + db.setLayout()
  - reloadPlugins → pluginLoader.reload() + re-register in adminStore
- On AdminStore onChange, broadcast via wsServer.broadcast()
- Persist plugin state (enabled, config, zone) across restarts via database
