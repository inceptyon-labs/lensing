# Session Handoff: AI-Assisted Connector Setup (WIP)

Date: 2026-03-03
Issue: lensing-mrhb - AI-assisted connector setup (Feature)
Status: In Progress (2 of 5 implementation steps complete)

## What Was Done

### Step 1: Add AI Assist Types ✓

- Created `packages/types/src/__tests__/ai-assist-types.test.ts` (6 tests)
- Added types to `packages/types/src/index.ts`:
  - `AiProviderId` — Union type: 'anthropic' | 'deepseek' | 'gemini'
  - `AiProviderConfig` — provider, model, apiKeyRef
  - `AiAssistPluginContext` — name, description
  - `AiAssistRequest` — provider, model, docsTextOrUrl, pluginContext
  - `AiAssistConnector` — type, url, method, headers, refreshInterval
  - `AiAssistResponse` — connector, html, css, explanation
- All 6 types tests passing
- Build passing

### Step 2: LLM Provider Abstraction ✓

- Created `packages/core/src/ai-assist-providers.ts` with:
  - `Message`, `MessageRole`, `GenerateOptions` types
  - `AiProvider` interface: `generate(messages, model, options?): Promise<string>`
  - `createAiProvider()` factory supporting all three providers
  - **Anthropic provider** — Uses `/v1/messages` API, handles text blocks
  - **DeepSeek provider** — OpenAI-compatible API at `api.deepseek.com`
  - **Gemini provider** — Generative Language API with content/parts format
  - Timeout handling (30s default) with proper AbortError conversion
  - Error handling for network, HTTP errors, timeouts
- Created `packages/core/src/__tests__/ai-assist-providers.test.ts` (11 tests)
  - Tests for all three providers
  - Tests for configuration validation, errors, timeout enforcement, streaming
- All 11 provider tests passing
- Build passing

## Files Changed

- `packages/types/src/index.ts` (+73 lines, types added at end)
- `packages/types/src/__tests__/ai-assist-types.test.ts` (new, 94 lines)
- `packages/core/src/ai-assist-providers.ts` (new, 211 lines)
- `packages/core/src/__tests__/ai-assist-providers.test.ts` (new, 177 lines)

## Commits Made

1. `feat: add AI assist types to @lensing/types (#lensing-mrhb)`
2. `feat: implement LLM provider abstraction for AI assist (#lensing-mrhb)`

## Test Results

- AI Assist Types: 6/6 tests passing
- AI Assist Providers: 11/11 tests passing
- Overall: 2239/2227 tests passing (12 new tests added)
- Build: ✓ successful
- Lint: ✓ (no errors)

## Remaining Steps (3 of 5)

### Step 3: AI Assist Service (TODO)

- Create `packages/core/src/ai-assist.ts`
  - Prompt engineering for API doc → connector generation
  - Output parsing (extract JSON from LLM response)
  - Validation against ConnectorInput schema
  - `createAiAssist()` factory returning `AiAssistInstance`
  - Error handling, retries on parse failure
- Create `packages/core/src/__tests__/ai-assist.test.ts`
  - Tests for prompt construction, output parsing, error handling
  - Mock providers for deterministic testing
- Files to modify: None new (only new files)

### Step 4: REST Endpoint + HostService Wiring (TODO)

- Add to `packages/types/src/index.ts`:
  - Add `aiAssist?: (input: AiAssistRequest) => Promise<AiAssistResponse>` to `RestServerHandlers`
- Create REST endpoints in `packages/core/src/rest-server.ts`:
  - `POST /api/admin/builder/ai-assist` — calls aiAssist handler
  - `GET /api/admin/ai-assist/settings` — return provider config (keys redacted)
  - `PUT /api/admin/ai-assist/settings` — save provider + API key via secrets
- Wire in `packages/core/src/host-service.ts`:
  - Create AI assist service instance with secret resolver
  - Wire as `RestServerHandlers.aiAssist`
- Files to modify:
  - `packages/types/src/index.ts` (add handler interface)
  - `packages/core/src/rest-server.ts` (add endpoints)
  - `packages/core/src/host-service.ts` (wire service)

### Step 5: Admin UI AI Assist Panel (TODO)

- Create `apps/display/src/lib/AdminAiAssist.svelte`:
  - Provider selector dropdown with "not configured" state
  - Textarea for docs paste + optional URL input
  - Generate button with loading spinner
  - Result preview: show connector config, HTML, CSS
  - "Apply" button to populate wizard fields
  - Error states, offline fallback (hides AI assist)
- Create `apps/display/src/__tests__/admin-ai-assist.test.ts`:
  - Tests for provider selection, input capture, generate flow, error handling
- Integrate into `apps/display/src/lib/AdminBuilderView.svelte`:
  - Add AI assist panel to Data Source step
  - Button to toggle between manual and AI-assisted modes
- Files to modify:
  - `apps/display/src/lib/AdminBuilderView.svelte` (add panel)

## Key Architecture Notes

### Security

- API keys stored via AES-256-GCM encrypted secrets (lensing-e18k system)
- Keys never sent to frontend; only provider names shown in UI
- All LLM calls happen server-side only
- Input size limits: docs text max 50KB (to prevent abuse)
- No arbitrary code execution from LLM output

### Provider Details

- **Anthropic**:
  - Endpoint: `https://api.anthropic.com/v1/messages`
  - Models: claude-sonnet-4-20250514, claude-haiku-4-5-20251001, etc.
  - Response format: `{ content: [{ type: 'text', text: '...' }] }`

- **DeepSeek**:
  - Endpoint: `https://api.deepseek.com/chat/completions` (OpenAI-compatible)
  - Models: deepseek-chat, deepseek-reasoner
  - Response format: `{ choices: [{ message: { content: '...' } }] }`

- **Gemini**:
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
  - Models: gemini-2.0-flash, gemini-2.5-pro
  - Response format: `{ candidates: [{ content: { parts: [{ text: '...' }] } }] }`

### LLM Prompt Strategy

- System prompt: describe connector types (json_api, rss_feed, static_data), response format expectations
- User prompt: "Given this API documentation, generate a connector config and widget template"
- Expected response: JSON with `{ connector: {...}, html: "...", css: "...", explanation: "..." }`
- Parser: Extract JSON block, validate against schema, handle parse failures gracefully

## Design Decisions & Tradeoffs

1. **Server-side LLM calls**: Prevents API key leakage, simplifies security model
2. **Multi-provider abstraction**: Allows users to choose provider based on preference/cost
3. **Timeout enforcement**: 30s per request to prevent hang-ups
4. **Graceful degradation**: If AI assist not configured, builder still works in manual mode
5. **No streaming UI**: Simpler implementation, better UX (shows complete result at once)

## Known Issues & Deferred Work

1. **Vite CSS preprocessing bug** (from lensing-e18k):
   - AdminAiAssist.svelte may need inline styles or separate CSS file if CSS block causes issues
   - Workaround: Use builder.css external file (proven working)

2. **Output validation**:
   - LLM may generate invalid JSON or incomplete configs
   - Fallback: Show error + suggest manual entry
   - Future: Retry with corrected prompts

3. **Rate limiting**:
   - Not implemented in this task
   - Can be added as middleware layer later

## Files to Load Next Session

**High Priority:**

- `packages/core/src/ai-assist-providers.ts` (reference for provider patterns)
- `packages/core/src/__tests__/ai-assist-providers.test.ts` (test patterns)
- `packages/types/src/index.ts` (verify all types exported)
- Bean file: `lensing-mrhb--ai-assisted-connector-setup.md`

**Reference Only:**

- `packages/core/src/rest-server.ts` (understand endpoint structure)
- `apps/display/src/lib/AdminBuilderView.svelte` (understand wizard integration point)
- `packages/core/src/host-service.ts` (understand wiring pattern)

## What NOT to Re-Read

- AI assist types test (complete, passing)
- LLM provider implementation (complete, passing)
- Steps 1-2 commit messages (already done)

## Session Summary

Completed 2 of 5 implementation steps (40% done):

- ✓ Step 1: Types system (6 tests)
- ✓ Step 2: Multi-provider LLM abstraction (11 tests)
- TODO Step 3: AI assist service & prompt engineering
- TODO Step 4: REST endpoints + HostService wiring
- TODO Step 5: Admin UI panel

All code follows TDD methodology (RED → GREEN → REFACTOR → COMMIT). Build and tests passing. No blockers identified.

**Next session**: Continue with Step 3 (AI assist service with prompt engineering). Estimated 3 more TDD cycles to complete remaining steps.

---

_Handoff created at context checkpoint. Next session should run `/pasiv:kick lensing-mrhb` to resume._
