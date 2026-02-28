---
# lensing-023a
title: 'Epic: Marketplace'
status: todo
type: epic
priority: high
created_at: 2026-02-28T15:44:05Z
updated_at: 2026-02-28T15:44:05Z
---

Plugin discovery and distribution via a GitHub-based marketplace. Users browse, search, and one-click install plugins. Creators publish directly from the device via GitHub API (PR-based review gate).

## Vision

A zero-infrastructure marketplace powered by a GitHub repo. The full loop: create → publish (PR) → review/merge → browse → install. GitHub provides hosting, versioning, and review gates for free.

## Features

- Marketplace client (fetch/cache index.json from GitHub)
- Marketplace browser UI (grid, search, filters, detail view)
- One-click install from marketplace
- Publish from device (GitHub API PR creation)
- Version comparison and update detection
- Offline fallback with local cache

## Success Criteria

- [ ] Device fetches and caches marketplace index.json
- [ ] Browse UI shows plugin grid with thumbnails and categories
- [ ] Search filters by name/description/tags
- [ ] One-click install downloads ZIP and installs via existing flow
- [ ] Publish creates PR to marketplace repo via GitHub API
- [ ] Update detection shows badges for newer versions
- [ ] Offline mode serves cached data with banner
