# Session Handoff: Secrets Management for Plugin Credentials

Date: 2026-03-03 09:08
Issue: lensing-e18k - Secrets management for plugin credentials
Branch: feature/lensing-e18k

## What Was Done

### ✅ Step 1: Secret encryption utility (COMPLETED)

- **File**: `packages/core/src/secret-crypto.ts`
- **Tests**: 14 tests, all passing
- AES-256-GCM encryption with random IV per secret
- PBKDF2-based key derivation from seed
- Format: `iv:ciphertext:tag` (base64-encoded)
- Handles Unicode, special chars, long secrets, tampering detection

### ✅ Step 2: Database migration + secret methods (COMPLETED)

- **File**: `packages/core/src/database.ts`
- **Migration**: v3 - Creates `plugin_secrets` table
  - Schema: `(plugin_id, secret_key, encrypted_value, created_at, updated_at)`
- **Methods added to DatabaseInstance**:
  - `getPluginSecret(pluginId, key)` → encrypted string | undefined
  - `setPluginSecret(pluginId, key, encryptedValue)` → upsert
  - `getPluginSecrets(pluginId)` → Record<string, string>
  - `deletePluginSecret(pluginId, key)` → boolean
  - `deleteAllPluginSecrets(pluginId)` → number (count deleted)
- **Tests**: 16 tests covering all CRUD + isolation, all passing
- **Updated**: `packages/types/src/index.ts` - DatabaseInstance interface

### ✅ Step 3: Secret store service (COMPLETED)

- **File**: `packages/core/src/secret-store.ts`
- **Tests**: 22 tests, all passing
- High-level API: `createSecretStore(db) → SecretStore`
- Wraps crypto + DB: encrypts on write, decrypts on read
- Auto-manages master key: derives from seed on first use, persists in DB
- **Methods**:
  - `get(pluginId, key)` → plaintext | undefined
  - `set(pluginId, key, plaintext)` → void
  - `getAll(pluginId)` → Record<string, string> (decrypted)
  - `delete(pluginId, key)` → boolean
  - `deleteAll(pluginId)` → number
- Handles corrupted entries gracefully (skips during getAll, returns undefined for get)

### ✅ Step 4: REST endpoints + admin handlers (COMPLETED)

- **Files modified**:
  - `packages/core/src/rest-server.ts` - Added 3 new routes
  - `packages/core/src/plugin-admin-handlers.ts` - Added 3 secret handlers
- **Routes added**:
  - `GET /api/admin/plugins/:id/secrets` → `{ keys: ["KEY1", "KEY2"] }`
  - `PUT /api/admin/plugins/:id/secrets/:key` → sets secret (value in JSON body)
  - `DELETE /api/admin/plugins/:id/secrets/:key` → deletes secret
- **Handler interface updated**: Added optional handlers
  - `getPluginSecretNames(id) → Promise<string[]>`
  - `setPluginSecret(id, key, value) → Promise<void>`
  - `deletePluginSecret(id, key) → Promise<void>`
- **Admin handler logic**:
  - Takes `secretStore?: SecretStore` option
  - Implements the 3 handlers calling secretStore methods
  - Emits onChange events for audit trail

## Files Changed

- packages/core/src/secret-crypto.ts (NEW)
- packages/core/src/**tests**/secret-crypto.test.ts (NEW)
- packages/core/src/**tests**/database-secrets.test.ts (NEW)
- packages/core/src/**tests**/secret-store.test.ts (NEW)
- packages/core/src/secret-store.ts (NEW)
- packages/core/src/database.ts (migration v3 + 5 new methods)
- packages/core/src/**tests**/database.test.ts (updated v2→v3 assertions)
- packages/core/src/rest-server.ts (3 new routes + URL parsing for subAction)
- packages/core/src/plugin-admin-handlers.ts (secretStore option + 3 handlers)
- packages/types/src/index.ts (DatabaseInstance secret methods)

## Next Steps (ordered)

### Step 5: Connector runner secret resolution

- Wire `secretResolver` from secret store into `createConnectorRunner`
- Currently connector-runner.ts has basic fetch handler that needs secret resolution
- Need to pass secret resolver that calls `secretStore.get(pluginId, secretName)`
- Apply permission enforcement: only secrets in `manifest.permissions.secrets` are resolvable
- **Status**: Ready to implement

### Step 6: Admin UI for plugin secrets

- Create `apps/display/src/lib/AdminPluginSecrets.svelte`
- Show per-plugin declared secrets from manifest
- Key/value entry form, values masked in display
- Save/delete buttons calling REST endpoints
- Integration test in `apps/display/src/__tests__/admin-plugin-secrets.test.ts`

### Step 7: Host service wiring + integration tests

- Wire secret store into host-service.ts boot sequence
- Create after DB, pass to plugin-admin-handlers and connector-runner
- Integration tests covering:
  - Encrypt/decrypt round-trip through full stack
  - Secret isolation between plugins
  - Permission enforcement (plugins only access declared secrets)
  - REST API integration

## Known Issues & Notes

- **Master key**: Stored in settings DB. If DB is lost, all secrets are unrecoverable. This is acceptable for single-device deployment. For enterprise, could add key export/backup.
- **Encryption**: AES-256-GCM with random IV. Auth tag prevents tampering. Random IV ensures same plaintext → different ciphertext.
- **URL parsing**: Added subAction splitting for `/plugins/:id/secrets/:key` routes. Handles both 2-part (secrets) and 3-part (secrets/:key) actions.
- **Test coverage**: 52 new tests added (14 crypto + 16 DB + 22 store). All passing alongside existing 1215 core tests = 2767+ tests.

## Files to Load Next Session

**Critical for Steps 5-7**:

- packages/core/src/connector-runner.ts (add secretResolver)
- packages/core/src/plugin-permissions.ts (understand getAuthorizedSecrets)
- apps/display/src/lib/AdminPluginList.svelte (understand plugin UI structure)
- packages/core/src/host-service.ts (boot sequence wiring)

**Verification**:

- `pnpm test` should show 2767+ tests passing (1215 core + 1552 other)
- Current branch: feature/lensing-e18k

## Review Status

**Not yet reviewed**: Steps 1-4

- Ready for OC review (Opus → Codex) once Steps 5-7 complete
- Security-critical code (encryption, credential storage) will need careful review

## Commits This Session

1. feat: implement secret encryption utility, DB migration, and secret store (#lensing-e18k)
2. feat: add secret CRUD REST endpoints and admin handlers (#lensing-e18k)

---

_Auto-generated by PASIV_
