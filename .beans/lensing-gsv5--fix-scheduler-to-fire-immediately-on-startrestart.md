---
# lensing-gsv5
title: Fix scheduler to fire immediately on start/restart
status: completed
type: bug
priority: normal
created_at: 2026-03-04T02:55:44Z
updated_at: 2026-03-04T02:59:42Z
---

Plugin scheduler waits the full refresh interval before first handler execution, meaning newly created/loaded plugins show blank content until the interval elapses (up to 5+ minutes). Fixed by adding optional delay parameter to scheduleNext() and passing delay=0 from start() and restart().

## Changes

- `packages/core/src/host-service.ts`: Reordered boot sequence so data bus + connector runner are created before plugin loader, enabling connector auto-start on boot
- `packages/core/src/plugin-scheduler.ts`: Added optional `delay` parameter to `scheduleNext()`, updated `start()` and `restart()` to pass `delay: 0` for immediate first fire
- `packages/core/src/__tests__/plugin-scheduler.test.ts`: Updated all test expectations to account for immediate first fire (call counts increased by 1)

## Summary of Changes

- Scheduler now fires handler immediately (delay=0) on `start()` and `restart()`, so plugin data is available right away
- All 27 scheduler tests pass with updated expectations
- Full suite: 1,819 tests pass, build clean
