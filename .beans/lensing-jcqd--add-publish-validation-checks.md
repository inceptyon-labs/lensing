---
# lensing-jcqd
title: Add publish validation checks
status: completed
type: task
priority: normal
created_at: 2026-02-28T15:47:31Z
updated_at: 2026-03-02T01:02:59Z
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

## Summary of Changes

Created validatePublish() pure function that validates plugins before marketplace publishing.

**Features:**

- 7 validation checks: ID uniqueness, required fields, connector tested, template HTML, placeholder resolution, package size < 8MB, error collection
- Comprehensive error structure with field, code, and message
- Supports dot-notation paths in templates: {{user.name}}, {{items[0].title}}
- 17 tests covering all paths and edge cases
- TypeScript interfaces for input and result types
- Exported from @lensing/core for REST endpoint use

**Files:**

- packages/core/src/publish-validation.ts (129 lines)
- packages/core/src/**tests**/publish-validation.test.ts (231 lines)
- packages/core/src/index.ts (exports)

**Commits:**

- 07b485e feat: add validatePublish function with full validation suite
- 7a2702d style: format and lint
- 21813c6 fix: clarify size limit error message to match implementation

**Review:** O (Opus) - verified architecture, edge cases, security, test coverage
**Verification:** All 1003 tests pass, build succeeds, no type errors
**Status:** Merged to main
