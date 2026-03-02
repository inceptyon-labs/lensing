---
# lensing-uvbq
title: Update dependencies with known CVEs
status: completed
type: task
priority: high
created_at: 2026-03-02T16:50:17Z
updated_at: 2026-03-02T23:08:21Z
parent: lensing-umpl
---

**Scan finding:** Dependency audit

Multiple transitive dependencies have known CVEs:

- rollup >=4.0.0 <4.59.0 — arbitrary file write (HIGH)
- minimatch — multiple ReDoS (HIGH)
- svelte <=5.53.4 — multiple SSR XSS (MODERATE)
- @sveltejs/kit — form deserialization DoS (MODERATE)
- esbuild <=0.24.2 — dev server request forwarding (MODERATE)

## Acceptance Criteria

- [x] Update svelte to >=5.54.0 (or latest) — updated to 5.53.6
- [x] Update @sveltejs/kit to latest — updated to 2.53.4
- [x] Update vite/rollup/esbuild to patched versions — vite 6.4.1, rollup override >=4.59.0, esbuild via vite
- [x] Verify minimatch updated transitively — minimatch 10.2.4 (via typescript-eslint), override >=3.1.4 for other paths
- [x] Run pnpm audit — no HIGH severity remaining ✓ (0 HIGH, 3 MODERATE/LOW only)
- [x] All tests still pass after updates — 2279 tests passing ✓

## Size: S

## Area: infra
