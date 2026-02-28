---
# lensing-2dg7
title: Admin Settings tab for hardware/display controls
status: completed
type: feature
priority: normal
created_at: 2026-02-28T14:20:04Z
updated_at: 2026-02-28T14:27:00Z
---

Add a Settings tab to the admin panel for hardware controls (brightness, rotation, contrast) with runtime capability detection. Includes display-hardware service, REST endpoints, and frontend panel.

## Tasks

- [x] Create display-settings types in packages/types
- [x] Create display-hardware service in packages/core
- [x] Write display-hardware tests
- [x] Add REST endpoints for display capabilities/settings
- [x] Wire display hardware into host-service boot
- [x] Add Settings tab to AdminTabBar
- [x] Create AdminSettingsPanel component
- [x] Wire settings panel into AdminPluginList
- [x] Write admin-settings frontend tests
- [x] Verify build, tests, lint pass

## Summary of Changes

Implemented the full Admin Settings tab for hardware/display controls:

- **Types**: `DisplayCapabilities`, `DisplaySettings`, `DisplayHardwareInstance` etc. in `packages/types/src/display-settings.ts`
- **Core service**: `createDisplayHardware()` factory with capability probing for rpi_backlight, ddcutil, and xrandr
- **REST endpoints**: GET/PUT for `/display/capabilities`, `/display/settings`, `/display/brightness`, `/display/contrast`, `/display/rotation`
- **Host service**: Wires display hardware at boot, restores persisted settings from DB, provides capability-conditional REST handlers
- **Frontend**: Settings tab in AdminTabBar, AdminSettingsPanel with conditional brightness/contrast sliders, rotation select, and PIR card
- **Tests**: 35 display-hardware unit tests + 14 admin-settings frontend tests, all passing
- **Verification**: 1,803 tests pass, build clean, format clean
