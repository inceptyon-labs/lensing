---
# lensing-h1kz
title: Implement pub/sub data bus
status: todo
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:backend
created_at: 2026-02-16T21:23:56Z
updated_at: 2026-02-16T21:23:56Z
parent: lensing-0rn7
---

Publish/subscribe data bus for inter-plugin communication.

## Acceptance Criteria

- [ ] Named channels: plugins publish to channels (e.g., weather.current, calendar.today)
- [ ] Subscribe API: plugins and agent service subscribe to channels
- [ ] Immutable snapshots: subscribers get read-only data (no mutation of another plugin's data)
- [ ] Typed channel contracts in @lensing/types
- [ ] Bus events forwarded to WebSocket for UI rendering

---

**Size:** M
