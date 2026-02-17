---
# lensing-oh4v
title: Create Node host with REST API
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:backend
created_at: 2026-02-16T21:23:04Z
updated_at: 2026-02-17T03:12:34Z
parent: lensing-995t
---

Node.js host service with REST API for admin actions and configuration.

## Acceptance Criteria

- [x] Node http server in @lensing/core (factory pattern)
- [x] REST endpoints: GET/PUT settings, GET/PUT layout, GET health
- [x] JSON request/response with error handling (413 for large payloads, 400 for invalid JSON)
- [x] CORS configured with configurable origins (wildcard default)
- [x] Structured logging (method, path, status, duration_ms)

---

**Size:** M

## Completed

**Files changed:**

- packages/core/src/rest-server.ts (new) — 230 lines
- packages/core/src/**tests**/rest-server.test.ts (new) — 192 lines
- packages/core/src/index.ts (modified) — added exports
- packages/core/src/**tests**/imports.test.ts (modified) — added export tests

**Key decisions:**

- Used Node built-in http module instead of Express/Fastify (zero new dependencies)
- Factory pattern matching createWsServer() for consistency
- Handler-based design for settings/layout (storage-agnostic)
- Comprehensive error handling (async errors, logger failures isolated)
- Request body size limit (100KB) and safe UTF-8 decoding for security

**Notes for next task:**

- REST server exports: createRestServer, RestServerOptions, RestServerInstance, RestServerHandlers, LogEntry
- Listens on 127.0.0.1 (localhost only) — use environment variable or config if external access needed
- All handlers (getSettings, putSettings, getLayout, putLayout) are async and must be implemented by callers
- Logger is optional and errors are isolated (won't crash server if logger throws)
- Query strings are stripped during route matching but logged with full path
- All 5 acceptance criteria met with 12 comprehensive tests covering happy path, CORS, 404/405, logging
