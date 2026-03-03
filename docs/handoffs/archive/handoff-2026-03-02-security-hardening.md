# Session Handoff: Security Hardening — CVE Updates Complete

Date: 2026-03-02
Parent: lensing-umpl (Feature: Security Hardening)

## What Was Done

### Completed Tasks This Session

- **lensing-uvbq** — Update dependencies with known CVEs

### Previous Sessions (Completed)

- **lensing-05qz** — Add authentication to REST server and WebSocket
- **lensing-l1nv** — Eliminate shell injection in display-control and gpio-linux
- **lensing-xmpl** — Move API keys from query strings to request headers

### lensing-uvbq Summary

- Updated `typescript-eslint` 8.56.0 → 8.56.1
- Updated `vitest` 2.0.0 → 2.1.0
- Updated `svelte` 5.51.2 → 5.53.6 (fixes 5+ SSR XSS CVEs)
- Updated `@sveltejs/kit` 2.52.0 → 2.53.4 (fixes form DoS)
- Updated `vite` already at 6.4.1 (transitively pulls rollup >=4.59.0)
- Added pnpm overrides: `rollup >=4.59.0`, `minimatch >=3.1.4`
- Result: **0 HIGH severity vulnerabilities** (down from 5)
- All 2279 tests passing

## Files Changed

- package.json — typescript-eslint, vitest versions + pnpm overrides
- apps/display/package.json — svelte, @sveltejs/kit, vite versions
- pnpm-lock.yaml — regenerated
- .beans/lensing-uvbq--\* — acceptance criteria checked off

## Next Steps (ordered)

Remaining security hardening tasks under lensing-umpl:

**Normal Priority:**

1. **lensing-g8js** — Add SRI hashes to CDN assets
2. **lensing-gbv2** — Validate postMessage event.source on IframeWidget
3. **lensing-mtn6** — Validate GitHub owner/repo path segments
4. **lensing-11cs** — Add timeout to CalDAV requests
5. **lensing-u5gq** — Add plugin download domain allowlist

## Files to Load Next Session

- package.json (see pnpm overrides pattern)
- apps/display/package.json (dependency patterns)
- The task being worked on next

## Known Issues

- Pre-existing lint errors in multiple packages (not introduced by lensing-uvbq)
- Turbo.json warnings about test output files (pre-existing)

## Implementation Notes

- Dependency updates require no code changes — purely lockfile updates
- pnpm overrides are cleaner than modifying parent package.json versions when transitive deps lag
- All breaking changes from svelte/kit/vite bump absorbed gracefully (no code changes needed)
- Review tier S was appropriate (dependency-only change, no code)
