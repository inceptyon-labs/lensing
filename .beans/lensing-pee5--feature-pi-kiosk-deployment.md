---
# lensing-pee5
title: 'Feature: Pi Kiosk & Deployment'
status: todo
type: feature
priority: normal
tags:
  - pasiv
  - priority:medium
  - area:infra
created_at: 2026-02-16T21:20:12Z
updated_at: 2026-02-16T21:20:12Z
parent: lensing-u2k6
---

systemd services for host + Chromium kiosk with auto-start and auto-recovery.

## Goals

- systemd unit files for Lensing host and Chromium kiosk
- Chromium kiosk flags optimized for Pi 3B (--disable-gpu, --memory-pressure-off)
- Auto-start on boot and auto-recover on failure
- Boot script for initial Pi OS setup

## Scope

**In Scope:** systemd units, Chromium config, boot setup
**Out of Scope:** Docker packaging (optional later)
