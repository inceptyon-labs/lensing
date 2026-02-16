---
# lensing-914x
title: Implement PIR sensor GPIO integration
status: todo
type: task
priority: normal
tags:
    - pasiv
    - size:M
    - area:backend
    - area:infra
created_at: 2026-02-16T21:24:53Z
updated_at: 2026-02-16T21:24:53Z
parent: lensing-jnf0
---

PIR sensor reading via GPIO for presence-based display control.

## Acceptance Criteria
- [ ] GPIO pin reading for PIR sensor on Raspberry Pi (onoff or pigpio)
- [ ] Motion detected → wake display from ambient, switch to active scene
- [ ] No motion for N minutes (configurable) → dim to ambient mode
- [ ] Graceful fallback: feature disabled when no PIR sensor detected
- [ ] Presence state exposed via data bus and admin panel

---
**Size:** M
