---
# lensing-odrh
title: Integrate connectors with plugin scheduler
status: todo
type: task
priority: high
created_at: 2026-02-28T15:45:21Z
updated_at: 2026-02-28T15:45:21Z
parent: lensing-r333
---

Wire connector execution into the existing plugin scheduler for periodic data refresh.

## Acceptance Criteria

- [ ] Register builder-created plugins with scheduler using connector.refresh_ms
- [ ] Scheduler triggers connector fetch on interval
- [ ] Connector results published to data bus for display clients
- [ ] Respects existing burst limiting from plugin scheduler
- [ ] Clean shutdown: stop connector polling on plugin disable/uninstall

---

**Size:** M
**Area:** backend
