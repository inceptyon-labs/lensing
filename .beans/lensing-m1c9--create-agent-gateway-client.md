---
# lensing-m1c9
title: Create agent gateway client
status: todo
type: task
priority: normal
tags:
    - pasiv
    - size:M
    - area:backend
created_at: 2026-02-16T21:25:11Z
updated_at: 2026-02-16T21:25:11Z
parent: lensing-r418
---

Lightweight agent gateway running on the Pi, communicating with remote Agent Service.

## Acceptance Criteria
- [ ] Gateway client connects to remote Agent Service (WebSocket or HTTP)
- [ ] Forwards user requests (from admin UI) to Agent Service
- [ ] Receives agent responses and triggers local UI events
- [ ] Forwards data bus snapshots to Agent Service on request
- [ ] Connection health monitoring and auto-reconnect

---
**Size:** M
