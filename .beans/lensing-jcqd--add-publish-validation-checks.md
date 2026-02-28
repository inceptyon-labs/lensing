---
# lensing-jcqd
title: Add publish validation checks
status: todo
type: task
priority: normal
created_at: 2026-02-28T15:47:31Z
updated_at: 2026-02-28T15:47:31Z
parent: lensing-lmnp
---

Validate plugin before allowing marketplace publish.

## Acceptance Criteria

- [ ] Check plugin ID uniqueness against marketplace index
- [ ] Validate all required manifest fields present
- [ ] Validate connector config is complete and tested
- [ ] Validate template HTML is non-empty
- [ ] Validate total package size < 10MB
- [ ] Validate no {{missing_field}} placeholders in template
- [ ] Return clear validation errors to UI

---

**Size:** S
**Area:** backend
