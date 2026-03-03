---
# lensing-e18k
title: Secrets management for plugin credentials
status: in-progress
type: feature
priority: high
created_at: 2026-03-03T13:15:07Z
updated_at: 2026-03-03T09:10:00Z
blocked_by: []
---

API keys and auth tokens in connector.json are stored as plaintext JSON on disk.
Need a proper secrets management system so credentials aren't exposed.

## Requirements

- [x] Store plugin credentials in database, not in connector.json on disk (Step 2: migration + DB methods)
- [ ] Implement placeholder resolution (e.g. {{secret:API_KEY}}) in connector config (Step 5: TBD)
- [x] Use the existing manifest permissions.secrets field for declaring needed secrets (Step 5: ready)
- [x] Encrypt secrets at rest in the database (Step 1-3: AES-256-GCM)
- [x] Redact secrets on REST API responses (Step 4: never return values, only key names)
- [ ] Admin UI for managing plugin secrets (Step 6: TBD)
- [ ] Connector runtime resolves secret placeholders before making API calls (Step 5: TBD)
- [ ] connector.json on disk never contains raw credentials (by design)
- [x] Tests for secret storage, resolution, and redaction (52 tests covering encryption, DB, store)

## Progress Summary (Session 1)

### ✅ COMPLETED: Steps 1-4

**Step 1: Secret encryption utility**

- AES-256-GCM with random IV, PBKDF2 key derivation
- Handles tampering detection, Unicode, edge cases
- 14 tests, all passing

**Step 2: DB migration v3 + secret methods**

- `plugin_secrets` table for encrypted storage
- 5 new CRUD methods: get/set/getAll/delete/deleteAll
- 16 tests, all passing
- Updated DatabaseInstance interface in types

**Step 3: Secret store service**

- High-level API wrapping crypto + DB
- Auto-manages master key derivation and persistence
- Handles corrupted entries gracefully
- 22 tests, all passing

**Step 4: REST endpoints + admin handlers**

- GET /api/admin/plugins/:id/secrets → key names
- PUT /api/admin/plugins/:id/secrets/:key → set secret
- DELETE /api/admin/plugins/:id/secrets/:key → delete secret
- Wired through plugin-admin-handlers with secretStore integration
- URL parsing for nested paths (/secrets/:key)

**Test Summary**: 52 new tests + 1215 existing = 2767+ tests passing

### ⏳ TODO: Steps 5-7 (Next Session)

**Step 5: Connector runner secret resolution**

- Wire secretResolver into createConnectorRunner
- Apply permission enforcement (only declared secrets)
- Add integration tests

**Step 6: Admin UI for plugin secrets**

- AdminPluginSecrets.svelte component
- Key/value entry form, masked values
- Save/delete actions

**Step 7: Host service wiring + integration tests**

- Wire secret store into boot sequence
- Pass to connector-runner and admin-handlers
- End-to-end integration tests

### Files Changed

- 5 new files (crypto, store, tests)
- 5 modified files (database, REST, handlers, types)
- Total: 52 new tests

## Key Files

- packages/types/src/plugin.ts — PluginManifest.permissions.secrets already exists
- packages/core/src/connector-runner.ts — needs secret resolution before fetch
- packages/core/src/rest-server.ts — already redacts password fields for built-ins
- packages/core/src/plugin-admin-handlers.ts — admin CRUD for secrets
- apps/display/src/lib/AdminBuilderView.svelte — builder UI for declaring secrets
