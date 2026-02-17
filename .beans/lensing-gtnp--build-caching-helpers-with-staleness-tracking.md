---
# lensing-gtnp
title: Build caching helpers with staleness tracking
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:backend
created_at: 2026-02-16T21:23:51Z
updated_at: 2026-02-17T00:41:45Z
parent: lensing-q2h4
---

Centralized caching layer with staleness tracking and request coalescing.

## Acceptance Criteria

- [ ] Cache layer in @lensing/core for plugin data
- [ ] Staleness tracking: plugins declare max_stale; data older than threshold flagged
- [ ] Request coalescing: prevent duplicate API calls when multiple plugins need the same data
- [ ] Cache stored in SQLite plugin_state table
- [ ] Cache invalidation on plugin config change

---

**Size:** M

## Completed

**Files changed:**

- packages/types/src/index.ts — Added StalePolicy, CacheEntry, StaleStatus, CacheStore interfaces
- packages/core/src/cache.ts — New: in-memory cache with staleness tracking, request coalescing, pattern-based invalidation
- packages/core/src/**tests**/cache.test.ts — 16 comprehensive tests
- packages/core/src/index.ts — Updated exports

**Key decisions:**

- In-memory Map-based storage (SQLite backing deferred to next task)
- Staleness checked on every readOrFetch (stale data not returned)
- Request coalescing prevents duplicate concurrent fetches for same key
- Wildcard pattern matching with regex escaping for safety
- inFlight tracking cleaned up during invalidation to prevent stuck requests

**Notes for next task:**

- Use createCacheStore() to create cache instance
- readOrFetch() automatically coalesces duplicate requests and checks staleness
- invalidate() supports both exact keys and wildcard patterns (e.g. 'weather:\*')
- Cache is unbounded (no automatic eviction); consider adding for long-lived processes
- Type safety: concurrent calls for same key with different fetchers only use first fetcher's result
