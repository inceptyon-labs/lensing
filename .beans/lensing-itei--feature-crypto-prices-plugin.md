---
# lensing-itei
title: 'Feature: Crypto Prices Plugin'
status: todo
type: feature
priority: normal
tags:
  - pasiv
  - priority:medium
  - area:backend
  - area:frontend
created_at: 2026-02-16T21:20:55Z
updated_at: 2026-02-16T21:20:55Z
parent: lensing-mrxz
---

Crypto price tracker with watchlist, alerts, and percent-change indicators.

## Goals

- Server module: poll crypto prices, support watchlist config
- Widget: price display with percent-change windows and alert indicators
- Publishes crypto.prices and crypto.alerts to data bus
- Diff updates to minimize DOM churn

## Scope

**In Scope:** Price polling, watchlist, alerts, change indicators
**Out of Scope:** Trading, portfolio tracking
