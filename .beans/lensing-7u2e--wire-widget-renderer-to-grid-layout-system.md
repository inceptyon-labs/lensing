---
# lensing-7u2e
title: Wire widget renderer to grid layout system
status: todo
type: task
priority: high
created_at: 2026-02-28T15:47:52Z
updated_at: 2026-02-28T15:47:52Z
parent: lensing-25mp
---

Integrate the Shadow DOM / iframe widget renderer with the existing zone-based grid layout.

## Acceptance Criteria
- [ ] Builder-created plugins render in their assigned zone (same as built-in modules)
- [ ] Widget container receives zone dimensions and adapts
- [ ] Data bus subscription: widget listens for connector data on its plugin channel
- [ ] Widget lifecycle: mount on zone assignment, unmount on removal
- [ ] Works alongside existing built-in module widgets without conflict

---
**Size:** S
**Area:** frontend
