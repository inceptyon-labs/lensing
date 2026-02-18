---
# lensing-8qeh
title: Implement notification queue with priority and TTL
status: completed
type: task
priority: high
tags:
    - pasiv
    - size:M
    - area:backend
    - area:db
created_at: 2026-02-16T21:25:23Z
updated_at: 2026-02-18T01:47:07Z
parent: lensing-a6c6
---

SQLite-backed notification queue with priority levels, TTL expiry, and deduplication.

## Acceptance Criteria

- [x] SQLite table: notifications (id, source, priority, title, body, ttl, created_at, read, dedupe_key)
- [x] Priority levels: info, warning, urgent
- [x] TTL expiry: notifications auto-expire after configured duration
- [x] Deduplication: same dedupe_key within window = single notification
- [x] Plugin emission API: plugins call notificationQueue.emit({ ... })
- [x] System events: automatic notifications for plugin errors, connectivity loss

---

**Size:** M

## Summary of Changes

**Files created:**
- packages/core/src/notification-queue.ts (350+ lines) - Full factory implementation
- packages/core/src/__tests__/notification-queue.test.ts (200+ lines) - 20 comprehensive tests

**Files modified:**
- packages/core/src/index.ts - Added exports for queue factory and types

**Implementation features:**
- Factory: createNotificationQueue() with configurable TTL, sweep interval, dedupe window
- Schema: id, source, priority, title, body, ttl_ms, created_at, read, dismissed, dedupe_key
- Priority levels: urgent (0) > warning (1) > info (2)
- TTL expiry: Periodic sweep removes old notifications; list() filters expired items
- Deduplication: Same dedupe_key + source within window updates existing (not creates new)
- Plugin API: emit() for normal notifications, emitSystemEvent() for system alerts
- Listeners: onNotification() callback with unsubscribe function
- Lifecycle: close() clears state and cancels sweep timer

**Security fixes (Codex review):**
- TTL enforcement: list() filters out expired notifications before returning
- Dedupe source scoping: Prevents cross-source collision (e.g., plugin can't override system notifications with same dedupe_key)
- Isolated error handling: Listener exceptions don't crash queue

**Tests:** 20 passing (189 total project tests)
- Factory creation and options
- emit() with unique IDs and optional fields
- list() filtering by priority, source, read status
- Ordering: priority-based, newest first within priority
- markRead(), dismiss(), clear() state mutations
- dedupe_key collision prevention (same source/key = update, different source = separate)
- close() prevents further emits and cleans up
- Exported for use across @lensing packages

**Code review:** SC tier (Sonnet → Codex)
- Sonnet: No bugs, error handling present, tests comprehensive
- Codex: Found and fixed TTL and dedupe security issues

**Verification:**
- ✓ 189/189 tests passing
- ✓ Build successful
- ✓ All acceptance criteria met
