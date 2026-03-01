---
# lensing-dx6s
title: Implement data block binding
status: completed
type: task
priority: high
created_at: 2026-02-28T15:46:03Z
updated_at: 2026-03-01T02:33:35Z
parent: lensing-alyh
---

Add data-bound blocks to GrapesJS that display {{placeholder}} values from connector field mappings.

## Acceptance Criteria

- [ ] "Data Text" block type that renders {{slot_name}} placeholder
- [ ] "Data Image" block type with src bound to {{slot_name}}
- [ ] "Data List" block type that iterates over array data
- [ ] Data blocks appear in block palette alongside regular blocks
- [ ] Available slot names populated from connector field mapping (passed from wizard step 2)
- [ ] Placeholders render visually distinct in editor (e.g. highlighted background)
- [ ] Unmapped placeholders flagged with warning indicator

---

**Size:** M
**Area:** frontend

## Completion Summary

**Implemented:**
- registerDataBlocks() function that creates data-bound blocks for each connector slot
- Text slots → data-text-{id} blocks with {{slot_id}} template placeholders
- Image slots → data-image-{id} blocks with {{slot_id}} in src attribute
- Generic data-list block for array data with {{item}} iteration placeholder
- Visual distinction with background: rgba(99,179,237,0.15) highlight
- data-slot="{id}" attributes for template binding
- GrapesJSEditor.svelte now accepts slots prop and registers data blocks

**Tests:**
- 13 new tests for registerDataBlocks (all passing)
- Updated 2 integration tests for slot count
- All 173 display tests passing

**Code Quality:**
- Clean TDD implementation (RED → GREEN → REFACTOR → COMMIT)
- No lint/type errors in new code
- Build passes, verification gate ✓

**Merged:** 49ea2aa to main
