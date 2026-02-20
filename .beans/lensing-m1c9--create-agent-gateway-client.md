---
# lensing-m1c9
title: Create agent gateway client
status: completed
type: task
priority: normal
tags:
    - pasiv
    - size:M
    - area:backend
created_at: 2026-02-16T21:25:11Z
updated_at: 2026-02-20T02:30:19Z
parent: lensing-r418
---

Lightweight agent gateway running on the Pi, communicating with remote Agent Service.

## Acceptance Criteria

- [x] Gateway client connects to remote Agent Service (WebSocket or HTTP)
- [x] Forwards user requests (from admin UI) to Agent Service
- [x] Receives agent responses and triggers local UI events
- [x] Forwards data bus snapshots to Agent Service on request
- [x] Connection health monitoring and auto-reconnect

---

**Size:** M

## Summary of Changes

Implemented lightweight WebSocket gateway client for agent communication:

**Files created:**
- packages/core/src/agent-gateway.ts (201 LOC) - Factory function, connection management, message handling, auto-reconnect
- packages/core/src/__tests__/agent-gateway.test.ts (641 LOC) - 35 comprehensive tests covering all scenarios

**Files modified:**
- packages/core/src/index.ts - Export createAgentGateway
- packages/types/src/index.ts - Added AgentGatewayOptions, AgentGatewayInstance, WebSocket message types

**Key features implemented:**
✓ WebSocket connection to remote Agent Service with injectable factory for testing
✓ Request forwarding (user prompts → agent requests)
✓ Response handling with error isolation
✓ Data bus snapshot forwarding on request
✓ Auto-reconnect with exponential backoff (via reconnectManager)
✓ Stale socket race condition handling via socket ID tracking
✓ Send atomicity verification with strict error throwing
✓ Comprehensive error handling and state management

**Review process:**
- SC (Sonnet → Codex) cascading review completed
- Codex found and we fixed 2 edge cases:
  1. Stale socket race condition (multiple simultaneous connects)
  2. Silent send failure on socket state race
- All 360 tests pass, build succeeds

**Verification:**
- Tests: 360 passed
- Build: Success
- All acceptance criteria met
