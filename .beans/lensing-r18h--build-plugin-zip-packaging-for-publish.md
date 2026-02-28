---
# lensing-r18h
title: Build plugin ZIP packaging for publish
status: todo
type: task
priority: high
created_at: 2026-02-28T15:47:19Z
updated_at: 2026-02-28T15:47:19Z
parent: lensing-lmnp
---

Package a builder-created plugin into a ZIP file suitable for marketplace distribution.

## Acceptance Criteria

- [ ] Creates ZIP containing plugin.json, template.html, template.css, connector.json
- [ ] Auto-generates thumbnail.png from widget preview (screenshot or canvas export)
- [ ] Validates total ZIP size < 10MB
- [ ] Validates no disallowed file types (.exe, .dll, etc.)
- [ ] ZIP structure matches marketplace expectations (flat, no wrapper folder)

---

**Size:** M
**Area:** backend
