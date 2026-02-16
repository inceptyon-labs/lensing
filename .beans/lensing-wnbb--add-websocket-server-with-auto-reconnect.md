---
# lensing-wnbb
title: Add WebSocket server with auto-reconnect
status: todo
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:backend
created_at: 2026-02-16T21:23:08Z
updated_at: 2026-02-16T21:23:08Z
parent: lensing-995t
---

WebSocket server pushing updates from host to display UI with robust reconnection.

## Acceptance Criteria

- [ ] WebSocket server alongside REST (ws or socket.io)
- [ ] Push layout changes, plugin data updates, and scene changes to connected clients
- [ ] Client-side auto-reconnect with exponential backoff
- [ ] Handles Pi sleep/wake, network blips, host restarts gracefully
- [ ] Connection status exposed to UI (connected/reconnecting indicator)

---

**Size:** M
