---
# lensing-175l
title: Build Ask Lensing interface
status: completed
type: task
priority: normal
tags:
    - pasiv
    - size:M
    - area:frontend
    - area:backend
created_at: 2026-02-16T21:25:18Z
updated_at: 2026-02-19T20:03:34Z
parent: lensing-944w
---

Question/answer interface: admin UI input, agent processing, kiosk display.

## Acceptance Criteria

- [ ] Text input in admin UI to type questions
- [ ] Question routed to Agent Service via Gateway
- [ ] Agent response rendered on kiosk display (card/overlay)
- [ ] Conversation history visible in admin UI
- [ ] Loading state while agent processes

---

**Size:** M



## Completed

Implemented full Ask Lensing interface:
- REST POST /ask endpoint with JSON validation and CORS support
- ConversationEntry type for Q&A data model
- Ask store with conversation history, loading states, error handling
- AskResponse kiosk component with design system styling
- Auto-dismiss timeout functionality with proper cleanup
- 29 new tests (7 REST, 22 UI store) - all passing

**Architecture:**
- Factory pattern for ask-store (matches existing codebase patterns)
- Closure-based state management with onChange callback notifications
- Fixed positioning component (bottom-6 right-6) for kiosk display
- Hardcoded design system colors (gravitational lensing theme)

**Verification:**
- 693 tests passing (no regressions)
- Build successful (TypeScript strict mode)
- Code reviewed (SC tier: Sonnet → Codex)
- All checks: tests ✓, build ✓, format ✓, types ✓
