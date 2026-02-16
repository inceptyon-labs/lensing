---
# lensing-8ots
title: Create systemd unit files for host and kiosk
status: todo
type: task
priority: normal
tags:
  - pasiv
  - size:S
  - area:infra
created_at: 2026-02-16T21:23:29Z
updated_at: 2026-02-16T21:23:29Z
parent: lensing-pee5
---

systemd service units for auto-starting and recovering the Lensing host and Chromium kiosk.

## Acceptance Criteria

- [ ] lensing-host.service: starts Node host, restarts on failure
- [ ] lensing-kiosk.service: starts Chromium in kiosk mode, depends on host
- [ ] Chromium flags: --kiosk, --disable-gpu, --memory-pressure-off, --noerrdialogs
- [ ] Services enabled for auto-start on boot
- [ ] Install script to copy units and enable services

---

**Size:** S
