# Session Handoff: Create RSS news server module and widget

Date: 2026-02-21
Issue: lensing-off8 - Create RSS news server module and widget
Branch: feature/lensing-off8

## What Was Done

### Step 1: Types & Data Structures (COMPLETE)

- Created `packages/types/src/news.ts` with:
  - `NewsArticle` interface: id, title, summary, link, published (unix ms), source, category
  - `NewsData` interface: articles array, lastUpdated
  - `NewsServerOptions`: feedUrls, categories map, maxItems, maxStale_ms, dataBus, notifications, fetchFn
  - `NewsServerInstance`: refresh(), getHeadlines(), onUpdate(), onError(), close()
  - Constants: `DEFAULT_NEWS_MAX_ITEMS = 20`, `DEFAULT_NEWS_MAX_STALE_MS = 600_000`
- Added exports to `packages/types/src/index.ts`
- Commit: `0bc2a18 feat: add news types and constants to @lensing/types (lensing-off8)`
- All 28 types tests passing (6 new news tests + existing)

## Files Created

- `packages/types/src/news.ts` (types, constants)
- `packages/types/src/__tests__/news.test.ts` (6 tests)
- `packages/types/src/index.ts` (exports added)

## Next Steps (ordered)

1. **Step 2: News Server Module** — Create `packages/core/src/news-server.ts`
   - Factory pattern: `createNewsServer(options: NewsServerOptions): NewsServerInstance`
   - Lightweight RSS XML parsing (regex-based, no deps)
   - Data bus publishing to `news.headlines` channel
   - Notifications for alert categories
   - Caching with `maxStale_ms` and `refreshing` guard
   - Defensive copies before returning/publishing
   - Tests: fetch, transform, data bus publish, alerts, caching, errors, lifecycle

2. **Step 3: News UI Store** — Create `packages/ui/src/news-store.ts`
   - Factory pattern: `createNewsStore(options): NewsStore`
   - State: data, isLoading, error, activeCategory
   - Methods: getState, setData, setLoading, setError, isStale, onChange
   - Category filtering: getByCategory(), getCategories()
   - Helper: truncateSummary() for compact mode
   - Tests: state management, staleness, subscriptions, category filters

3. **Step 4: News Headlines Widget** — Create `apps/display/src/lib/NewsHeadlines.svelte`
   - Svelte component: props headline, maxItems, compact mode
   - Design system compliance:
     - Background: `--event-horizon`
     - Text: `--starlight` (primary), `--dim-light` (secondary)
     - Accent: category badges with `--ember`
     - Borders: `--edge` + hover glow
     - Min font: `--text-sm` (14px, kiosk rule)
     - Radius: `--radius-md`
   - Compact mode: inline articles with icon
   - Empty state handling

4. **Step 5: Plugin Integration**
   - Create `packages/core/src/plugins/news/plugin.json`
   - Export from `packages/core/src/index.ts`
   - Export from `packages/ui/src/index.ts`

5. **Step 6: Format & Lint** — Run formatters

6. **Step 7: Tests** — Full test suite must pass (all 938+ tests)

7. **Step 8: Review** — SC tier (Sonnet → Codex)
   - Pass 1: Sonnet quick scan
   - Pass 2: Codex detailed review

8. **Step 9: Verification** — Tests, build, lint, typecheck

9. **Step 10: Merge** — Merge to main, close bean lensing-off8

## Key Implementation Patterns

### From codebase:

- Server module: `packages/core/src/crypto-server.ts` as template
  - `PLUGIN_ID = 'news-server'`
  - `DATA_BUS_HEADLINES_CHANNEL = 'news.headlines'`
  - Defensive copies: `copyCoin()` → `copyArticle()`
  - Error handling: try-catch around each listener call
  - Caching: `lastFetchedAt` timestamp, `refreshing` guard
  - Data bus publish after successful fetch and transform

- UI Store: `packages/ui/src/crypto-store.ts` as template
  - `notifying` re-entrance guard prevents cascade notifications
  - `callbacks` array copied during notification: `[...callbacks]`
  - `copyData()` defensive copy pattern

- Widget: `apps/display/src/lib/PhotoSlideshow.svelte` as template
  - onMount/onDestroy lifecycle
  - Reactive assignment with `$:`
  - Design system tokens referenced via CSS vars

### RSS Parsing:

- Lightweight regex-based parsing (no external XML library)
- Handle malformed feeds gracefully
- Extract: title, description, link, pubDate from `<item>`
- Strip HTML tags from descriptions

### Constants & Naming:

- `DEFAULT_NEWS_MAX_ITEMS = 20`
- `DEFAULT_NEWS_MAX_STALE_MS = 600_000` (10 minutes)
- Channel: `news.headlines`
- Plugin ID: `news-server`

## Files to Load Next Session

- `packages/types/src/news.ts` (complete types)
- `packages/core/src/crypto-server.ts` (server pattern)
- `packages/ui/src/crypto-store.ts` (store pattern)
- `packages/ui/src/weather-store.ts` (category filtering example)
- `.interface-design/system.md` (design tokens)

## Review Tier

SC (Sonnet → Codex) — moderate complexity, no security patterns

## Baseline Tests

938 tests passing across all packages before starting
