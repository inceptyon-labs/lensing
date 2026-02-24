---
# lensing-7vxu
title: Add auto-refresh polling to module boot
status: todo
type: task
priority: critical
created_at: 2026-02-24T17:59:42Z
updated_at: 2026-02-24T18:00:55Z
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
