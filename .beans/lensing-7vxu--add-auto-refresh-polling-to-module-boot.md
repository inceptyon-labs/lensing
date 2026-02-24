---
# lensing-7vxu
title: Add auto-refresh polling to module boot
status: completed
type: task
priority: critical
created_at: 2026-02-24T17:59:42Z
updated_at: 2026-02-24T19:55:13Z
parent: lensing-wbum
blocking:
  - lensing-gi9v
---

Server modules expose refresh() but nobody calls it. Modules boot but never fetch data. Need to call refresh() after boot and set up periodic polling intervals.

## Current State

- bootModule() in module-boot.ts creates module instances but never calls .refresh()
- No setInterval or polling timer exists
- pluginScheduler is created but immediately discarded (not used)
- Each module server has a refreshInterval or maxStale config but it's ignored

## What to Do

- After each module boots in bootModule(), call instance.refresh() to trigger initial data fetch
- Set up setInterval for periodic refresh based on module config (e.g. weather: 5min, crypto: 5min, news: 10min)
- Return the interval ID so it can be cleared on close
- Update BootedModule type to include cleanup
- OR: use the existing pluginScheduler to manage refresh timers

## Key Files

- packages/core/src/module-boot.ts
- packages/core/src/host-service.ts (pluginScheduler is created but unused)

## Summary of Changes

**Implementation complete.** All features delivered:

- ✓ Added MODULE_REFRESH_MS map with configurable intervals per module
- ✓ Created startPolling() helper to fire initial refresh() and set up setInterval
- ✓ Updated BootedModule interface to track refresh() and timer
- ✓ Integrated polling into bootEnabledModules() and rebootModule()
- ✓ Added timer cleanup in host-service.ts (3 places: error, shutdown, close)
- ✓ Added 3 integration tests covering initial refresh, periodic polling, timer cleanup

**Test results:** All 698 tests passing (695 existing + 3 new)
**Code review:** O-level review complete, no errors found
**Branch:** feature/lensing-7vxu at 00e2447
