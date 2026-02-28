---
# lensing-hlqm
title: Implement iframe sandbox for custom JS widgets
status: todo
type: task
priority: low
created_at: 2026-02-28T15:47:49Z
updated_at: 2026-02-28T15:47:49Z
parent: lensing-25mp
---

Sandboxed iframe renderer for plugins that contain custom JavaScript (future-proofing for v2).

## Acceptance Criteria

- [ ] Detect if plugin contains custom JS (server_entry or <script> in template)
- [ ] Render in iframe with sandbox="allow-scripts" (no allow-same-origin)
- [ ] Inject HTML/CSS/JS into iframe via srcdoc
- [ ] Data passed to iframe via postMessage API
- [ ] iframe sized to match grid zone dimensions
- [ ] Communication protocol: parent sends data, iframe sends height adjustments

---

**Size:** M
**Area:** frontend
