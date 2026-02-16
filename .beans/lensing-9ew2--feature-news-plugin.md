---
# lensing-9ew2
title: 'Feature: News Plugin'
status: todo
type: feature
priority: normal
tags:
    - pasiv
    - priority:medium
    - area:backend
    - area:frontend
created_at: 2026-02-16T21:20:59Z
updated_at: 2026-02-16T21:20:59Z
parent: lensing-mrxz
---

RSS-based news plugin with categories and headlines-only mode.

## Goals
- Server module: RSS feed parsing, category filtering, caching
- Widget: headline list with "headlines only" compact mode
- Publishes news.headlines to data bus
- Config: RSS feed URLs, categories, display mode

## Scope
**In Scope:** RSS parsing, categories, headlines mode
**Out of Scope:** Full article rendering, non-RSS sources
