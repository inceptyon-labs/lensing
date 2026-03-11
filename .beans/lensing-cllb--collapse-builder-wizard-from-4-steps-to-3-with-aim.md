---
# lensing-cllb
title: Collapse builder wizard from 4 steps to 3 with AI/Manual toggle
status: completed
type: task
priority: normal
created_at: 2026-03-04T02:24:03Z
updated_at: 2026-03-04T02:26:52Z
---

Merge Template & Code (step 2) and Data Source (step 3) into a single Configure step with AI Assist / Manual toggle. Preview becomes step 3 (index 2).

## Summary of Changes

- **AdminBuilderView.svelte**: Collapsed 4-step wizard (Metadata → Template & Code → Data Source → Preview & Save) into 3 steps (Metadata → Configure → Preview & Save). Added `useAiAssist` / `aiApplied` state. Step 1 (Configure) shows a segmented toggle between AI Assist and Manual modes. AI mode shows AdminAiAssist; Manual mode (or after AI apply) shows template picker, HTML/CSS editors, connector type picker, URL/headers, refresh interval. Step validation merged to require both HTML and connector.
- **builder.css**: Added `.builder-mode-toggle` segmented control styles with ember highlight for active state.
- **admin-builder-view.test.ts**: Rewrote tests for 3-step flow — merged `fillCodeAndAdvance` + `fillDataSourceAndAdvance` into `fillConfigureAndAdvance`. Updated step count (3), labels, and navigation.
- **admin-plugin-list-builder.test.ts**: Updated integration test to use Manual toggle in the merged configure step.
