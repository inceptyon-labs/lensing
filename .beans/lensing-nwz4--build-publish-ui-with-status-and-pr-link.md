---
# lensing-nwz4
title: Build publish UI with status and PR link
status: completed
type: task
priority: normal
created_at: 2026-02-28T15:47:28Z
updated_at: 2026-03-02T02:49:25Z
parent: lensing-lmnp
---

UI for the publish flow: button, progress, status display, and PR link.

## Acceptance Criteria

- [x] "Publish to Marketplace" button on builder-created plugins
- [x] Pre-publish validation check (all fields filled, connector tested)
- [x] Progress states: "Packaging...", "Uploading...", "Creating PR..."
- [x] Success state: "Published — awaiting review" with clickable PR link
- [x] Error state with retry button
- [x] Disabled state if no GitHub token configured (with link to Settings)

---

**Size:** S
**Area:** frontend

## Completed

**Features Implemented:**

- Publish button with disabled state when no GitHub token (with settings message)
- Pre-publish validation via onValidate callback, displays field-level errors
- Progress state cycling: Packaging → Uploading → Creating PR (1.5s intervals)
- Success state with "Published — awaiting review" message and clickable PR link
- Error state with descriptive message and Retry button

**Files Changed:**

- apps/display/src/lib/MarketplacePublishPanel.svelte (new, 92 lines)
- apps/display/src/**tests**/marketplace-publish-panel.test.ts (new, 114 lines)

**Key Technical Decisions:**

- Callback-based design: onValidate (sync) + onPublish (async) keep component decoupled from core
- Progress stages use setInterval (1500ms) with proper cleanup on success/error
- State machine: idle → publishing → success|error, with validation-failed branch
- Retry re-invokes handlePublish without resetting to idle first (avoids flash)
- External link uses target=\_blank with rel=noopener noreferrer

**Notes for next task:**

- Component is UI-only — needs parent to wire up validatePublish() and createPublisherPr()
- githubToken prop controls enabled/disabled state (null = disabled)
- 8 tests with fake timer coverage for progress cycling

**Commits:**

- 0f9abc2 feat: add MarketplacePublishPanel with publish flow state machine (#lensing-nwz4)
- 9aa8725 style: format and lint
