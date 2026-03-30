---
# lensing-8dqc
title: Weather data missing on restart + calendar iCal escapes
status: completed
type: bug
priority: normal
created_at: 2026-03-30T19:36:07Z
updated_at: 2026-03-30T19:38:13Z
---

Two display bugs: (1) Weather widget shows empty on restart — no fallback for initial data load, relies solely on WebSocket timing. (2) Calendar events show raw iCal escape sequences like \\n and \\, instead of unescaped text.

## Summary of Changes

### Fix 1: Weather data missing on restart
- Added `GET /data-bus` REST endpoint that returns all cached data bus messages
- Frontend now fetches this snapshot on page load (`loadDataBusSnapshot()`) alongside the WebSocket connection
- This ensures widget data is available immediately on mount, regardless of WebSocket connection timing
- Files: `rest-server.ts`, `host-service.ts`, `+page.svelte`

### Fix 2: Calendar iCal escape sequences
- Added `unescapeICalText()` function to handle RFC 5545 escape sequences
- Handles `\\n` → newline, `\\,` → comma, `\\;` → semicolon, `\\\\` → backslash
- Applied to all text properties extracted by `getICalProp()` (affects SUMMARY, LOCATION, etc.)
- File: `caldav-client.ts`
