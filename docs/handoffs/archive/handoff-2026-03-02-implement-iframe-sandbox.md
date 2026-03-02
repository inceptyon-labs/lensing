# Session Handoff: Implement iframe sandbox for custom JS widgets

Date: 2026-03-02
Issue: lensing-hlqm - Implement iframe sandbox for custom JS widgets
Parent: lensing-25mp (Feature: Template Widget Renderer) - in-progress

## What Was Done

- Completed Task: lensing-hlqm - Implement iframe sandbox for custom JS widgets
- TDD: 33 tests (19 for iframe-sandbox utility, 14 for IframeWidget component)
- OC Review: Opus fixed height bounds + try-catch, Codex found critical issues (pluginId in bootstrap, SSR guards, height validation) — all fixed
- Verification: All checks passed (371 tests, build, lint, types)
- Merged to main at commit 0baae53

## Files Changed

- apps/display/src/lib/iframe-sandbox.ts (new, 74 lines) — Utility for sandboxed iframes
- apps/display/src/lib/IframeWidget.svelte (new, 58 lines) — Component rendering iframes
- apps/display/src/**tests**/iframe-sandbox.test.ts (new, 136 lines) — 19 tests
- apps/display/src/**tests**/iframe-widget.test.ts (new, 189 lines) — 14 tests

## Key Design Decisions

- **Sandbox**: Use `sandbox="allow-scripts"` only (no allow-same-origin) for security
- **Bootstrap Script**: Included in srcdoc; reports height and listens for data messages via postMessage
- **pluginId Scoping**: All messages scoped by pluginId to prevent cross-plugin interference
- **Height Bounds**: MAX_IFRAME_HEIGHT = 3000px to prevent DOS via height bloat
- **SSR Safety**: Event listeners registered in onMount(), guarded with `typeof window !== 'undefined'`
- **Validation**: Height values validated with `Number.isFinite()` before applying

## Next Steps (ordered)

1. Next Task: Check if lensing-25mp (parent feature) has other sub-tasks remaining
   - If no other sub-tasks, close parent feature
   - If other sub-tasks exist, continue with `/kick next`

2. Integration: Connect IframeWidget to PluginRenderer to render JS plugins in iframes
   - Use hasCustomJs(html, manifest) to decide between ShadowWidget (no JS) vs IframeWidget (custom JS)
   - Wire into the plugin rendering pipeline

## Architecture Notes

- **Two-pronged widget rendering**:
  - ShadowWidget: Shadow DOM for templates without custom JS (fast, no iframe overhead)
  - IframeWidget: iframe with sandbox for templates with custom JS (secure, isolated)

- **Message Protocol**:
  - Parent → iframe: `{ type: 'widget-data', pluginId, data }`
  - iframe → Parent: `{ type: 'widget-resize', pluginId, height }`

- **Bootstrap Script**:
  - Listens for 'widget-data' messages
  - Dispatches CustomEvent('widget-data-update') so plugin JS can react
  - Reports height on DOMContentLoaded and after layout changes
  - Uses IIFE to scope variables, avoids pollution

## Test Coverage

**iframe-sandbox.test.ts (19 tests)**:

- hasCustomJs: 7 tests (script tag detection, manifest check, case insensitivity)
- buildSandboxSrcdoc: 8 tests (HTML structure, CSS inclusion, JS inclusion, bootstrap script)
- Constants & interfaces: 4 tests

**iframe-widget.test.ts (14 tests)**:

- Rendering: 7 tests (iframe element, sandbox attr, srcdoc, custom JS)
- Data injection: 3 tests (postMessage on data change, null handling)
- Resize handling: 4 tests (height update, pluginId filtering, type filtering)

## No Open Questions

- ✓ Bootstrap script includes pluginId in resize payload
- ✓ Component guards window access for SSR
- ✓ Height values validated before applying
- ✓ All 33 tests passing
- ✓ OC review fixes applied

## Code Quality

- Build: ✓ Succeeds (exit 0)
- Tests: ✓ 371/371 passing (no regressions)
- Lint: ✓ No new errors (baseline 1574)
- Types: ✓ Checked via build
