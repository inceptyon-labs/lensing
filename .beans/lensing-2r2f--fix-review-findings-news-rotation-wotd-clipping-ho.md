---
# lensing-2r2f
title: 'Fix review findings: news rotation, WOTD clipping, host security, poller reliability'
status: completed
type: bug
priority: high
created_at: 2026-10-05T01:34:12Z
updated_at: 2026-10-05T01:34:12Z
---

From 2026-10-04 code review.

## News
- [x] Data bus store: emit per-channel only when that plugin's message changes
- [x] AiNewsWidget: reset page only on new data, restart timer on reset/manual nav, clear on destroy
- [x] PluginRenderer rotateSeconds NaN fallback
- [x] ai-news-server: interleave by feed URL, newest-first, drop stale items
- [x] Replace dead curated feeds (AP via rsshub, Reuters)

## Word of the day
- [x] Parser stops at // example lines
- [x] Widget CSS: never clip the word, clamp definition

## Security
- [x] Admin token on writes (loopback exempt), Origin/Host checks, CORS same-origin
- [x] Plugin id validation everywhere, zip-slip fix
- [x] Photo serving: containment + image-only
- [x] Clear HA/CalDAV secret on URL change; hide internal keys from GET /settings
- [x] WS origin check; ai-assist rate limit
- [x] ShadowWidget sanitize; AdminAiAssist escape LLM output

## Reliability
- [x] Pollers run at configured rate (stale guard)
- [x] CalDAV: expand recurrences, keep last events on failure, local-date labels
- [x] Kiosk WS reconnect + snapshot reload
- [x] PhotoSlideshow timer stable
- [x] HA publish once per change
- [x] Module errors logged; fetch timeouts
- [x] Bundle GridStack instead of CDN

## Summary of Changes

- News: per-channel store emits only on that plugin's messages; AI News keeps its page, full interval after manual nav, timer cleared on destroy; interleave by feed URL, 48h freshness filter, guid/link ids; dead AP/Reuters feeds replaced.
- Word of the day: parser stops at "//" examples; widget safe-centers, shrinks text to fit, ellipsis fallback.
- Security: admin token (LENSING_ADMIN_TOKEN or data/admin-token) for non-loopback admin requests; Host allowlist + Origin checks on REST/WS; same-origin CORS; plugin id validation; zip-slip fix; /photos containment + images only; URL-bound secrets cleared on URL change; GET /settings hides secret_store.*; AI assist rate limit; DOMPurify in ShadowWidget; escaped AI output.
- Reliability: pollers stamp fetch start (no skipped ticks); 15 s fetch timeout; module errors logged; HA publishes once; CalDAV expand + keep events on failure; WS reconnect with snapshot reload; steady slideshow timer; local calendar dates + minute tick; GridStack bundled.
