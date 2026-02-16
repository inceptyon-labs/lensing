---
# lensing-u2k6
title: 'Epic: Host + Kiosk Skeleton'
status: todo
type: epic
priority: high
tags:
    - pasiv
    - priority:high
created_at: 2026-02-16T21:19:15Z
updated_at: 2026-02-16T21:19:15Z
---

Foundational milestone: Pi OS setup, SvelteKit app with zone-based layout, Node host with REST + WebSocket, SQLite persistence, dark theming, and systemd deployment.

## Vision
Stand up the core runtime — a working SvelteKit dashboard on Chromium kiosk connected to a Node host via WebSocket, with zone-based layout and dark theme. Everything else builds on this skeleton.

## Features
- Monorepo & project scaffolding (pnpm + Turborepo)
- SvelteKit display app with zone-based layout
- Node host service with REST + WebSocket
- SQLite persistence layer
- Theming foundation (CSS custom properties)
- Pi kiosk & systemd deployment

## Success Criteria
- [ ] Monorepo builds and runs with `pnpm dev`
- [ ] Zone-based layout renders with placeholder widgets
- [ ] WebSocket pushes updates from host to display with auto-reconnect
- [ ] SQLite stores and retrieves layout/settings
- [ ] Dark theme tokens applied consistently
- [ ] systemd services start host + kiosk on boot
