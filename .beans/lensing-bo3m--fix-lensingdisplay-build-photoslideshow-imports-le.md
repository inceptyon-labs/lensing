---
# lensing-bo3m
title: 'Fix @lensing/display build: PhotoSlideshow imports @lensing/core'
status: completed
type: bug
priority: high
created_at: 2026-02-24T15:00:18Z
updated_at: 2026-02-24T15:01:23Z
---

## Problem

PhotoSlideshow.svelte imports `getNextPhotoIndex` from `@lensing/core`, which is a Node.js package (better-sqlite3, etc.). This causes Vite/Rollup SSR build to fail:

```
[vite]: Rollup failed to resolve import "@lensing/core" from "PhotoSlideshow.svelte"
```

## Fix

Inline the trivial function (2 lines) in PhotoSlideshow.svelte instead of importing the heavy Node.js package.

## Acceptance Criteria

- [x] Remove `@lensing/core` import from PhotoSlideshow.svelte
- [x] Inline `getNextPhotoIndex` function
- [x] `pnpm build` succeeds for @lensing/display
- [x] All tests pass

## Summary of Changes

Inlined the trivial `getNextPhotoIndex` function (2 lines) directly in `PhotoSlideshow.svelte` instead of importing it from `@lensing/core`. The core package has Node.js-only dependencies (better-sqlite3) that Vite/Rollup cannot resolve during SSR build.

Commit: 80e1a75
