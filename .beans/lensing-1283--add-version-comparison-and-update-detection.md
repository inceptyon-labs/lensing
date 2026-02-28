---
# lensing-1283
title: Add version comparison and update detection
status: todo
type: task
priority: normal
created_at: 2026-02-28T15:46:46Z
updated_at: 2026-02-28T15:46:46Z
parent: lensing-7nct
---

Compare installed plugin versions against marketplace to detect available updates.

## Acceptance Criteria

- [ ] Compare installed plugin version against marketplace index version (semver)
- [ ] GET /marketplace/updates — list plugins with available updates
- [ ] POST /marketplace/:id/update — download and install newer version
- [ ] Config preserved during update (only template/connector/manifest replaced)
- [ ] Update flow validates new version > installed version

---

**Size:** S
**Area:** backend
