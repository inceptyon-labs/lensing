---
# lensing-jxlw
title: Add GrapesJS dependency and Svelte wrapper
status: in-progress
type: task
priority: high
created_at: 2026-02-28T15:45:51Z
updated_at: 2026-02-28T16:18:22Z
parent: lensing-alyh
---

Install GrapesJS and create a Svelte wrapper component that mounts the editor on a DOM element.

## Acceptance Criteria

- [x] Add grapesjs package to apps/display dependencies
- [x] Svelte wrapper component mounts GrapesJS in onMount, destroys on unmount
- [x] Editor initializes with empty canvas at widget dimensions
- [x] Exposes getHtml()/getCss()/getProjectData() to parent component
- [x] Loads saved project data (for editing existing plugins)
- [x] Editor container styled to match admin UI design system

---

**Size:** M
**Area:** frontend
