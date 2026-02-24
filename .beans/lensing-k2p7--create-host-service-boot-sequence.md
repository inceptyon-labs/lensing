---
# lensing-k2p7
title: Create host service boot sequence
status: in-progress
type: task
priority: high
tags:
    - area:backend
    - size:M
created_at: 2026-02-24T02:45:35Z
updated_at: 2026-02-24T02:47:57Z
parent: lensing-is1m
---

Create packages/core/src/host-service.ts with createHostService() factory.

## What to build
- Factory: createHostService(options: HostServiceOptions): HostServiceInstance
- Options: port, pluginsDir, dbPath, logger
- Boot sequence: createDatabase → createPluginLoader → discover+load → createDataBus → createRestServer (wired to DB) → createWsServer (attached to same HTTP server) → createPluginScheduler
- Graceful shutdown: close all in reverse order on SIGINT/SIGTERM
- Export from @lensing/core index

## Implementation notes
- Wire RestServerHandlers to database: getSettings→db.getAllSettings, putSettings→db.setSetting, etc.
- Use WsServer's server option to share the HTTP server with REST
- Add HostServiceOptions and HostServiceInstance types to @lensing/types
