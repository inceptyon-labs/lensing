---
# lensing-lqjc
title: Create widget layout templates
status: in-progress
type: task
priority: normal
created_at: 2026-02-28T15:45:58Z
updated_at: 2026-03-02T13:21:52Z
parent: lensing-alyh
---

Pre-built layout templates users can start from instead of a blank canvas.

## Acceptance Criteria

- [x] "Single Value" template: large centered number/text with label and icon
- [x] "List" template: vertical list of items with title + subtitle
- [x] "Key-Value Grid" template: 2-column grid of label-value pairs
- [x] "Image + Caption" template: hero image with text overlay
- [x] "Card" template: icon, title, value, subtitle in compact card layout
- [x] Templates selectable from a template picker before entering editor
- [x] Each template uses data binding placeholders

---

**Size:** M
**Area:** frontend

## Completed

**Files changed:**
- apps/display/src/lib/grapes-templates.ts (new, 214 lines) — WidgetTemplate type + 5 template definitions
- apps/display/src/lib/WidgetTemplatePicker.svelte (new, 19 lines) — grid picker with blank option
- apps/display/src/__tests__/grapes-templates.test.ts (new, 128 lines) — 18 unit tests
- apps/display/src/__tests__/widget-template-picker.test.ts (new, 49 lines) — 6 component tests

**Key decisions:**
- Templates are HTML+CSS string pairs, not GrapesJS projectData — simpler to author and preview
- Each template uses data-slot attributes consistent with lensing-dx6s data binding
- CSS classes use per-template prefixes (sv-, list-, kv-, ic-, card-) to avoid collisions
- All templates use var(--token, fallback) pattern for dark theme tokens
- Blank Canvas option returns null to onSelect — parent decides what initialProject to use
- WidgetTemplatePicker imports WIDGET_TEMPLATES directly — no need to pass as prop

**Notes for next task:**
- Templates can be loaded into GrapesJS via editor.setComponents(html) + editor.setStyle(css)
- WidgetTemplatePicker.onSelect returns WidgetTemplate | null
- Template HTML uses data-slot attributes that align with registerDataBlocks() slot convention
- Integration into builder wizard Step 3 is a separate task
