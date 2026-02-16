---
# lensing-8qeh
title: Implement notification queue with priority and TTL
status: todo
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:backend
  - area:db
created_at: 2026-02-16T21:25:23Z
updated_at: 2026-02-16T21:25:23Z
parent: lensing-a6c6
---

SQLite-backed notification queue with priority levels, TTL expiry, and deduplication.

## Acceptance Criteria

- [ ] SQLite table: notifications (id, source, priority, title, body, ttl, created_at, read, dedupe_key)
- [ ] Priority levels: info, warning, urgent
- [ ] TTL expiry: notifications auto-expire after configured duration
- [ ] Deduplication: same dedupe_key within window = single notification
- [ ] Plugin emission API: plugins call notificationQueue.emit({ ... })
- [ ] System events: automatic notifications for plugin errors, connectivity loss

---

**Size:** M
