---
# lensing-mrhb
title: AI-assisted connector setup
status: todo
type: feature
priority: normal
created_at: 2026-03-03T13:15:22Z
updated_at: 2026-03-03T13:15:22Z
blocked_by:
  - lensing-gjrv
  - lensing-e18k
---

Add an AI agent to the plugin builder that can read API documentation and automatically
generate connector config + template HTML. User pastes API docs or a URL, the agent
figures out endpoints, auth, response shape, and field mapping.

## Requirements

- [ ] Settings panel: LLM provider selection (DeepSeek, Anthropic, Gemini)
- [ ] Settings panel: API key entry per provider (stored encrypted via secrets management)
- [ ] Settings panel: Model selection per provider (optional, sensible defaults)
- [ ] Builder step: "Paste API documentation" textarea or URL input
- [ ] Agent generates connector config (URL, method, headers, auth scheme)
- [ ] Agent generates template HTML with {{placeholder}} fields mapped to API response
- [ ] Agent generates template CSS matching lensing design system
- [ ] Preview populated with sample API response
- [ ] User can review and edit all generated output before saving
- [ ] Error handling for LLM failures, rate limits, invalid API docs
- [ ] Works offline gracefully (falls back to manual config)
- [ ] Tests for agent flow, provider switching, generated output validation

## LLM Provider Config

- DeepSeek: deepseek-chat / deepseek-reasoner
- Anthropic: claude-sonnet-4-20250514 (default) / claude-haiku-4-5-20251001
- Gemini: gemini-2.0-flash (default) / gemini-2.5-pro

## Architecture Notes

- Provider config stored in settings DB (same as other module settings)
- API keys stored via secrets management system (lensing-e18k)
- Agent runs server-side (packages/core) to keep API keys off the client
- REST endpoint: POST /api/admin/builder/ai-assist
- Request: { provider, docs_text_or_url, plugin_context }
- Response: { connector: ConnectorInput, html: string, css: string, explanation: string }
- Future: paywall-ready — feature flag to gate access when released publicly
