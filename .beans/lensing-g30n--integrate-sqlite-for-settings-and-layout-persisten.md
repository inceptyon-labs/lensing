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
updated_at: 2026-02-19T16:58:18Z
parent: lensing-995t
---

SQLite database for persisting settings, layout configuration, and plugin state.

## Acceptance Criteria

- [ ] SQLite database file with schema migrations
- [ ] Tables: settings (key-value), layouts (zone config), plugin_state (per-plugin cache)
- [ ] CRUD operations via typed data access layer
- [ ] Schema versioning for forward compatibility
- [ ] Database file in a configurable location (default: data/lensing.db)

---

**Size:** M
