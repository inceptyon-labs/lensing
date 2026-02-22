---
# lensing-bj5n
title: Create sports scores server module and widget
status: in-progress
type: task
priority: normal
tags:
    - pasiv
    - size:M
    - area:backend
    - area:frontend
created_at: 2026-02-16T21:24:41Z
updated_at: 2026-02-22T03:18:51Z
parent: lensing-s32t
---

Sports scores plugin: API integration and widget display.

## Acceptance Criteria

- [x] Server module fetches from sports API (ESPN or similar free API)
- [x] Config: leagues, teams, refresh interval
- [x] Publishes sports.scores to data bus
- [x] Widget shows live scores and upcoming schedule
- [x] Throttled polling with stale cache guard

---

**Size:** M

## Summary of Changes

**Files created:**
- packages/types/src/sports.ts (GameStatus, SportsGame, SportsData, LeagueConfig, SportsServerOptions, SportsServerInstance, DEFAULT_SPORTS_MAX_STALE_MS, DEFAULT_SPORTS_LEAGUES)
- packages/types/src/__tests__/sports.test.ts (6 tests)
- packages/core/src/sports-server.ts (ESPN API integration, fetch timeout, malformed event isolation)
- packages/core/src/__tests__/sports-server.test.ts (23 tests)
- packages/core/src/__tests__/sports-integration.test.ts (4 tests)
- packages/core/src/plugins/sports/plugin.json (manifest, allowed_domains: site.api.espn.com)
- packages/ui/src/sports-store.ts (createSportsStore with getByLeague, getLiveGames, getUpcoming, getLeagues)
- packages/ui/src/__tests__/sports-store.test.ts (17 tests)
- apps/display/src/lib/SportsScores.svelte (widget, live indicator, compact mode)
- apps/display/__tests__/sports-scores.test.ts (13 tests)

**Files modified:**
- packages/types/src/index.ts (sports exports)
- packages/core/src/index.ts (sports exports)
- packages/ui/src/index.ts (sports store exports)

**Key decisions:**
- ESPN unofficial API (site.api.espn.com) — free, no auth, Pi 3B friendly
- Sequential league fetching with anySuccess guard — partial success preserved
- FETCH_TIMEOUT_MS = 10_000 via Promise.race to prevent refreshing lock
- mapStatus relies solely on completed flag (not state='post') to avoid false finals
- transformScoreboard wraps each event in try/catch to isolate malformed data
- Defensive copies pattern matching news-store/crypto-store
- notifying re-entrance guard in store

**Notes:**
- Sports data published to 'sports.scores' data bus channel
- PLUGIN_ID = 'sports-server' for data bus attribution
- SportsScores.svelte: live games bubble to top, ember left-border for LIVE indicator
- Scores use font-variant-numeric: tabular-nums for alignment
