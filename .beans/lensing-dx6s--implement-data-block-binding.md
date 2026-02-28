---
# lensing-dx6s
title: Implement data block binding
status: todo
type: task
priority: high
created_at: 2026-02-28T15:46:03Z
updated_at: 2026-02-28T15:46:03Z
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
