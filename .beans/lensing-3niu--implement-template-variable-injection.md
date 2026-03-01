---
# lensing-3niu
title: Implement template variable injection
status: in-progress
type: task
priority: high
created_at: 2026-02-28T15:47:41Z
updated_at: 2026-03-01T23:12:09Z
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
