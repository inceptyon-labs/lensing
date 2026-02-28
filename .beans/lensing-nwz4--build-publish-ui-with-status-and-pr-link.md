---
# lensing-nwz4
title: Build publish UI with status and PR link
status: todo
type: task
priority: normal
created_at: 2026-02-28T15:47:28Z
updated_at: 2026-02-28T15:47:28Z
parent: lensing-lmnp
---

UI for the publish flow: button, progress, status display, and PR link.

## Acceptance Criteria
- [ ] "Publish to Marketplace" button on builder-created plugins
- [ ] Pre-publish validation check (all fields filled, connector tested)
- [ ] Progress states: "Packaging...", "Uploading...", "Creating PR..."
- [ ] Success state: "Published — awaiting review" with clickable PR link
- [ ] Error state with retry button
- [ ] Disabled state if no GitHub token configured (with link to Settings)

---
**Size:** S
**Area:** frontend
