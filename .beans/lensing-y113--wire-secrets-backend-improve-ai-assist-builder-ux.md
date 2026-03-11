---
# lensing-y113
title: Wire secrets backend + improve AI assist builder UX
status: completed
type: feature
priority: normal
created_at: 2026-03-03T20:11:39Z
updated_at: 2026-03-03T20:19:10Z
---

Wire the secrets infrastructure into the host-service boot sequence and redesign the AI assist builder UX to detect, explain, and enter secrets inline during plugin creation.

## TODO

- [x] A1: Wire secretStore + connectorRunner in host-service.ts
- [x] A2: Auto-detect secrets in plugin-package.ts
- [x] A3: Verify/add createSecretStore export in core index
- [x] B1: Add AiAssistSecretInfo type and secrets field to AiAssistResponse
- [x] B2: Update AI assist prompt and output validation for secrets
- [x] B3: Redesign AdminAiAssist.svelte result display
- [x] B4: Add inline secret entry in AdminBuilderView.svelte
- [x] B5: Add CSS classes for new components in builder.css
- [x] Verify: pnpm build + pnpm test pass

## Summary of Changes

Wired the secrets backend (secretStore, connectorRunner with secret resolver, scheduler) into the host-service boot sequence. Auto-detect {{NAME}} placeholders in plugin-package. Updated AI assist to return secret info with descriptions. Redesigned AdminAiAssist result card with structured connector display, secret highlighting, and collapsible code. Added inline secret entry in the builder wizard. All 2767+ tests passing, clean build.
