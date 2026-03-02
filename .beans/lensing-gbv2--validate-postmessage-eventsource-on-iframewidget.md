---
# lensing-gbv2
title: Validate postMessage event.source on IframeWidget
status: todo
type: task
priority: normal
created_at: 2026-03-02T16:49:48Z
updated_at: 2026-03-02T16:49:48Z
parent: lensing-umpl
---

**Scan finding:** MH-3

IframeWidget.svelte listens for postMessage resize events but does not validate that event.source matches the iframe's contentWindow. Any frame or window could spoof resize messages.

## Acceptance Criteria

- [ ] Message listener checks `event.source === iframeEl.contentWindow` before processing
- [ ] Test verifies messages from non-iframe sources are ignored
- [ ] Existing resize tests still pass

## Files
- `apps/display/src/lib/IframeWidget.svelte:26-33`

## Size: XS
## Area: frontend
