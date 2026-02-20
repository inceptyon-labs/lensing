---
# lensing-vq0w
title: Create allergies server module and widget
status: completed
type: task
priority: normal
tags:
  - pasiv
  - size:M
  - area:backend
  - area:frontend
created_at: 2026-02-16T21:24:20Z
updated_at: 2026-02-20T03:00:40Z
parent: lensing-l9s9
---

Allergies plugin: server fetch and widget display.

## Acceptance Criteria

- [x] Server module fetches allergy/pollen data from API
- [x] Config: location(s), alert thresholds, refresh interval
- [x] Publishes allergies.current to data bus
- [x] Widget shows pollen levels with color-coded severity
- [x] Alert notification emitted when threshold exceeded

---

**Size:** M

---

## Completed

**Files created/modified:**

- packages/core/src/allergies-server.ts (206 LOC) - API fetch, cache, notifications, data bus publish
- packages/core/src/**tests**/allergies-server.test.ts (421 LOC) - 26 tests covering all scenarios
- packages/ui/src/allergies-store.ts (130 LOC) - UI store with severity colors/labels
- packages/ui/src/**tests**/allergies-store.test.ts (232 LOC) - 29 tests
- packages/types/src/index.ts - Added allergy types + EmitOptions + NotificationQueueInstance + FetchFn

**Key decisions:**

- Ambee pollen API for data source
- Threshold-based alert notifications (default 3/5)
- Cache with 1-hour default staleness
- Defensive copy pattern for data isolation
- Severity color mapping using CSS custom properties from design system

**Review:** SC (Sonnet → Codex): Fixed NaN in clampLevel, null category handling, data isolation, tests for edge cases

All tests passing (386 core + 248 ui). Build passing. Ready for integration with widget display layer.
