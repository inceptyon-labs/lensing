---
# lensing-3niu
title: Implement template variable injection
status: completed
type: task
priority: high
created_at: 2026-02-28T15:47:41Z
updated_at: 2026-03-01T23:18:20Z
parent: lensing-25mp
---

Replace {{placeholder}} variables in template HTML with live data from connector results.

## Acceptance Criteria

- [ ] Parse template HTML for {{slot_name}} placeholders
- [ ] Replace with corresponding values from connector data
- [ ] Support nested paths ({{items[0].title}})
- [ ] Support array iteration for list templates ({{#each items}}...{{/each}})
- [ ] HTML-escape values by default to prevent XSS
- [ ] Re-inject on every connector data update

---

**Size:** S
**Area:** frontend

## Summary

**Implementation completed and merged to main.**

**Files Created:**

- apps/display/src/lib/template-engine.ts (112 lines)
- apps/display/src/**tests**/template-engine.test.ts (242 lines)

**Files Modified:**

- apps/display/src/lib/ShadowWidget.svelte (simplified, now uses renderTemplate)

**Features Implemented:**

1. **Template Parsing & Rendering:** parseTemplate() and renderTemplate() functions with full support for:
   - Simple {{placeholder}} syntax
   - Nested paths: {{user.profile.name}}
   - Array indices: {{items[0]}} and {{items[0].title}}
   - {{#each array}}...{{/each}} block iteration

2. **HTML Escaping:** escapeHtml() prevents XSS by escaping &, <, >, ", '

3. **Context Handling:**
   - Objects passed as-is (properties accessible)
   - Primitives wrapped with 'this' key ({{this}} syntax)
   - Recursive rendering for nested templates

4. **Null/Undefined Safety:**
   - Missing fields → empty string
   - Null data → returns original template
   - Empty arrays → empty string

**Test Coverage:** 37 tests covering all acceptance criteria, edge cases, and security

**Verification:** All 1,745 tests passing, build clean, format fixed
