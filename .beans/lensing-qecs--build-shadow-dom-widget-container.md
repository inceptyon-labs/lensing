---
# lensing-qecs
title: Build Shadow DOM widget container
status: in-progress
type: task
priority: high
created_at: 2026-02-28T15:47:37Z
updated_at: 2026-03-01T00:57:38Z
parent: lensing-25mp
---

Svelte component that renders builder-created plugin HTML/CSS inside a Shadow DOM for style isolation.

## Acceptance Criteria

- [ ] Creates Shadow DOM root for each builder-created widget
- [ ] Injects template.css as <style> inside shadow root
- [ ] Injects template.html as content inside shadow root
- [ ] Shadow DOM prevents CSS leakage to/from host page
- [ ] Container sized to match assigned grid zone dimensions
- [ ] Re-renders when new data arrives from connector via data bus

---

**Size:** M
**Area:** frontend
