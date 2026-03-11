---
# lensing-jvvr
title: Add team filtering to sports scores widget
status: completed
type: feature
priority: normal
created_at: 2026-03-06T02:47:00Z
updated_at: 2026-03-06T02:49:42Z
---

Allow users to filter sports scores by specific teams and leagues. E.g., Florida Gators basketball, Bucs in NFL. Add a 'teams' config field (comma-separated team names) and filter games server-side using case-insensitive substring matching against ESPN team names.

## Tasks

- [x] Add teams field to sports module settings schema
- [x] Add teams option to SportsServerOptions type
- [x] Filter games by team names in sports-server after fetch
- [x] Wire teams config through module-boot
- [x] Update sports store with getByTeam helper
- [x] Add tests for team filtering
- [x] Update setup guide text

## Summary of Changes

Added team filtering to the sports scores widget. Users can now enter comma-separated team names (e.g. "Buccaneers, Gators, Lakers") in the Favorite Teams config field. Matching is case-insensitive and substring-based, so "Gators" matches "Florida Gators".

### Files Changed

- `packages/types/src/sports.ts` — Added `teams?: string[]` to `SportsServerOptions`
- `packages/types/src/module-settings.ts` — Added `teams` config field to sports schema, updated setup guide
- `packages/core/src/sports-server.ts` — Added `matchesTeamFilter()` and applied after fetch
- `packages/core/src/module-boot.ts` — Wired teams config through to `createSportsServer`
- `packages/ui/src/sports-store.ts` — Added `getByTeam()` helper method
- `packages/core/src/__tests__/sports-server.test.ts` — 7 new tests for team filtering
- `packages/ui/src/__tests__/sports-store.test.ts` — 3 new tests for getByTeam
