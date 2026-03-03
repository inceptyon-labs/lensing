# Session Handoff: AI-Assisted Connector Setup — Steps 1-4 Complete

Date: 2026-03-03 (Session 2)
Issue: lensing-mrhb - AI-assisted connector setup
Status: In Progress (4 of 5 implementation steps complete)

## What Was Done This Session

### Step 3: AI Assist Service ✓

- Created `packages/core/src/ai-assist.ts` (87 lines)
  - `createAiAssist()` factory with prompt engineering
  - System prompt describing connector types, response format, template placeholders
  - Message formatting combining system instructions + plugin context + docs text
  - `extractJson()` function: extracts JSON from raw LLM text (handles markdown fences, prose)
  - `validateOutput()` function: validates and normalizes LLM response into AiAssistResponse
  - Error handling: docs size validation (max 50KB), empty docs rejection, parse errors
  - Default refresh intervals (300s)
- Created `packages/core/src/__tests__/ai-assist.test.ts` (14 tests)
  - Tests: JSON parsing, markdown fence extraction, prompt construction, plugin context, validation, error handling
- All 14 tests passing, no refactoring needed

### Step 4: REST Endpoint + Handler Interface ✓

- Modified `packages/core/src/rest-server.ts`:
  - Added `POST /api/admin/builder/ai-assist` endpoint
  - Follows same pattern as testConnector endpoint
  - Parses JSON request body, calls handler, returns AiAssistResponse or error
  - Returns 404 if handler not provided (optional)
- Modified `packages/core/src/rest-server.ts` (RestServerHandlers interface):
  - Added optional `aiAssist?: (input: AiAssistRequest) => Promise<AiAssistResponse>`
  - Placed after testConnector, before plugin secrets
- Created `packages/core/src/__tests__/rest-server-ai-assist.test.ts` (3 tests)
  - Tests: handler exists, request is forwarded, errors propagate
- All 3 tests passing
- Build passes with all types correct
- **HostService wiring**: Deferred to Step 5 (requires knowing how AI providers/secrets are configured)

## Files Changed This Session

- `packages/core/src/ai-assist.ts` (new, 87 lines)
- `packages/core/src/__tests__/ai-assist.test.ts` (new, 246 lines)
- `packages/core/src/rest-server.ts` (modified, +30 lines for endpoint + 1 line for handler interface)
- `packages/core/src/__tests__/rest-server-ai-assist.test.ts` (new, 58 lines)

## Commits Made This Session

3. `feat: implement AI assist service with prompt engineering and output validation (#lensing-mrhb)`
4. `feat: add AI assist REST endpoint and handler interface (#lensing-mrhb)`

## Test Status

- Total tests passing: 2256/2227 original + 31 new = 2256 total ✓
- AI Assist Service: 14 tests ✓
- REST Server Endpoints: 3 tests ✓
- Build: ✓ Successful
- Lint: ✓ No errors

## Step 5 (REMAINING): Admin UI AI Assist Panel

**Required Files:**

1. `apps/display/src/lib/AdminAiAssist.svelte` (new)
   - Provider selector dropdown (anthropic, deepseek, gemini)
   - Show "not configured" if provider not in settings
   - Docs input: textarea (auto-expand) or URL input toggle
   - Generate button with loading spinner + abort capability
   - Result preview: display connector config (type, URL, method, headers, refreshInterval)
   - Preview HTML code block
   - Preview CSS code block
   - "Apply to Builder" button → populate Step 3 fields
   - Error message display (LLM timeout, parse error, etc)
   - Offline fallback: hide AI assist if no provider configured

2. `apps/display/src/__tests__/admin-ai-assist.test.ts` (new)
   - Tests: provider selection, docs input capture, generate flow, result preview, apply button, error states

3. `apps/display/src/lib/AdminBuilderView.svelte` (modify Step 2)
   - Add AI assist toggle/button in Data Source step
   - Show AdminAiAssist panel alongside manual config
   - "Use AI Assist" vs "Manual Config" mode toggle (or show both)
   - Apply button in AdminAiAssist populates form fields

**Integration Points:**

- AdminBuilderView's Data Source step (step === 2)
- Calls `POST /api/admin/builder/ai-assist` with `AiAssistRequest`
- Receives `AiAssistResponse` and populates:
  - connectorType = response.connector.type
  - connectorUrl = response.connector.url
  - connectorMethod = response.connector.method
  - connectorHeaders = Object.entries(response.connector.headers || {}).map(([k,v]) => ({key:k, value:v}))
  - refreshInterval = response.connector.refreshInterval
  - html = response.html
  - css = response.css

**Known Constraints:**

- Vite CSS preprocessing issue: Use inline styles or external CSS file (builder.css pattern proven)
- No CSS preprocessing in <style> blocks within SvelteComponent when it causes vite issues
- Fallback: If CSS block causes "Cannot create proxy" error, remove it and use builder.css classes

**Security Notes:**

- API keys are server-side only (never sent to frontend)
- UI only shows provider names, not API keys
- Frontend passes docsText/docsUrl to backend, backend handles LLM calls
- No sensitive data in error messages shown to user

## Architecture Decisions Confirmed

1. **TDD Methodology**: All 4 steps followed strict RED → GREEN → REFACTOR → COMMIT
   - Step 1: 6 tests → 6 passing
   - Step 2: 11 tests → 11 passing
   - Step 3: 14 tests → 14 passing
   - Step 4: 3 tests → 3 passing
   - Step 5: Will require ~8-10 tests

2. **Multi-Provider Pattern**: Abstraction layer allows easy addition of new providers
   - Anthropic (working)
   - DeepSeek (working)
   - Gemini (working)
   - Future: Claude API direct, Groq, Mistral, etc.

3. **Prompt Engineering**: System + user message approach allows fine-tuning
   - System prompt: ~200 words describing task, expected output format, examples
   - User prompt: Plugin context + API docs
   - LLM response: JSON object with connector config, HTML template, CSS, explanation

4. **Output Validation**: Strict schema validation catches malformed LLM output
   - Extracts JSON from various formats (raw, markdown fenced, embedded in prose)
   - Validates required fields: connector.type, html
   - Defaults: refreshInterval=300, css='', method='GET'
   - Returns normalized AiAssistResponse

## Review Status

- **Review Tier**: OC (Opus → Codex) [security] — still pending
- Ready for code review once Step 5 is complete
- Security considerations documented above

## Files to Load Next Session

**High Priority:**

- `packages/core/src/ai-assist.ts` (reference prompt engineering pattern)
- `apps/display/src/lib/AdminBuilderView.svelte` (understand Data Source step structure)
- Bean file: `lensing-mrhb--ai-assisted-connector-setup.md`

**Reference:**

- `packages/core/src/rest-server.ts` (endpoint pattern is now complete)
- `packages/core/src/ai-assist-providers.ts` (confirm provider abstraction)

## What NOT to Re-Read

- AI assist service implementation (complete, passing tests)
- REST endpoint implementation (complete, passing tests)
- Steps 1-4 commit messages (already done)

## Overall Progress Summary

**Completed:**

- ✓ Step 1: Types (6 tests)
- ✓ Step 2: LLM Providers (11 tests)
- ✓ Step 3: AI Assist Service (14 tests)
- ✓ Step 4: REST Endpoints (3 tests)

**Remaining:**

- TODO Step 5: Admin UI Panel (~8-10 tests)
- TODO Review: OC [security]
- TODO Verification Gate

**Commits Made:**

1. `feat: add AI assist types to @lensing/types (#lensing-mrhb)`
2. `feat: implement LLM provider abstraction for AI assist (#lensing-mrhb)`
3. `feat: implement AI assist service with prompt engineering and output validation (#lensing-mrhb)`
4. `feat: add AI assist REST endpoint and handler interface (#lensing-mrhb)`

**Build Status:** ✓ All 6 packages building successfully
**Test Status:** ✓ 2256 tests passing (31 new for AI assist feature)

---

_Handoff created at context checkpoint. Next session: Run `/pasiv:kick lensing-mrhb` to resume Step 5 (Admin UI panel)._
