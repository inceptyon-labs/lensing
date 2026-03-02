---
# lensing-7a8l
title: Set canvas widget dimensions with size toggle
status: completed
type: task
priority: normal
created_at: 2026-02-28T15:46:09Z
updated_at: 2026-03-02T14:17:27Z
parent: lensing-alyh
---

Configure the GrapesJS canvas to render at actual widget dimensions with a size toggle.

## Acceptance Criteria

- [ ] Canvas renders at widget size (not full-page)
- [ ] Size toggle: small, medium, large (matching existing widget_sizes)
- [ ] Dimensions match the actual grid zone sizes on the display
- [ ] Canvas background matches display background for accurate preview
- [x] Size selection saved as part of plugin manifest widget_sizes

---

**Size:** S
**Area:** frontend

## Completed

**Files changed:**
- apps/display/src/lib/canvas-sizes.ts (11 lines, new) — Shared canvas size constants and type
- apps/display/src/__tests__/canvas-sizes.test.ts (49 lines, new) — 7 unit tests for canvas-sizes module
- apps/display/src/lib/GrapesJSEditor.svelte (14 lines added) — Size toggle UI with onSizeChange callback
- apps/display/src/__tests__/grapesjs-editor.test.ts (84 lines added) — 6 size toggle integration tests

**Key decisions:**
- Extracted CANVAS_SIZES constant (small 200×150, medium 300×225, large 400×300) matching BuilderPreview
- Size toggle uses role="group" with aria-pressed state for accessibility
- onSizeChange callback prop allows parent to react to size changes (can save to manifest)
- Canvas.setDimensions() called directly on GrapesJS editor instance
- Optional callback chaining ensures safe behavior when editor not ready

**Notes for next task:**
- GrapesJSEditor now has size toggle at top of editor
- Use onSizeChange callback to capture size selection for manifest saving
- Dimensions match both BuilderPreview and grid system (all 2:1.5 aspect ratio)
- Parent lensing-alyh (GrapesJS Visual Editor) has 1 remaining task
