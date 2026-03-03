---
# lensing-qaov
title: Wire AI provider env vars into HostService
status: completed
type: task
priority: normal
created_at: 2026-03-03T18:49:02Z
updated_at: 2026-03-03T18:58:38Z
---

## Description

Wire environment variable API keys into the HostService so the AI-assisted connector setup feature works end-to-end.

## Acceptance Criteria

- [x] HostService reads ANTHROPIC_API_KEY, DEEPSEEK_API_KEY, GEMINI_API_KEY from env
- [x] Creates AiProvider instances for each key that is set
- [x] Wires aiAssist handler into RestServerHandlers
- [x] Available providers list is derived from which env vars are set
- [x] POST /api/admin/builder/ai-assist returns working responses (not 404)
- [x] Tests cover: no keys set, partial keys, all keys, handler integration

## Technical Notes

- createAiProvider() already exists in packages/core/src/ai-assist-providers.ts
- createAiAssist() already exists in packages/core/src/ai-assist.ts
- RestServerHandlers.aiAssist interface already defined
- AdminAiAssist component accepts availableProviders prop
- Keys must never be logged or exposed to frontend
