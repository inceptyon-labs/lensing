---
# lensing-8ots
title: Create systemd unit files for host and kiosk
status: in-progress
type: task
priority: normal
tags:
    - pasiv
    - size:S
    - area:infra
created_at: 2026-02-16T21:23:29Z
updated_at: 2026-02-22T01:16:51Z
parent: lensing-pee5
---

systemd service units for auto-starting and recovering the Lensing host and Chromium kiosk.

## Acceptance Criteria

- [x] lensing-host.service: starts Node host, restarts on failure
- [x] lensing-kiosk.service: starts Chromium in kiosk mode, depends on host
- [x] Chromium flags: --kiosk, --disable-gpu, --memory-pressure-off, --noerrdialogs
- [x] Services enabled for auto-start on boot
- [x] Install script to copy units and enable services

---

**Size:** S


## Summary of Changes

**Files changed:**
- deploy/lensing-host.service (new) — Node.js host service
- deploy/lensing-kiosk.service (new) — Chromium kiosk service
- deploy/install.sh (new) — copy + enable script
- deploy/__tests__/systemd-units.test.ts (new) — 24 tests

**Key decisions:**
- User=pi (standard Pi convention)
- Chromium binary: chromium-browser (Raspberry Pi OS default)
- Host path: /home/pi/lensing/apps/display/build/index.js
- Root check added to install.sh after Opus review

**Notes for next task:**
- deploy/ directory established for deployment artifacts
- Tests run via: npx vitest run deploy/__tests__/systemd-units.test.ts
- Not part of turbo pipeline (deploy is not a pnpm package)
