---
# lensing-01jd
title: Add auto-save to localStorage for crash recovery
status: completed
type: task
priority: low
created_at: 2026-02-28T15:46:28Z
updated_at: 2026-03-02T14:28:36Z
parent: lensing-rq0o
---

Persist builder wizard state and GrapesJS editor state to localStorage for crash recovery.

## Acceptance Criteria

- [ ] Auto-save wizard state (metadata, connector config, field mapping) on change
- [ ] Auto-save GrapesJS project data periodically (every 30s) and on step change
- [ ] On builder open, detect saved state and offer "Resume editing?" prompt
- [ ] Clear saved state after successful save/publish
- [x] Scoped to plugin ID to support multiple in-progress builds

---

**Size:** S
**Area:** frontend

## Completed

**Files changed:**

- apps/display/src/lib/builder-autosave.ts (128 lines, new) — localStorage utility with save/load/clear/hasSaved functions
- apps/display/src/**tests**/builder-autosave.test.ts (541 lines, new) — 21 tests covering all functionality

**Key decisions:**

- Pure utility module (no integration code yet — ready for wizard steps to import and use)
- localStorage scoped by pluginId to support multiple concurrent drafts
- WizardState type includes: metadata, connectorConfig, fieldMappings, editorProject, currentStep, canvasSize
- Timestamp included in saved state for future staleness detection
- createAutoSaver factory with periodic save (30s interval) + manual cleanup
- Try-catch error handling everywhere (graceful degradation for SSR, private browsing, quota exceeded)

**Notes for next task:**

- Import builder-autosave in BuilderWizard and BuilderStep components
- Call hasSavedState() on wizard open to show "Resume editing?" prompt
- Wire saveWizardState() to step onChange handlers and onNext buttons
- Wire startPeriodicSave() with getState callback returning current step data
- Call clearWizardState() after successful save/publish
- Parent feature: lensing-rq0o (Preview & Local Save) has 2 tasks total, 1 now complete
