---
# lensing-jrge
title: Implement per-widget error boundaries
status: todo
type: task
priority: high
tags:
  - pasiv
  - size:S
  - area:frontend
created_at: 2026-02-16T21:23:01Z
updated_at: 2026-02-16T21:23:01Z
parent: lensing-f2jb
---

Svelte error boundaries per widget slot so a crashing plugin never takes down the display.

## Acceptance Criteria

- [ ] ErrorBoundary component wraps each widget slot
- [ ] Crashing widget shows graceful error tile with plugin name and retry option
- [ ] Error state is contained — other widgets continue rendering
- [ ] Error is logged and reported to host for admin panel visibility

---

**Size:** S
