---
# lensing-ewp3
title: Night mode dims the monitor backlight
status: completed
type: feature
created_at: 2026-10-07T01:25:51Z
updated_at: 2026-10-07T01:25:51Z
---

DDC/CI now enabled on the ASUS VA249HG, so night mode can dim the real backlight.

- [x] Share isNightTime/parseNightConfig in @lensing/types; add night-mode brightness field (default 10%)
- [x] Host controller: night brightness during the window, restore display.brightness (or 100) after; retry on motion wake, 10 min backoff otherwise

## Summary of Changes

createNightBrightness in core, wired in host-service when ddcutil/backlight brightness is available. Checks every minute; ddcutil fails while the monitor sleeps, so failures retry 3 s after PIR motion and otherwise at most every 10 min.
