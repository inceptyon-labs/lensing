---
# lensing-k2p7
title: Create host service boot sequence
status: completed
type: task
priority: high
tags:
    - area:backend
    - size:M
created_at: 2026-02-24T02:45:35Z
updated_at: 2026-02-24T03:24:06Z
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

## Completed

**Implementation Summary:**
- ✓ Created packages/core/src/host-service.ts with createHostService() factory
- ✓ Added HostServiceOptions/Logger types to @lensing/types
- ✓ Added HostServiceInstance interface to @lensing/core/src/host-service.ts
- ✓ Boot sequence: Database → PluginLoader → DataBus → RestServer (wired) → WebSocket (attached) → PluginScheduler
- ✓ Graceful shutdown on SIGINT/SIGTERM, cleanup on boot failure
- ✓ Exported from @lensing/core
- ✓ Comprehensive tests: 9 tests, all passing
- ✓ TDD: RED → GREEN → REFACTOR → COMMIT
- ✓ SC Review: Sonnet + Codex fixes applied

**Test Results:** 621/621 tests passing (36 test suites)
