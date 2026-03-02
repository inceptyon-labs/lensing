---
# lensing-pz1u
title: Configure GrapesJS style manager
status: in-progress
type: task
priority: normal
created_at: 2026-02-28T15:46:06Z
updated_at: 2026-03-02T03:54:10Z
parent: lensing-alyh
---

Set up the GrapesJS style manager with controls appropriate for widget customization.

## Acceptance Criteria

- [x] Color pickers for text color, background color
- [x] Font family selector (constrained to display-friendly fonts)
- [x] Font size, weight, alignment controls
- [x] Padding and margin controls
- [x] Border radius control
- [x] Opacity control
- [x] Default styles match the lensing dark display theme

---

**Size:** S
**Area:** frontend

## Completed

**Files changed:**
- apps/display/src/lib/grapes-style-manager.ts (new) — configureStyleManager() with 3 sectors and 11 style properties
- apps/display/src/__tests__/grapes-style-manager.test.ts (new) — 30 unit tests
- apps/display/src/lib/GrapesJSEditor.svelte (1 import + 1 call) — integrates style manager
- apps/display/src/__tests__/grapesjs-editor.test.ts (StyleManager mock + 1 integration test)

**Key decisions:**
- addSector/addProperty pattern matches GrapesJS StyleManager API
- 3 sectors: general (colors), typography (fonts), spacing (layout + opacity + border-radius)
- Color defaults use CSS variable + HSL fallback pattern: var(--starlight, hsl(...))
- Font family constrained to Inter and JetBrains Mono — both defined in design system
- Font size is slider (12–48px, 2px step) — more flexible than token-locked select
- Opacity and border-radius placed in spacing sector for simplicity
- All design system font weights (400, 500, 600, 700) available as named options

**Notes for next task:**
- configureStyleManager() is called after registerDataBlocks() in GrapesJSEditor.svelte
- addProperty(sectorId, config) uses GrapesJS v4 StyleManager API
- Units ['px'] array on sliders enables unit-switching dropdown in GrapesJS UI
- Style manager properties connect to the styleManager: { appendTo: '#styles' } panel in editor config
