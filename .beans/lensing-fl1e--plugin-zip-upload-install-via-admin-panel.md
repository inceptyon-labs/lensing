---
# lensing-fl1e
title: 'Plugin zip upload: install via admin panel'
status: completed
type: feature
priority: high
created_at: 2026-02-24T15:18:54Z
updated_at: 2026-02-24T15:23:37Z
---

## Overview

Add ability to upload a .zip plugin archive through the admin panel. The zip is validated, extracted to the plugins/ directory, and the plugin loader reloads.

## Acceptance Criteria

- [x] POST /plugins/install endpoint accepts raw zip upload
- [x] Validates zip contains a valid plugin.json before extracting
- [x] Extracts to plugins/<plugin-id>/ directory
- [x] Reloads plugin loader after successful install
- [x] Returns the newly installed plugin entry
- [x] Rejects invalid zips (no plugin.json, invalid manifest, duplicate id)
- [x] Admin UI has upload button with drag-and-drop zone
- [x] Shows success/error feedback after upload
- [x] All tests pass (1381 total)

## Summary of Changes

Added plugin zip upload feature. Backend: `installPluginFromZip()` in plugin-install.ts validates and extracts zips, `POST /plugins/install` endpoint, wired through plugin-admin-handlers. Frontend: `AdminPluginUpload.svelte` with drag-and-drop zone, integrated into AdminPluginList.

Commit: 84508fd
