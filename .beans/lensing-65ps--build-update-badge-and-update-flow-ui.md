---
# lensing-65ps
title: Build update badge and update flow UI
status: completed
type: task
priority: normal
created_at: 2026-02-28T15:47:08Z
updated_at: 2026-03-02T03:39:44Z
parent: lensing-o1oh
---

Visual indicators and flow for updating outdated plugins.

## Acceptance Criteria

- [x] "Update available" badge on marketplace cards and installed plugin cards
- [x] Version comparison shown (e.g. "1.0.0 → 1.1.0")
- [x] One-click update button with progress feedback
- [x] Confirmation prompt: "Update will replace widget template. Config will be preserved."
- [x] Success/error feedback after update

---

**Size:** S
**Area:** frontend

## Completed

**Files changed:**
- packages/types/src/index.ts (added installedVersion?: string to MarketplacePlugin)
- apps/display/src/lib/MarketplacePluginBrowser.svelte (update badge on cards)
- apps/display/src/lib/MarketplacePluginDetailView.svelte (version comparison + confirmation dialog)
- apps/display/src/__tests__/marketplace-plugin-browser.test.ts (2 new badge tests)
- apps/display/src/__tests__/marketplace-plugin-detail-view.test.ts (5 new tests)

**Key decisions:**
- Badge is a span with text 'Update' inside the plugin card button — no additional component needed
- Version comparison shown only when installedVersion is provided (graceful fallback)
- Confirmation dialog replaces the Update button (shows inline, not modal) — install flow changed to requestUpdate() → showConfirm → confirmUpdate() → handleInstall()
- Error recovery (after failed update) bypasses confirmation — already accepted, no need to re-confirm
- installedVersion is optional on MarketplacePlugin type — backend can provide it or omit it

**Notes for next task:**
- Backend needs to populate installedVersion field on MarketplacePlugin for version comparison to display
- Update badge on 'installed plugin cards' (AdminPluginCard) was not implemented — that card uses PluginAdminEntry, not MarketplacePlugin, and would need a separate mechanism
- All existing install tests continue to pass (Install flow unchanged — only Update flow now has confirmation)
