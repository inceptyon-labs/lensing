---
# lensing-f305
title: Wire data bus to WebSocket broadcast
status: completed
type: task
priority: critical
created_at: 2026-02-24T17:59:33Z
updated_at: 2026-02-24T18:33:37Z
parent: lensing-wbum
blocking:
  - lensing-gi9v
---

In host-service.ts, connect dataBus.onMessage() to ws.broadcast() so that data published by server modules is forwarded to all connected display clients as plugin_data WebSocket messages.

## Current State

- dataBus is created at line 65
- ws server is created at line 132
- They are never connected
- dataBus.onMessage() exists specifically for WS forwarding (the test says so)
- ws.broadcast() exists but is never called with data bus messages

## What to Do

- After both dataBus and ws are ready, wire: dataBus.onMessage((msg) => ws.broadcast({ type: 'plugin_data', payload: msg, timestamp: new Date().toISOString() }))
- This is ~3 lines of code in host-service.ts
- Add test: verify that publishing to data bus results in a WS message to connected clients

## Key Files

- packages/core/src/host-service.ts
- packages/core/src/data-bus.ts (onMessage interface)
- packages/core/src/ws-server.ts (broadcast interface)

## Summary of Changes

**Files changed:**

- packages/core/src/host-service.ts (modified — added dataBus to interface, wired onMessage→broadcast)
- packages/core/src/**tests**/host-service.test.ts (modified — 2 new integration tests)
- packages/cli/src/**tests**/start.test.ts (modified — added dataBus to mock)

**Key decisions:**

- Exposed dataBus on HostServiceInstance interface (same pattern as db, ws, rest)
- Wiring placed after \_ws.ready() completes, before module boot
- Data bus messages wrapped as { type: 'plugin_data', payload: msg, timestamp }

**Notes for next task:**

- dataBus is now accessible via hostService.dataBus
- All data bus publishes now reach WebSocket clients automatically
- Client still needs to handle 'plugin_data' WS messages (lensing-gi9v)
- Modules still need auto-refresh polling to publish data (lensing-7vxu)
