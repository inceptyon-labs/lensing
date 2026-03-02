---
# lensing-hlqm
title: Implement iframe sandbox for custom JS widgets
status: completed
type: task
priority: low
created_at: 2026-02-28T15:47:49Z
updated_at: 2026-03-02T14:45:28Z
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

## Summary

**Implementation:** iframe-sandbox utility + IframeWidget component

- iframe-sandbox.ts: Detects custom JS, builds sandboxed HTML with bootstrap script
- IframeWidget.svelte: Renders iframe, injects data via postMessage, handles resize messages
- 33 tests: 19 for utility, 14 for component
- OC review: Fixed height bounds, pluginId in bootstrap, SSR guards, validation

**Files created:**

- apps/display/src/lib/iframe-sandbox.ts (74 lines)
- apps/display/src/lib/IframeWidget.svelte (58 lines)
- apps/display/src/**tests**/iframe-sandbox.test.ts (136 lines)
- apps/display/src/**tests**/iframe-widget.test.ts (189 lines)

All tests passing (371/371), build succeeds, verification gate passed.
