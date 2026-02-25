---
id: lensing-ct4d
title: Replace zone layout with free-form dashboard grid
status: completed
type: task
priority: high
created_at: 2026-02-25T16:13:59Z
updated_at: 2026-02-25T16:14:54Z
parent: lensing-yoif
blocked_by:
    - lensing-8wha
    - lensing-zi5d
---

Refactor display app: replace 5-zone layout with single free-form GridStack grid. Create DashboardGrid.svelte, migrate plugin rendering to grid items with x/y/w/h, wire GridSpan constraints, add edit mode toggle, remove Layout.svelte + Zone.svelte.
