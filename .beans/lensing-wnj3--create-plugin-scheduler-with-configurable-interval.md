---
# lensing-wnj3
title: Create plugin scheduler with configurable intervals
status: todo
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:backend
created_at: 2026-02-16T21:23:49Z
updated_at: 2026-02-16T21:23:49Z
parent: lensing-q2h4
---

Centralized scheduler running server-side plugins at configured intervals.

## Acceptance Criteria

- [ ] Scheduler runs each plugin's server module at its configured refresh interval
- [ ] Configurable intervals per plugin (from manifest + admin overrides)
- [ ] Resource budget enforcement: max refresh rate, max request burst
- [ ] Scheduler start/stop/restart for individual plugins
- [ ] Scheduler state visible to admin panel

---

**Size:** M
