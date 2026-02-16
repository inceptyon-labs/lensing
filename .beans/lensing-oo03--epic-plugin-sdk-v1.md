---
# lensing-oo03
title: 'Epic: Plugin SDK v1'
status: todo
type: epic
priority: high
tags:
    - pasiv
    - priority:high
created_at: 2026-02-16T21:19:21Z
updated_at: 2026-02-16T21:19:21Z
---

Plugin system foundation: manifest spec, loader, scheduler, caching, data bus, permission enforcement, and developer tooling.

## Vision
A robust plugin SDK that makes it easy to build, test, and distribute plugins. The SDK defines the contract; plugins snap in without touching core code.

## Features
- Plugin manifest schema & loader
- Plugin scheduler & caching helpers
- Data bus (pub/sub inter-plugin communication)
- Plugin developer tools (scaffolding, dev server, test harness)
- Admin panel plugin management

## Success Criteria
- [ ] plugin.json schema validated on load
- [ ] Plugins dynamically imported and rendered in zones
- [ ] Scheduler runs plugins at configured intervals with caching
- [ ] Data bus allows pub/sub between plugins
- [ ] `lensing plugin create` scaffolds a new plugin
- [ ] Plugin dev server runs a single plugin in isolation
- [ ] Admin panel lists, enables/disables, and configures plugins
