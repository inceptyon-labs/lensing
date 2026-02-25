---
# lensing-8ic3
title: Build AllergiesWidget.svelte
status: completed
type: task
priority: low
created_at: 2026-02-24T18:00:40Z
updated_at: 2026-02-25T02:10:02Z
parent: lensing-wbum
blocked_by:
    - lensing-zl2i
---

No allergies display widget exists. PluginRenderer has no 'allergies' branch — it falls through to Placeholder.

## What to Build

- apps/display/src/lib/AllergiesWidget.svelte
- Props: AllergyData
- Show overall allergy index (0-5 scale) with color gradient
- List individual allergens with their levels and categories
- Visual indicator (bar/gauge) for overall index
- Use lensing design system tokens

## Data Shape (from @lensing/types)

```ts
interface AllergenLevel {
  name: string;
  level: 0 | 1 | 2 | 3 | 4 | 5;
  category: 'pollen' | 'mold' | 'dust' | 'other';
}
interface AllergyData {
  index: number;
  allergens: AllergenLevel[];
  lastUpdated: number;
}
```

Channel: allergies.current

## Blocked By

- lensing-zl2i (PluginRenderer data wiring)

## Key Files

- apps/display/src/lib/AllergiesWidget.svelte (NEW)
- apps/display/src/lib/PluginRenderer.svelte (add branch)

## Summary of Changes

**Files Changed:**
- apps/display/src/lib/AllergiesWidget.svelte (NEW - 179 lines)
- apps/display/src/lib/PluginRenderer.svelte (MODIFIED - added allergies channel subscription and rendering)
- apps/display/__tests__/allergies-widget.test.ts (NEW - 11 tests)
- apps/display/__tests__/plugin-renderer.test.ts (MODIFIED - added 4 integration tests)

**Key Technical Decisions:**
- Data binding: Subscribe to 'allergies-server' channel via dataBusStore
- Design tokens: All colors/spacing use --event-horizon, --alert-success/warning/urgent
- Severity levels: 0-1 (success) → 2 (warning) → 3-5 (urgent)
- Component props: index (number), allergens (AllergenLevel[] array)
- Fallback handling: Null coalescing with ?? for safe data access

**Implementation Details:**
- Hero index display (0-5 scale) with /5 label
- Dynamic gauge bar: width = (index/5)*100%, color-coded by severity
- 3-column allergen list: name | category | level
- Empty state handling when allergens array is empty
- BEM-like CSS class naming with design system tokens and fallbacks
- Svelte reactive declarations for computed properties (gaugeWidth, currentGaugeColor, label)

**Testing:**
- 11 new widget tests covering props, display, design tokens, color-coding
- 4 new PluginRenderer integration tests for channel subscription and rendering
- All 285 display tests passing (plus 722 core tests = 1007 total)
- S (Sonnet) review tier: clean code, no security issues

**Verification Gate Results:**
✓ Tests: 285/285 passed
✓ Build: succeeded (1.88s)
✓ Lint: new code clean
✓ TypeCheck: no errors

Merged to main: d4bc6b9
