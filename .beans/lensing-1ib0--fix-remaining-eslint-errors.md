---
# lensing-1ib0
title: Fix remaining ESLint errors
status: completed
type: task
created_at: 2026-10-05T02:34:50Z
updated_at: 2026-10-05T02:34:50Z
---

240 errors in source after the ignore fix.

- [x] Core source and small packages
- [x] Core tests
- [x] Display app (incl. AdminConfigForm parse error)

## Summary of Changes

Typed the AI provider responses, test mocks and GrapesJS editor instead of any; removed unused imports/vars and dead code; fixed the AdminConfigForm each-block parse error; added each keys; removed stale svelte-ignore comments. Disable comments only for verified false positives ({@html} with escaped output, local Map/Set helpers, external link, guarded reactive block). ESLint 0 problems; svelte-check 48 -> 46; all 2431 tests pass.
