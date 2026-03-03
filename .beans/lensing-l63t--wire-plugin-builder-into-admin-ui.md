---
# lensing-l63t
title: Wire plugin builder into admin UI
status: in-progress
type: feature
priority: normal
created_at: 2026-03-03T02:59:16Z
updated_at: 2026-03-03T03:40:48Z
---

Create AdminBuilderView.svelte orchestrator and add 'Create Plugin' button to AdminPluginList.svelte that toggles between list and builder views. Builder uses existing BuilderWizard, BuilderStep1, WidgetTemplatePicker, BuilderPreview components with textarea-based HTML/CSS editing for Step 2.

## Summary of Changes

### New Files

- `apps/display/src/lib/AdminBuilderView.svelte` — Orchestrator component that composes BuilderWizard, WidgetTemplatePicker, and BuilderPreview into a 3-step plugin creation flow (Metadata → Template & Code → Preview & Save)
- `apps/display/src/__tests__/admin-builder-view.test.ts` — 19 tests covering wizard structure, metadata form, template/code editing, save endpoint, error handling, cancel
- `apps/display/src/__tests__/admin-plugin-list-builder.test.ts` — 3 integration tests covering builder lifecycle (render, cancel→list, save→list)

### Modified Files

- `apps/display/src/lib/AdminPluginList.svelte` — Added "Create Plugin" button to Plugins tab with `activeView` toggle between list and builder views

### Design Decisions

- Built metadata form inline in AdminBuilderView (not reusing BuilderStep1) to avoid dual-Next-button conflict — BuilderStep1 has its own Next button that conflicts with BuilderWizard's navigation buttons
- Used textarea-based HTML/CSS editing (not GrapesJS) per plan caveat about Svelte 5 onMount/onDestroy incompatibility
- AdminPluginList cannot be directly rendered in vitest due to CSS preprocessing issue with vite 6 + svelte plugin; integration tests verify behavior via AdminBuilderView's onCancel/onSaved callbacks

### Follow-up: Data Source Step + Connector Fix (Session 2)

- Added 4th wizard step "Data Source" between Template & Code and Preview & Save
- Inlined connector type picker (JSON API, RSS Feed, Static Data) with per-type configuration
- JSON API: URL, method, headers, refresh interval
- RSS Feed: feed URL, refresh interval
- Static Data: refresh interval only (no URL needed)
- Fixed save payload to use proper `ConnectorInput` format (`{ type, url, method?, headers?, refreshInterval? }`) instead of broken `{ type, config: {} }`
- The old payload would crash `packagePlugin()` when calling `extractHostname(input.connector.url)` on undefined — this was why plugins weren't appearing after save
- Added connector step CSS to builder.css (type picker cards, config form, header rows)
- Updated tests from 19 → 27 tests to cover data source step
- All 415 tests pass, build succeeds
