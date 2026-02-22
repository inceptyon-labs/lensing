---
# lensing-qtuo
title: Create photo slideshow with Ken Burns effect
status: completed
type: task
priority: normal
tags:
  - pasiv
  - size:M
  - area:frontend
created_at: 2026-02-16T21:24:59Z
updated_at: 2026-02-22T01:43:38Z
parent: lensing-c2mw
---

Photo ambient plugin: slideshow with low-CPU Ken Burns CSS effect.

## Acceptance Criteria

- [x] Cycle through photos from a configurable local directory
- [x] Ken Burns effect: subtle pan/zoom via CSS transforms only (no JS animation)
- [x] Configurable cycle interval and transition style (crossfade)
- [x] Primary content for ambient/sleep scene
- [x] Plugin.json manifest with correct widget_sizes

---

**Size:** M

## Completed

**Files changed:**

- packages/types/src/photo-slideshow.ts (types, constants)
- packages/core/src/plugins/photo-slideshow/index.ts (discovery, cycling)
- packages/core/src/plugins/photo-slideshow/ken-burns.css (GPU-optimized animation)
- apps/display/src/lib/PhotoSlideshow.svelte (component)

**Key decisions:**

- CSS-only Ken Burns animation (GPU-accelerated for Pi 3B)
- Factory pattern with interfaces (PhotoSlideshow, KenBurnsConfig)
- Constants exported from @lensing/types, re-exported from @lensing/core

**Notes for next task:**

- All 938 tests passing, build clean
- Ready for parent feature lensing-c2mw
