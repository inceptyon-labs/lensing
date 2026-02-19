---
# lensing-jiuc
title: Implement scene data model and switcher
status: in-progress
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:backend
  - area:frontend
created_at: 2026-02-16T21:24:45Z
updated_at: 2026-02-19T15:37:13Z
parent: lensing-j4k2
---

Scene data model, storage, and transition system.

## Acceptance Criteria

- [x] Scene model: name, layout profile, active plugins, visual settings (opacity, color temp)
- [x] SQLite table for scene persistence
- [x] Scene switcher with smooth CSS transitions between modes
- [x] Default scenes: morning, evening, ambient, focus, alert
- [x] Scene API: GET/PUT scenes, POST switch

---

**Size:** M
