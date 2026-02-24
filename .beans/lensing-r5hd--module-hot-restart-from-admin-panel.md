---
# lensing-r5hd
title: Module hot-restart from admin panel
status: completed
type: feature
priority: normal
created_at: 2026-02-24T16:53:27Z
updated_at: 2026-02-24T16:56:37Z
---

After saving module config, add a Restart button that hot-reboots just the changed module in-place via rebootModule() + POST /modules/:id/restart endpoint.

## Todo

- [x] Add rebootModule() function to module-boot.ts
- [x] Add rebootModule tests
- [x] Add restartModule handler + POST /modules/:id/restart route to rest-server.ts
- [x] Wire restartModule handler in host-service.ts
- [x] Add host-service restart endpoint tests
- [x] Add /modules proxy to vite.config.ts
- [x] Update AdminModuleCard with status state machine + restart button
- [x] Update AdminModuleSettings with onRestart callback
- [x] Add admin UI restart tests
- [x] Verify: pnpm test + pnpm build pass

## Summary of Changes

Added module hot-restart capability from the admin panel:

1. **rebootModule()** in module-boot.ts — closes old instance, re-reads config from DB, boots new instance, mutates modules array
2. **POST /modules/:id/restart** endpoint in rest-server.ts with handler wired in host-service.ts
3. **AdminModuleCard** status state machine (idle→saved→restarting→restarted/error) with Restart/Retry buttons
4. **AdminModuleSettings** passes onRestart callback that calls the new endpoint
5. Vite proxy for /modules route
6. 1447 tests passing, clean build
