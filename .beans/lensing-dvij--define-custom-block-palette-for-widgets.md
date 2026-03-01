---
# lensing-dvij
title: Define custom block palette for widgets
status: completed
type: task
priority: high
created_at: 2026-02-28T15:45:54Z
updated_at: 2026-03-01T02:22:42Z
parent: lensing-alyh
---

Configure GrapesJS with a constrained set of blocks appropriate for display widgets.

## Acceptance Criteria

- [x] Remove all default GrapesJS blocks
- [x] Add custom blocks: Text, Heading, Image, Number/Value, List, Divider, Icon
- [x] Each block has a descriptive label and icon in the sidebar
- [x] Blocks produce clean, semantic HTML
- [x] Blocks are styled with sensible defaults for dark display theme

---

**Size:** S
**Area:** frontend

## Completed

**Files changed:**

- apps/display/src/lib/grapes-blocks.ts (new, 80 lines) — registerWidgetBlocks() with 7 block definitions
- apps/display/src/**tests**/grapes-blocks.test.ts (new, 177 lines) — 14 unit tests
- apps/display/src/lib/GrapesJSEditor.svelte (2 lines) — import + call registerWidgetBlocks()
- apps/display/src/**tests**/grapesjs-editor.test.ts (23 lines) — 2 integration tests

**Key decisions:**

- Block IDs use widget-\* prefix to avoid collision with GrapesJS built-ins
- All blocks categorized under 'Widget' for grouped sidebar display
- FontAwesome classes on attributes.class for sidebar icons (fa fa-\*)
- Inline CSS with CSS variable + fallback value pattern (var(--starlight, #e2e4ed))
- registerWidgetBlocks() called after grapesjs.init() but before event subscription

**Notes for next task:**

- All 7 blocks available in editor: widget-text, widget-heading, widget-image, widget-value, widget-list, widget-divider, widget-icon
- Blocks produce semantic HTML that template rendering and data binding can target
- Next: lensing-dx6s (data block binding) can reference block HTML structure
- Block content uses var(--starlight) for text color and var(--dim-light) for icons

Merged: c9d2bfd
