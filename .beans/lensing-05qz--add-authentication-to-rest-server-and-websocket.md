---
# lensing-05qz
title: Add authentication to REST server and WebSocket
status: completed
type: task
priority: critical
created_at: 2026-03-02T16:49:13Z
updated_at: 2026-03-02T21:52:15Z
parent: lensing-umpl
---

**Scan finding:** MH-1, M-6, M-7

The REST server binds to `0.0.0.0` with no authentication. All admin endpoints (`/settings`, `/plugins/install`, `/layout`, `/plugins/{id}/config`, `/modules/{id}/restart`) and the WebSocket upgrade are fully accessible to any device on the local network.

## Acceptance Criteria

- [ ] REST server binds to `127.0.0.1` by default
- [ ] Config option to opt-in to `0.0.0.0` binding
- [ ] Shared secret / token auth middleware on all admin endpoints
- [ ] WebSocket upgrade validates auth token
- [ ] Plugin install endpoint requires auth
- [ ] Tests for auth middleware (reject unauthorized, allow authorized)

## Files

- `packages/core/src/rest-server.ts`
- New: auth middleware module

## Size: L

## Area: backend
