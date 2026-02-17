---
# lensing-gtnp
title: Build caching helpers with staleness tracking
status: in-progress
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:backend
created_at: 2026-02-16T21:23:51Z
updated_at: 2026-02-17T00:36:53Z
parent: lensing-q2h4
---

Centralized caching layer with staleness tracking and request coalescing.

## Acceptance Criteria

- [ ] Cache layer in @lensing/core for plugin data
- [ ] Staleness tracking: plugins declare max_stale; data older than threshold flagged
- [ ] Request coalescing: prevent duplicate API calls when multiple plugins need the same data
- [ ] Cache stored in SQLite plugin_state table
- [ ] Cache invalidation on plugin config change

---

**Size:** M
