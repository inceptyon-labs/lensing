---
# lensing-aiqh
title: 'Admin Panel Improvements: Tabs, Smarter Restart, News Presets'
status: completed
type: feature
priority: normal
created_at: 2026-02-25T15:31:42Z
updated_at: 2026-02-25T15:35:51Z
---

Three improvements to admin panel:

1. Layout redesign: Tab-based layout with grouped module grid (Modules | Plugins tabs)
2. Smarter restart button: Only show after config save (not always)
3. News feed presets: Checkbox picker for common free RSS feeds

## Tasks

- [x] Create admin-module-groups.ts grouping constant
- [x] Create AdminTabBar.svelte tab switcher
- [x] Create AdminModuleSection.svelte section header + grid
- [x] Refactor AdminPluginList.svelte to use tabs and groups
- [x] Widen admin page max-width to 960px
- [x] Add configDirty state to AdminPluginCard for smarter restart
- [x] Create news-feed-presets.ts data constant
- [x] Create NewsFeedPresets.svelte checkbox component
- [x] Wire NewsFeedPresets into AdminConfigForm for news plugin
- [x] Build and verify

## Summary of Changes

### Layout Redesign

- New `AdminTabBar.svelte` with Modules | Plugins tab switcher
- New `AdminModuleSection.svelte` with section headers and responsive card grid
- New `admin-module-groups.ts` grouping modules into Data Sources, Integrations, Hardware
- Refactored `AdminPluginList.svelte` to split built-in modules (grouped) from third-party plugins (with upload zone)
- Widened admin page from 800px to 960px

### Smarter Restart Button

- `AdminPluginCard` now accepts `configDirty` prop
- Restart button only appears after config save (not always)
- Ember glow pulse animation draws attention when restart available
- Dirty state tracked in `AdminPluginList` via `dirtyIds` Set, cleared on restart

### News Feed Presets

- New `news-feed-presets.ts` with curated feeds (BBC, NPR, AP, Hacker News, Ars Technica, Reuters, ESPN)
- New `NewsFeedPresets.svelte` checkbox picker grouped by category
- Wired into `AdminConfigForm` below the feedUrls field for news plugin
- Manual URLs preserved when toggling presets
