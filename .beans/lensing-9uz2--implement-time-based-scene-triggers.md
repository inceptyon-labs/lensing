---
# lensing-9uz2
title: Implement time-based scene triggers
status: in-progress
type: task
priority: normal
tags:
    - pasiv
    - size:M
    - area:backend
created_at: 2026-02-16T21:24:49Z
updated_at: 2026-02-23T22:53:42Z
parent: lensing-js1y
---

Cron-style scheduler for automatic scene changes by time of day.

## Acceptance Criteria

- [x] Cron-style schedule: e.g., morning at 6am, evening at 6pm, sleep at 11pm
- [x] Schedule persisted in SQLite, editable via admin UI
- [x] Manual override: switch scene from admin UI or CLI (`lensing scene <name>`)
- [x] CLI: `lensing scene list` shows available scenes and schedule

---

**Size:** M
