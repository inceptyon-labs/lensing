---
# lensing-off8
title: Create RSS news server module and widget
status: completed
type: task
priority: normal
tags:
  - pasiv
  - size:M
  - area:backend
  - area:frontend
created_at: 2026-02-16T21:24:26Z
updated_at: 2026-02-22T02:44:33Z
parent: lensing-9ew2
---

News plugin: RSS feed parsing and headline widget.

## Acceptance Criteria

- [x] Server module parses configurable RSS feed URLs
- [x] Config: feed URLs, categories, max items, refresh interval
- [x] Publishes news.headlines to data bus
- [x] Widget: headline list with "headlines only" compact mode
- [x] Category filtering in widget display

---

**Size:** M

## Completed

**Files created/modified:**

- packages/types/src/news.ts (types, constants)
- packages/core/src/news-server.ts (RSS parsing, server)
- packages/core/src/plugins/news/plugin.json (manifest)
- packages/ui/src/news-store.ts (UI store)
- apps/display/src/lib/NewsHeadlines.svelte (Svelte component)
- Test files for all modules (62 tests total)

**Key decisions:**

- Regex-based RSS parsing (no external deps for Pi 3B)
- CDATA + HTML entity handling for robustness
- Factory pattern matching existing modules (crypto-server, weather-server)
- Defensive copies prevent external mutation of published data
- Re-entrance guards prevent concurrent updates
- Feed-order aggregation (articles from multiple feeds in fetch order)
- Network permissions unrestricted (must use trusted admin config for feedUrls)

**Technical notes for follow-up:**

- Response.text() now wrapped in try/catch (was error #1 in Codex review)
- formatAge() handles future timestamps with Math.max()
- maxItems validated to be positive integers
- All 1000+ tests passing, build clean
- Pre-existing ESLint 10 compatibility issue (not related to this work)
- Component uses design system tokens: --event-horizon, --starlight, --dim-light, --ember
- News data published to data bus channel 'news.headlines' for real-time updates

**Follow-up opportunities (NOT done):**

- Sort articles by published date (currently feed-order biased)
- Parallel feed fetching with Promise.all() (currently sequential)
- Failure backoff throttle (currently retries immediately on all-fail)
