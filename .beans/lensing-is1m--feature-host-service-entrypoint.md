---
# lensing-is1m
title: 'Feature: Host Service Entrypoint'
status: completed
type: feature
priority: high
tags:
  - pasiv
  - area:backend
created_at: 2026-02-24T02:45:01Z
updated_at: 2026-02-24T14:55:26Z
parent: lensing-z2ez
---

Create a host service that assembles all core pieces into a running Node.js process.

## Goals

- Single entrypoint that boots: Database, PluginLoader, RestServer, WsServer, DataBus, PluginScheduler
- Wires RestServerHandlers to database methods
- Attaches WsServer to the same HTTP server
- Discovers and loads plugins from a configurable directory
- Graceful shutdown on SIGINT/SIGTERM

## Acceptance Criteria

- [ ] Host service boots and listens on configurable port
- [ ] REST /health endpoint responds
- [ ] WebSocket accepts connections
- [ ] Plugins discovered from plugins directory
- [ ] Clean shutdown closes all resources
