---
# lensing-1283
title: Add version comparison and update detection
status: completed
type: task
priority: normal
created_at: 2026-02-28T15:46:46Z
updated_at: 2026-03-02T01:22:30Z
parent: lensing-7nct
---

Compare installed plugin versions against marketplace to detect available updates.

## Acceptance Criteria

- [x] Compare installed plugin version against marketplace index version (semver)
- [x] GET /marketplace/updates — list plugins with available updates
- [x] POST /marketplace/:id/update — download and install newer version
- [x] Config preserved during update (only template/connector/manifest replaced)
- [x] Update flow validates new version > installed version

---

**Size:** S
**Area:** backend

## Summary of Changes

Created marketplace version comparison and update detection functionality.

**Features:**

- compareSemver() pure function for semantic version comparison
- checkForUpdates() to detect plugins with available updates in marketplace
- REST endpoints: GET /marketplace/updates and POST /marketplace/:id/update
- MarketplaceUpdateInfo type with pluginId, currentVersion, newVersion, downloadUrl
- 11 unit tests for semver logic, 6 REST endpoint tests
- Proper route handling to distinguish reserved paths (categories, updates) from parameterized routes

**Files:**

- packages/core/src/marketplace-updates.ts (new, 62 lines)
- packages/core/src/**tests**/marketplace-updates.test.ts (new, 133 lines)
- packages/core/src/rest-server.ts (modified, +34 lines)
- packages/core/src/**tests**/rest-server-marketplace.test.ts (modified, +69 lines)
- packages/core/src/index.ts (exports)

**Key Decisions:**

- Pure TypeScript semver comparison without external dependency
- Map-based lookup for O(n+m) performance in update detection
- Optional handlers on RestServerHandlers (graceful 404 if not configured)
- Reserved path guard to prevent route precedence issues

**Commits:**

- eb1bb2b feat: add marketplace update detection and update endpoint
- e77652b style: format and lint
- 7c47ba5 fix: remove unused import from marketplace-updates.test.ts

**Review:** O (Opus) - verified architecture, edge cases, security, test coverage
**Verification:** All 1020 tests pass, build succeeds, no type errors, lint clean
**Status:** Completed and ready for merge
