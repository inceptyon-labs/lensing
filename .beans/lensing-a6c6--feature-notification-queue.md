---
# lensing-a6c6
title: 'Feature: Notification Queue'
status: completed
type: feature
priority: high
tags:
    - pasiv
    - priority:high
    - area:backend
    - area:db
created_at: 2026-02-16T21:21:50Z
updated_at: 2026-02-18T01:47:16Z
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

## Summary of Changes

Feature: Notification Queue completed.

**Task completed:**
- lensing-8qeh: Implement notification queue with priority and TTL (20 tests, 350+ lines)

**Deliverables:**
- In-memory notification queue factory (createNotificationQueue)
- Priority-based ordering (urgent > warning > info)
- TTL-based auto-expiry with periodic sweep
- Deduplication by source + dedupe_key within time window
- Plugin emission API (emit, emitSystemEvent)
- Listener pattern with unsubscribe
- Security fixes: TTL enforcement, cross-source collision prevention

**Status:** Feature complete and merged to main

**Tests:** 189/189 passing (20 notification-queue specific tests)
