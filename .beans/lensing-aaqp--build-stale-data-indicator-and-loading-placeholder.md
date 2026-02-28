---
# lensing-aaqp
title: Build stale data indicator and loading placeholder
status: todo
type: task
priority: normal
created_at: 2026-02-28T15:47:44Z
updated_at: 2026-02-28T15:47:44Z
parent: lensing-25mp
---

Visual states for when widget data is loading, stale, or unavailable.

## Acceptance Criteria
- [ ] Loading state: subtle shimmer/skeleton matching widget dimensions
- [ ] Stale state: small indicator (e.g. dimmed clock icon) when data is older than 2x refresh interval
- [ ] Error state: "Waiting for data..." placeholder when no data has ever been received
- [ ] States styled to match dark display theme
- [ ] Transitions between states are smooth (no jarring flicker)

---
**Size:** S
**Area:** frontend
