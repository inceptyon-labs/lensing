---
# lensing-7nct
title: 'Feature: Marketplace Client'
status: todo
type: feature
priority: high
created_at: 2026-02-28T15:44:35Z
updated_at: 2026-02-28T15:44:35Z
parent: lensing-023a
---

Core service that fetches, caches, and serves the marketplace index from GitHub. Handles plugin download and install from marketplace, version comparison, and offline fallback.

## Goals
- Fetch and cache index.json from GitHub raw (15-min refresh)
- REST endpoints for marketplace browse/search/detail
- Plugin download from GitHub and install via existing flow
- Version comparison between installed and marketplace versions
- Offline fallback: serve cached data with banner

## Scope
**In Scope:** Index fetch/cache, REST API, download/install, version check, offline mode
**Out of Scope:** Publishing (separate feature), ratings, analytics
