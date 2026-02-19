---
# lensing-g30n
title: Integrate SQLite for settings and layout persistence
status: completed
type: task
priority: high
tags:
    - pasiv
    - size:M
    - area:db
created_at: 2026-02-16T21:23:16Z
updated_at: 2026-02-19T17:30:26Z
parent: lensing-995t
---

SQLite database for persisting settings, layout configuration, and plugin state.

## Acceptance Criteria

- [x] SQLite database file with schema migrations
- [x] Tables: settings (key-value), layouts (zone config), plugin_state (per-plugin cache)
- [x] CRUD operations via typed data access layer
- [x] Schema versioning for forward compatibility
- [x] Database file in a configurable location (default: data/lensing.db)

---

**Size:** M

## Summary of Changes

Implemented typed SQLite data access layer with schema migrations, atomic transaction support, and forward-compatibility checks.

**Files created:**
- packages/core/src/database.ts (201 lines) — Factory createDatabase() with WAL mode, v1 schema (settings, layouts, plugin_state tables), CRUD operations
- packages/core/src/__tests__/database.test.ts (222 lines) — 27 tests covering CRUD, schema versioning, security (prototype pollution protection), edge cases

**Files modified:**
- packages/types/src/index.ts — Added DatabaseInstance, DatabaseOptions, SchemaMigration types
- packages/core/src/index.ts — Exported createDatabase
- packages/core/package.json — Added better-sqlite3, @types/better-sqlite3 dependencies

**Key decisions:**
- Used better-sqlite3 for synchronous API (simpler for Raspberry Pi deployment)
- WAL journaling for reliability on Pi SD card writes
- Atomic migrations via PRAGMA user_version + explicit TRANSACTION/ROLLBACK for durability
- Forward-compatibility check: throws if schema version > max known migration (prevent old binary opening newer DB)
- Object.create(null) for getAllSettings/getAllLayouts/getAllPluginStates to prevent prototype pollution attacks
- Settings: key-value TEXT/TEXT pairs
- Layouts: name → JSON array of ZoneConfig (round-trip JSON serialization)
- Plugin state: plugin_id → JSON (generic type-safe storage)

**Verification:**
- 284 tests passing (27 database-specific)
- Build clean
- Security review: Fixed atomicity, forward-compat, prototype pollution
- Merged at e372d15

**Notes for next task:**
- DatabaseInstance exported from @lensing/core
- Can be instantiated with path option or defaults to data/lensing.db
- All CRUD methods are synchronous (better-sqlite3 is not promise-based)
- Close connection via db.close()
- REST API integration still needed (hook up getSettings/putSettings/getLayout/putLayout to database)
- WebSocket persistence callbacks could use database.save() from scene-manager.loadFromPersistence()
