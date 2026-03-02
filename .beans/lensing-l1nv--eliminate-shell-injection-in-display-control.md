---
# lensing-l1nv
title: Eliminate shell injection in display-control
status: todo
type: task
priority: high
created_at: 2026-03-02T16:49:29Z
updated_at: 2026-03-02T16:49:29Z
parent: lensing-umpl
---

**Scan finding:** M-3, M-4

display-control.ts uses `exec()` with string interpolation for the `display` parameter, enabling shell injection. gpio-linux.ts uses `execSync` with shell redirection.

## Acceptance Criteria

- [ ] display-control.ts: Replace `exec()` with `execFile()` or validate `display` against `/^:\d+$/`
- [ ] gpio-linux.ts: Replace `execSync('gpiomon --version 2>&1')` with `execFileSync('gpiomon', ['--version'])`
- [ ] Tests verify rejection of malicious display values
- [ ] No `exec()` calls with string interpolation remain

## Files
- `packages/core/src/display-control.ts:25-39`
- `packages/core/src/gpio-linux.ts:10`

## Size: S
## Area: backend
