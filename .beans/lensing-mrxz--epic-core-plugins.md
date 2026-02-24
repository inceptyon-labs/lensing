---
# lensing-mrxz
title: 'Epic: Core Plugins'
status: completed
type: epic
priority: high
tags:
  - pasiv
  - priority:high
created_at: 2026-02-16T21:19:25Z
updated_at: 2026-02-24T00:30:50Z
---

First-party plugin suite: weather, allergies, crypto, news, calendar (CalDAV/iCloud), and sports scores.

## Vision

Ship the plugins that make Lensing immediately useful out of the box. Each plugin demonstrates SDK best practices and publishes to the data bus.

## Features

- Weather plugin
- Allergies plugin
- Crypto prices plugin
- News plugin (RSS)
- Calendar plugin (CalDAV/iCloud)
- Sports scores plugin

## Success Criteria

- [ ] All 6 plugins load, fetch data, cache, and render
- [ ] Each plugin publishes to the data bus
- [ ] Diff updates minimize DOM churn
- [ ] Plugins emit notifications at appropriate priority levels
- [ ] Staleness indicators show when data is stale
