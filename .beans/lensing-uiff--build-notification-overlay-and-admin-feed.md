---
# lensing-uiff
title: Build notification overlay and admin feed
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:frontend
created_at: 2026-02-16T21:25:28Z
updated_at: 2026-02-17T01:40:49Z
parent: lensing-djl7
---

Notification rendering on kiosk display and admin UI feed.

## Acceptance Criteria

- [ ] Kiosk: urgent notifications as banner overlay at top of display
- [ ] Kiosk: info/warning as toast-style transient notifications
- [ ] Admin: notification feed page with history, filtering, mark-as-read
- [ ] Notifications pushed via WebSocket in real-time
- [ ] Per-plugin notification toggle and quiet hours in admin settings

---

**Size:** M

## Summary

Built notification store (createNotificationStore) with:

- Priority-based routing: urgent → banners, info/warning → toasts
- TTL-based toast expiry (configurable default)
- Quiet hours suppression (non-urgent only)
- Per-plugin notification toggle
- Read/dismissed tracking
- Filter by priority, source, read status
- onChange callbacks for real-time UI updates
- Immutable returned entries
- 55 comprehensive tests, all passing

SC review completed: fixed TTL=0 handling, retroactive quiet hours/plugin control checks, immutability.
Build, lint, type-check all pass. Merged to main.
