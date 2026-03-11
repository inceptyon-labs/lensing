---
# lensing-38pp
title: AI News Summary module
status: completed
type: feature
priority: normal
created_at: 2026-03-06T16:58:31Z
updated_at: 2026-03-06T17:05:39Z
---

New built-in module that fetches RSS headlines, sends them to a configurable LLM (anthropic/deepseek/gemini) for 2-3 line summaries, and publishes them on a configurable interval. User selects model, categories (feed URLs), and refresh interval.

## Plan

- [x] 1. Types: `packages/types/src/ai-news.ts` — data types + server options
- [x] 2. Module settings: Add `ai-news` to ModuleId, MODULE_IDS, MODULE_SCHEMAS
- [x] 3. Server: `packages/core/src/ai-news-server.ts` — fetch RSS → LLM summarize → publish
- [x] 4. Server tests: `packages/core/src/__tests__/ai-news-server.test.ts`
- [x] 5. Store: `packages/ui/src/ai-news-store.ts` — UI store
- [x] 6. Store tests: `packages/ui/src/__tests__/ai-news-store.test.ts`
- [x] 7. Module boot: Wire into `module-boot.ts`
- [x] 8. Core index: Export from `packages/core/src/index.ts`
- [x] 9. Widget: `apps/display/src/lib/AiNewsWidget.svelte`
- [x] 10. Verify: build + tests pass


## Summary of Changes

Added AI News Summary as a new built-in module. Fetches RSS headlines, sends them to a configurable LLM (Anthropic/DeepSeek/Gemini) for 2-3 line summaries, and publishes on a 30-minute interval.

### Files Created
- `packages/types/src/ai-news.ts` — data types, server options, defaults
- `packages/core/src/ai-news-server.ts` — factory with RSS parsing + LLM summarization
- `packages/core/src/__tests__/ai-news-server.test.ts` — 19 tests
- `packages/ui/src/ai-news-store.ts` — UI store with category/source filtering
- `packages/ui/src/__tests__/ai-news-store.test.ts` — 19 tests
- `apps/display/src/lib/AiNewsWidget.svelte` — widget component

### Files Modified
- `packages/types/src/index.ts` — export AI news types
- `packages/types/src/module-settings.ts` — add ai-news to ModuleId, MODULE_IDS, MODULE_SCHEMAS
- `packages/core/src/module-boot.ts` — wire ai-news case with LLM summarize function
- `packages/core/src/index.ts` — export createAiNewsServer
- `packages/ui/src/index.ts` — export createAiNewsStore
- `packages/types/src/__tests__/module-settings.test.ts` — update count 9→10
- `packages/core/src/__tests__/host-service.test.ts` — update count 9→10
- `packages/core/src/__tests__/plugin-admin-handlers.test.ts` — update count 9→10
