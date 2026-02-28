---
# lensing-01jd
title: Add auto-save to localStorage for crash recovery
status: todo
type: task
priority: low
created_at: 2026-02-28T15:46:28Z
updated_at: 2026-02-28T15:46:28Z
parent: lensing-rq0o
---

Persist builder wizard state and GrapesJS editor state to localStorage for crash recovery.

## Acceptance Criteria
- [ ] Auto-save wizard state (metadata, connector config, field mapping) on change
- [ ] Auto-save GrapesJS project data periodically (every 30s) and on step change
- [ ] On builder open, detect saved state and offer "Resume editing?" prompt
- [ ] Clear saved state after successful save/publish
- [ ] Scoped to plugin ID to support multiple in-progress builds

---
**Size:** S
**Area:** frontend
