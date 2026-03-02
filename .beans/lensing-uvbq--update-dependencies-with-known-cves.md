---
# lensing-uvbq
title: Update dependencies with known CVEs
status: todo
type: task
priority: high
created_at: 2026-03-02T16:50:17Z
updated_at: 2026-03-02T16:50:17Z
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

- [ ] Update svelte to >=5.54.0 (or latest)
- [ ] Update @sveltejs/kit to latest
- [ ] Update vite/rollup/esbuild to patched versions
- [ ] Verify minimatch updated transitively
- [ ] Run pnpm audit — no HIGH severity remaining
- [ ] All tests still pass after updates

## Size: S

## Area: infra
