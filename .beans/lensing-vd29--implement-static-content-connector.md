---
# lensing-vd29
title: Implement static content connector
status: completed
type: task
priority: normal
created_at: 2026-02-28T15:45:14Z
updated_at: 2026-03-02T13:51:17Z
parent: lensing-r333
---

Implement the static connector that passes through user-defined data without fetching.

## Acceptance Criteria

- [x] Accepts a static data object in connector config
- [x] Returns data as-is (no fetching, no transformation)
- [x] Useful for widgets displaying fixed content (welcome messages, labels)

---

**Size:** S
**Area:** backend

## Completed

**Files changed:**

- packages/core/src/static-connector.ts (33 lines, new) — Static passthrough connector
- packages/core/src/**tests**/static-connector.test.ts (92 lines, new) — 8 tests
- packages/core/src/index.ts (4 lines added) — Exports StaticConnector

**Key decisions:**

- Trivial passthrough: fetch() returns config.data as-is
- getCachedResponse() always returns data (no actual cache needed)
- clearCache() is a no-op (data is always available from config)

**Notes for next task:**

- Use createStaticConnector(config) to create instances
- No network/SSRF implications
- All 3 connectors now implemented: JSON API, RSS/Atom, Static
