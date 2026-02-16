---
# lensing-oeoo
title: 'Epic: Notification System + Admin Polish'
status: todo
type: epic
priority: normal
tags:
  - pasiv
  - priority:medium
created_at: 2026-02-16T21:19:39Z
updated_at: 2026-02-16T21:19:39Z
---

Full notification pipeline, admin dashboard with health monitoring, and backup/restore capabilities.

## Vision

A production-ready notification system with priority routing and a polished admin experience for monitoring, troubleshooting, and managing the dashboard.

## Features

- Notification queue (priority, TTL, dedup)
- Display notification overlays
- Admin health dashboard
- Backup & restore (config export/import)

## Success Criteria

- [ ] Notifications queue with priority levels and TTL expiry
- [ ] Urgent notifications overlay on kiosk display
- [ ] Admin UI shows plugin health, resource usage, and notification feed
- [ ] Config exports as JSON and imports with schema versioning
