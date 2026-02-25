---
# lensing-8wha
title: Vendor GridStack.js and build Svelte adapter
status: completed
type: task
priority: high
created_at: 2026-02-25T16:02:28Z
updated_at: 2026-02-25T16:13:51Z
parent: lensing-yoif
---

Vendor GridStack.js into `apps/display/` and build a Svelte adapter component.

## Checklist

- [x] Install `gridstack` v10.3.x as a dependency in `apps/display/package.json`
- [x] Create `apps/display/src/lib/grid/types.ts` with `GridPolicy` and `GridWidget` interfaces
- [x] Create `apps/display/src/lib/grid/GridStackAdapter.svelte` using Svelte 5 runes
- [x] Adapter is the ONLY file that imports from `gridstack`
- [x] Adapter accepts `items`, `editMode`, `options` props
- [x] Adapter exposes `onchange`, `onadd`, `onremove` callbacks
- [x] Edit mode toggle calls `enableMove()` / `enableResize()`
- [x] Children rendered via Svelte 5 `{@render}` / `Snippet` pattern
- [x] GridStack event listeners wired: `change`, `added`, `removed`
- [x] Cleanup: `destroy()` called on component teardown
- [x] Tests written at `apps/display/__tests__/grid-adapter.test.ts` (37 tests)
- [x] All tests pass (`pnpm --filter @lensing/display test`)
- [x] Build succeeds (`pnpm --filter @lensing/display build`)
- [x] Design system tokens used in adapter styling

## Summary of Changes

### Files Created

- `apps/display/src/lib/grid/types.ts` — GridPolicy and GridWidget interfaces, plus pure helper functions (`resolveEditMode`, `toGridWidget`, `toGridStackOptions`, type-check identity functions)
- `apps/display/src/lib/grid/GridStackAdapter.svelte` — Svelte 5 runes-based adapter component that initializes GridStack on a DOM container, syncs reactive state with GridStack callbacks, and manages edit mode toggling
- `apps/display/__tests__/grid-adapter.test.ts` — 37 vitest tests covering type structure, type construction, edit mode logic, conversion helpers, and Svelte component source verification

### Files Modified

- `apps/display/package.json` — Added `gridstack: ^10.3.0` as a dependency

### Key Decisions

1. **npm package, not vendored source**: Installed `gridstack@^10.3.0` from npm (resolved to 10.3.1). jQuery-free v10.x.
2. **Svelte 5 runes only**: Used `$props()`, `$state()`, `$effect()` pattern matching existing rune-based components. No legacy `export let` or `$:` syntax.
3. **Single import boundary**: Only `GridStackAdapter.svelte` imports from `gridstack`. All other code uses our own `GridWidget` and `GridPolicy` types.
4. **Pure helper functions**: Extracted `resolveEditMode()`, `toGridWidget()`, `toGridStackOptions()` as testable pure functions in `types.ts`.
5. **Design system integration**: Adapter styling uses Lensing design tokens.
6. **Snippet pattern for children**: Uses Svelte 5 `Snippet` type and `{@render children()}` for parent-controlled widget content rendering.
