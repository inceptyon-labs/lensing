---
# lensing-p8i1
title: Redesign AdminPluginCard for integration-only settings (Framerr-style)
status: completed
type: task
priority: normal
created_at: 2026-02-26T15:46:30Z
updated_at: 2026-02-26T16:03:35Z
---

The admin settings page for built-in modules still shows zone selector, enable/disable toggle, and an awkward 'Configure' open/close button. Following Framerr's pattern:

- Remove zone selector for built-in modules
- Remove enable/disable toggle for built-in modules (grid-driven, toggle is a no-op)
- Show integration fields directly on the card (always visible, no Configure toggle)
- Save button inline with fields
- Clean card: module name + integration status badge + fields + save

Keep existing behavior for third-party plugins (they still need zone/enable/configure).

## Summary of Changes

Redesigned AdminPluginCard with two layouts:

**Built-in modules (integration card):**
- Module name + integration status badge (Configured / Setup Required)
- Integration fields shown directly (always visible)
- Auto-restart status inline
- No zone, no enable/disable, no Configure button

**Third-party plugins (unchanged):**
- Zone selector, enable/disable toggle, Configure button preserved

Files: apps/display/src/lib/AdminPluginCard.svelte



Updated to list + modal pattern (second iteration):
- AdminPluginCard: clickable row cards for built-in modules (name, desc, badge, chevron)
- AdminConfigModal: new modal component (header, form, save+restart footer)
- AdminPluginList: manages modal state, passes onConfigure callback
