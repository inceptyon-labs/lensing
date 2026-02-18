---
# lensing-a6c6
title: 'Feature: Notification Queue'
status: in-progress
type: feature
priority: high
tags:
  - pasiv
  - priority:high
  - area:backend
  - area:db
created_at: 2026-02-16T21:21:50Z
updated_at: 2026-02-18T01:34:17Z
parent: lensing-oeoo
---

Persistent notification queue with priority levels, TTL, and deduplication.

## Goals

- Priority levels: info, warning, urgent
- SQLite-backed queue with TTL expiry and deduplication
- Plugin notification emission API (any plugin can emit notifications)
- System event notifications (plugin error, connectivity loss)
- User controls: per-plugin toggle, quiet hours, priority threshold

## Scope

**In Scope:** Queue, priority, TTL, dedup, emission API, user controls
**Out of Scope:** Web Push API (stretch goal)
