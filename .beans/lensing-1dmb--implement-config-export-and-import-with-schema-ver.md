---
# lensing-1dmb
title: Implement config export and import with schema versioning
status: in-progress
type: task
priority: normal
tags:
  - pasiv
  - size:M
  - area:backend
created_at: 2026-02-16T21:25:40Z
updated_at: 2026-02-22T03:59:40Z
parent: lensing-kd62
---

Config export/import with schema versioning and automatic migrations.

## Acceptance Criteria

- [x] Export: dump full config (layout, plugin settings, themes, scene schedules) as single JSON
- [x] Import: restore config from JSON file, apply on new Pi
- [x] Schema version field in exported JSON
- [x] Automatic migrations: import from older schema versions to current
- [x] CLI: `lensing config export`, `lensing config import <file>`, `lensing config reset`

---

**Size:** M
