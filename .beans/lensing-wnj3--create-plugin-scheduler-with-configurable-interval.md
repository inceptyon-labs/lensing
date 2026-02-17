---
# lensing-wnj3
title: Create plugin scheduler with configurable intervals
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:backend
created_at: 2026-02-16T21:23:49Z
updated_at: 2026-02-17T20:40:02Z
parent: lensing-q2h4
---

Centralized scheduler running server-side plugins at configured intervals.

## Acceptance Criteria

- [x] Scheduler runs each plugin's server module at its configured refresh interval
- [x] Configurable intervals per plugin (from manifest + admin overrides)
- [x] Resource budget enforcement: max refresh rate, max request burst
- [x] Scheduler start/stop/restart for individual plugins
- [x] Scheduler state visible to admin panel

---

**Size:** M

## Summary of Changes

### Implementation

- Core scheduler factory: `createPluginScheduler(options)` with configurable default interval
- Per-plugin registration with manifest intervals + admin overrides
- Resource budget enforcement: max_refresh_ms minimum interval, max_request_burst sliding window
- Individual plugin lifecycle: start/stop/restart, plus startAll/stopAll
- Generation token pattern for async callback invalidation (prevents stale mutations during stop/unregister)

### Key Features

- setTimeout chains (not setInterval) for drift-free scheduling
- Burst window tracking: 60s sliding window, evicts old timestamps automatically
- Error isolation: failures don't affect other plugins, recovery on next tick
- State visibility: getState() for admin panel, getPluginState(id) for individual status

### Tests

- 27 tests covering: registration, lifecycle, resource budgets, error handling, state tracking, close
- All 113 core package tests passing

### Architecture

- Factory pattern returns PluginSchedulerInstance interface
- Internal PluginRecord tracks handler, timer, entry, generation token, burst window
- Stale callback prevention: every lifecycle operation increments generation, checked at async boundaries
- Built for monorepo use in @lensing/core

### Commits

1. feat: add plugin scheduler with configurable intervals (lensing-wnj3)
2. feat: export plugin scheduler from index.ts (lensing-wnj3)
3. style: format and fix lint errors (lensing-wnj3)
4. fix: address Codex review findings (lensing-wnj3)
5. fix: resolve TypeScript control flow narrowing issue in plugin-scheduler
