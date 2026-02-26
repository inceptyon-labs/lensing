---
# lensing-hqrt
title: Add syncModulesWithLayout to module-boot
status: completed
type: task
priority: normal
tags:
  - area:backend
created_at: 2026-02-26T02:51:47Z
updated_at: 2026-02-26T02:59:00Z
parent: lensing-97w9
---

Add a new function `syncModulesWithLayout` to `packages/core/src/module-boot.ts` that reconciles running modules with the grid layout.

Given a set of widget IDs from the saved layout, it:

- Boots modules that are in the layout but not yet running
- Stops modules that are running but no longer in the layout
- Skips non-built-in module IDs (third-party plugins)
- Returns updated modules array

## Files

- packages/core/src/module-boot.ts (new function)
- packages/core/src/**tests**/module-boot.test.ts (tests)

## Acceptance Criteria

- [x] `syncModulesWithLayout(layoutIds, modules, db, deps, log)` function exported
- [x] Boots modules in layout that are not running
- [x] Stops modules running that are not in layout
- [x] Ignores unknown/third-party IDs gracefully
- [x] Returns updated BootedModule array
- [x] Tests for boot-new, stop-removed, no-op, and unknown IDs

## Summary of Changes

Added `syncModulesWithLayout` to `packages/core/src/module-boot.ts` with 7 tests in `module-boot.test.ts`.

Key decisions:

- Uses Set for deduplication and O(1) lookups
- Filters non-built-in IDs (third-party plugins handled separately)
- Does NOT check config.enabled — layout presence = should be running

Notes for next task:

- Call `syncModulesWithLayout(layoutIds, _modules, _db, deps, logger)` in host-service
- Extract widget IDs from layout via `layout.widgets.map(w => w.id)`
- The function returns a new array; assign it back to `_modules`
