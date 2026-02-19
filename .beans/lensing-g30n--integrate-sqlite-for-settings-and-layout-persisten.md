---
# lensing-g30n
title: Integrate SQLite for settings and layout persistence
status: in-progress
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:db
created_at: 2026-02-16T21:23:16Z
updated_at: 2026-02-19T17:29:10Z
parent: lensing-995t
---

SQLite database for persisting settings, layout configuration, and plugin state.

## Acceptance Criteria

- [x] SQLite database file with schema migrations
- [x] Tables: settings (key-value), layouts (zone config), plugin_state (per-plugin cache)
- [x] CRUD operations via typed data access layer
- [x] Schema versioning for forward compatibility
- [x] Database file in a configurable location (default: data/lensing.db)

---

**Size:** M
