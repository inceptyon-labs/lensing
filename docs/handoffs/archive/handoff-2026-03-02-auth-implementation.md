# Session Handoff: Bearer Token Authentication Implementation

**Date:** 2026-03-02
**Issue:** lensing-05qz - Add authentication to REST server and WebSocket
**Status:** COMPLETED ✓

## What Was Done

Implemented complete Bearer token authentication system for REST and WebSocket servers (security hardening task from `/repo-scan` findings).

### Completed Tasks

1. **Step 1: Auth middleware module** ✓
   - Created `packages/core/src/auth-middleware.ts`
   - `extractBearerToken()` - parses Authorization header (case-insensitive, whitespace-trimming)
   - `isProtectedRoute()` - determines which endpoints require auth
   - Public routes: `/health`, read-only marketplace (`GET /marketplace*`), template reads, OPTIONS
   - 27 comprehensive tests covering all edge cases

2. **Step 2: REST server auth + bind address** ✓
   - Updated `packages/core/src/rest-server.ts`
   - Added `authToken?: string` and `bindAddress?: string` options to `RestServerOptions`
   - Auth check inserted after CORS headers but before route dispatch
   - Changed default bind from '0.0.0.0' to '127.0.0.1' (security improvement)
   - CORS headers include Authorization for cross-origin auth
   - 12 integration tests including OPTIONS bypass verification

3. **Step 3: WebSocket upgrade auth** ✓
   - Updated `packages/core/src/ws-server.ts`
   - Added `authToken?: string` option to `WsServerOptions`
   - Implemented `verifyClient` callback with Bearer token validation
   - Handles array-form Authorization headers (edge case)
   - 4 comprehensive tests for with/without auth, wrong token, no token

4. **HostService & CLI integration** ✓
   - Updated `packages/types/src/index.ts` - added auth options to `HostServiceOptions`
   - Updated `packages/core/src/host-service.ts` - wires auth through to REST/WS factories
   - Updated `packages/cli/src/commands/start.ts` - passes auth through CLI
   - This ensures auth is actually deployable in production (was dead code without this)

### Review & Testing

- **SOC Review** (Sonnet → Opus → Codex):
  - Sonnet: Fixed Authorization header array validation
  - Opus: Added OPTIONS test on protected routes, verified architecture
  - Codex: Identified ERROR (auth not wired to HostService) - FIXED
  - Codex: Noted pre-existing path traversal vulnerability (separate issue)

- **Code Quality**:
  - All 2066 tests passing across all packages
  - Tests verify opt-in auth (backward compatible)
  - Comprehensive edge case coverage
  - Clean error responses with proper logging

### Files Changed

**Created:**
- `packages/core/src/auth-middleware.ts` - Core auth logic (38 lines)
- `packages/core/src/__tests__/auth-middleware.test.ts` - 27 tests
- `packages/core/src/__tests__/rest-server-auth.test.ts` - 12 tests
- `packages/core/src/__tests__/ws-server-auth.test.ts` - 4 tests

**Modified:**
- `packages/core/src/rest-server.ts` - Auth check + bind address
- `packages/core/src/ws-server.ts` - verifyClient callback
- `packages/core/src/host-service.ts` - Wire auth through
- `packages/types/src/index.ts` - Options interfaces
- `packages/cli/src/commands/start.ts` - CLI support

### Key Decisions

1. **Opt-in auth**: When `authToken` not provided, auth is disabled (backward compatible)
2. **Bearer token standard**: Uses HTTP 401 response for unauthorized access
3. **Default bind address**: Changed to 127.0.0.1 to reduce attack surface (fixes MH-1 from security scan)
4. **Public routes**: Marketplace read-only and template endpoints are intentionally public
5. **OPTIONS always public**: CORS preflight never requires auth

### Next Steps (Remaining Security Tasks)

All tracked in parent epic `lensing-umpl` (Feature: Security Hardening):

**High Priority (next):**
- **lensing-l1nv** - Eliminate shell injection in display-control.ts (MEDIUM finding M-3)
- **lensing-xmpl** - Move API keys from query strings to headers (MEDIUM-HIGH finding MH-2)
- **lensing-uvbq** - Update dependencies with known CVEs (4 HIGH transitive CVEs)

**Normal Priority:**
- lensing-g8js - Add SRI hashes to CDN assets (MEDIUM finding M-1)
- lensing-gbv2 - Validate postMessage event.source on IframeWidget (MEDIUM-HIGH finding MH-3)
- lensing-mtn6 - Validate GitHub owner/repo path segments (MEDIUM-HIGH finding MH-4)
- lensing-11cs - Add timeout to CalDAV requests (MEDIUM finding M-2)
- lensing-u5gq - Add plugin download domain allowlist (MEDIUM finding M-6, blocked by lensing-05qz)

**Known Issues (separate work):**
- Path traversal vulnerability in `/plugins/:id/template` via URL-encoded slashes (pre-existing, not in scope)

## Files to Load Next Session

- `.beans/lensing-l1nv--*.md` (next task)
- `packages/core/src/display-control.ts` (shell injection fix)
- `packages/core/src/rest-server.ts` (context - auth already implemented)
- `docs/scans/2026-03-02-lensing.md` (security findings reference)

## What NOT to Re-Read

- Auth middleware logic (complete + tested)
- REST/WS server auth integration (complete + merged)
- HostService integration (complete)
- Test files for auth (all passing, comprehensive)

## Architecture Notes

**Auth Flow:**
```
REST Request → CORS headers → OPTIONS bypass? → Auth check (if authToken set) → Route handler
WS Upgrade Request → verifyClient callback → Check Bearer token → Allow/reject
```

**Public Routes (no auth required):**
- GET /health
- GET /marketplace, /marketplace/categories, /marketplace/updates
- GET /marketplace/:id (plugin details)
- GET /plugins/:id/template (widget template)
- OPTIONS * (CORS preflight)

**Error Response Format:**
```json
{ "error": "Unauthorized" }  // HTTP 401
```

All protected routes (settings, layout, plugins admin, modules, display, ask) return 401 if:
- authToken is configured AND
- No valid Bearer token provided

---

**Branch:** Merged to main
**Commits:** 7 total (auth-middleware → REST server → WS server → HostService → fixes → formatting)
**Tests:** 1102 core tests passing + 964 other packages = 2066 total ✓
