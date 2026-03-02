---
# lensing-aaqp
title: Build stale data indicator and loading placeholder
status: completed
type: task
priority: normal
created_at: 2026-02-28T15:47:44Z
updated_at: 2026-03-02T03:10:07Z
parent: lensing-25mp
---

Visual states for when widget data is loading, stale, or unavailable.

## Acceptance Criteria

- [x] Loading state: subtle shimmer/skeleton matching widget dimensions
- [x] Stale state: small indicator (e.g. dimmed clock icon) when data is older than 2x refresh interval
- [x] Error state: "Waiting for data..." placeholder when no data has ever been received
- [x] States styled to match dark display theme
- [x] Transitions between states are smooth (no jarring flicker)

---

**Size:** S
**Area:** frontend

## Completed

**Files changed:**
- apps/display/src/lib/WidgetStateIndicator.svelte (new, 35 lines)
- apps/display/src/__tests__/widget-state-indicator.test.ts (new, 73 lines)

**Key decisions:**
- Used inline styles (not `<style>` block) for animation, opacity, and transition properties — avoids a Vite 6/5 version mismatch bug that causes `@keyframes` in Svelte `<style>` blocks to fail CSS preprocessing in tests
- Shimmer uses `animation: shimmer 1.5s ease-in-out infinite` inline; `@keyframes shimmer` defined globally (not in component) for test compatibility
- Stale icon is 🕐 emoji at opacity 0.4 — matches spec's "dimmed clock icon" guidance
- Wrapper always has `position: relative; overflow: hidden` via inline style to contain absolute-positioned children correctly
- Ready state renders zero children (empty wrapper) — parent can check `state === 'ready'` before rendering

**Notes for next task:**
- WidgetStateIndicator is a standalone overlay component — parent determines `state` prop based on data freshness
- For stale detection: compare `data.lastUpdated` to `Date.now() - 2 * refreshInterval`
- For loading vs waiting: use `loading` when data fetch is in-flight, `waiting` when no data ever received (first load failed)
- width/height props mirror parent widget dimensions for proper shimmer sizing

**Commits:**
- 7595af2 feat: add WidgetStateIndicator with loading/stale/waiting states
- bef053a style: format and lint
- ea5aca6 fix: add position relative and overflow hidden to widget indicator wrapper
