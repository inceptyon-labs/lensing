---
# lensing-8659
title: Implement offline fallback with local cache
status: todo
type: task
priority: normal
created_at: 2026-02-28T15:46:49Z
updated_at: 2026-02-28T15:46:49Z
parent: lensing-7nct
---

Graceful degradation when the device has no internet or GitHub is unreachable.

## Acceptance Criteria
- [ ] Marketplace endpoints serve cached data when fetch fails
- [ ] Response includes `offline: true` flag for UI to show banner
- [ ] Cached data includes timestamp for "Last updated X ago" display
- [ ] Install from marketplace blocked when offline (clear error message)
- [ ] Manual ZIP install still works when offline

---
**Size:** S
**Area:** backend
