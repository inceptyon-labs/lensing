---
# lensing-8ic3
title: Build AllergiesWidget.svelte
status: todo
type: task
priority: low
created_at: 2026-02-24T18:00:40Z
updated_at: 2026-02-24T18:01:08Z
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
interface AllergenLevel { name: string; level: 0|1|2|3|4|5; category: 'pollen'|'mold'|'dust'|'other'; }
interface AllergyData { index: number; allergens: AllergenLevel[]; lastUpdated: number; }
```

Channel: allergies.current

## Blocked By
- lensing-zl2i (PluginRenderer data wiring)

## Key Files
- apps/display/src/lib/AllergiesWidget.svelte (NEW)
- apps/display/src/lib/PluginRenderer.svelte (add branch)
