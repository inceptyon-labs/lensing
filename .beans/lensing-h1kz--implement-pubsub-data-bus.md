---
# lensing-h1kz
title: Implement pub/sub data bus
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:backend
created_at: 2026-02-16T21:23:56Z
updated_at: 2026-02-19T15:21:22Z
parent: lensing-0rn7
---

Publish/subscribe data bus for inter-plugin communication.

## Acceptance Criteria

- [x] Named channels: plugins publish to channels (e.g., weather.current, calendar.today)
- [x] Subscribe API: plugins and agent service subscribe to channels
- [x] Immutable snapshots: subscribers get read-only data (no mutation of another plugin's data)
- [x] Typed channel contracts in @lensing/types
- [x] Bus events forwarded to WebSocket for UI rendering (via onMessage global listener)

---

**Size:** M

## Summary of Implementation

**Files Created:**

- `packages/core/src/data-bus.ts` (84 lines) - Data bus factory and implementation
- `packages/core/src/__tests__/data-bus.test.ts` (302 lines) - 23 comprehensive tests

**Files Modified:**

- `packages/types/src/index.ts` - Added DataBusInstance, DataBusSubscriber, related types
- `packages/core/src/index.ts` - Exported createDataBus

**Core Features:**

1. **Named Channels** - `publish(channel, pluginId, data)` on any string channel
2. **Subscription API** - `subscribe(channel, callback)` returns unsubscribe function
3. **Immutable Snapshots** - All data frozen with Object.freeze() before delivery
4. **Type Safety** - DataBusMessage<T> with typed channel contracts
5. **WebSocket Forwarding** - `onMessage(callback)` global listener for UI updates
6. **Error Isolation** - Subscriber errors don't affect other subscribers
7. **Channel Management** - getLatest(), getChannels(), clear(), close()

**Tests (23 total - all passing):**

- Publish/subscribe on named channels (4 tests)
- Multiple subscribers (1 test)
- Immutable data protection (3 tests)
- getLatest() with frozen data (3 tests)
- Unsubscribe cleanup (3 tests)
- getChannels() listing (2 tests)
- Global listeners for WS forwarding (2 tests)
- Error isolation (2 tests)
- Clear and close (2 tests)
- Timestamp validation (1 test)

**Verification Results:**

- ✓ Tests: 231/231 passing (core package, includes 23 data-bus tests)
- ✓ Build: All 5 packages compiled successfully
- ✓ Merge: Successfully merged to main (commit f138119)

**Integration Points:**

The data bus is ready for integration with:

- WebSocket server (forward bus events to UI via onMessage callback)
- Plugin scheduler (plugins can subscribe to refresh completion)
- Agent service (subscribe to plugin data for composite summaries)
