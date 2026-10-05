---
# lensing-2zj4
title: GrapesJS canvas size buttons do nothing
status: completed
type: bug
created_at: 2026-10-05T02:42:50Z
updated_at: 2026-10-05T02:42:50Z
---

GrapesJSEditor called editor.Canvas.setDimensions, which doesn't exist in grapesjs 0.21, so small/medium/large never resized the canvas. The test mocked the nonexistent API.

- [x] Register one device per canvas size (widthMedia '' so styles don't get media queries) and switch with editor.setDevice
- [x] Test the device config and setDevice calls

## Summary of Changes

GrapesJSEditor registers small/medium/large as devices via deviceManager (default medium) and calls setDevice on size change. Verified in real grapesjs 0.21.13 (headless Chrome): frame is 300x225, 200x150, 400x300 per size and exported CSS has no @media wrapper.
