---
# lensing-t8oc
title: Build weather widget component
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:frontend
created_at: 2026-02-16T21:24:16Z
updated_at: 2026-02-17T02:30:58Z
parent: lensing-fs0t
---

Svelte weather widget: current conditions and forecast display.

## Acceptance Criteria

- [ ] Current conditions: temperature, conditions icon, feels-like, humidity
- [ ] Forecast: multi-day outlook with high/low and condition icons
- [ ] Supports small, medium, and large widget sizes
- [ ] Uses theme tokens (no hardcoded colors)
- [ ] Staleness indicator when data exceeds max_stale
- [ ] Loading and error states

---

**Size:** M

## Summary of Changes

Weather store fully implemented as a pure TypeScript data factory following the factory pattern established by calendar-store and notification-store.

**Files changed:**

- packages/ui/src/weather-store.ts (182 lines) - New pure TypeScript store
- packages/ui/src/**tests**/weather-store.test.ts (318 lines) - Comprehensive test suite (35 tests)
- packages/ui/src/index.ts - Added exports

**Key decisions:**

- Pure TypeScript store (not Svelte component) — data layer only
- Factory pattern: createWeatherStore() returning WeatherStore interface
- Explicit property copying for complete immutability (prevents external mutations)
- Closure-based state management with internal 'data' variable
- Callback isolation with try/catch to prevent one bad listener from breaking others
- Re-entrancy guard using 'notifying' flag to prevent infinite recursion
- Staleness validation with Number.isFinite() to catch NaN/Infinity edge cases
- getForecast() limit normalization to handle negative/float limits

**Immutability approach:**

- setWeatherData: Explicitly copies each property from input
- getState: Returns completely independent object with explicit property copies
- getCurrentConditions: Returns fresh object with explicit property copies
- getForecast: Maps array with explicit property copies per item

**Test coverage:**

- Initial state: 3 tests
- Mutations (setWeatherData, setLoading, setError): 8 tests
- Staleness logic: 4 tests + 2 edge cases
- Accessors (getCurrentConditions, getForecast): 5 tests
- Immutability: 4 tests
- Callback robustness: 1 test (callback error isolation)
- Re-entrancy guard: 1 test
- Forecast limit normalization: 3 tests
- Total: 35 tests, all passing

**Completed with SC review:**

- Pass 1 (Sonnet): No errors found
- Pass 2 (Codex): Found 1 ERROR + 4 WARNINGs, all fixed
  - Mutable references exposure → Fixed with explicit property copying
  - Callback isolation missing → Fixed with try/catch
  - Re-entrancy unguarded → Fixed with 'notifying' flag
  - Staleness validation missing → Fixed with Number.isFinite()
  - getForecast limit not normalized → Fixed with Math.max/floor
