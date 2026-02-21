---
# lensing-pqbe
title: Create crypto server module and widget
status: completed
type: task
priority: normal
tags:
  - pasiv
  - size:M
  - area:backend
  - area:frontend
created_at: 2026-02-16T21:24:24Z
updated_at: 2026-02-20T03:52:05Z
parent: lensing-itei
---

Crypto prices plugin: server polling and widget display.

## Acceptance Criteria

- [x] Server module polls crypto prices (CoinGecko or similar free API)
- [x] Config: watchlist of coins, alert thresholds, change windows (1h, 24h, 7d)
- [x] Publishes crypto.prices and crypto.alerts to data bus
- [x] Widget shows price, percent change with color indicators
- [x] Diff updates to minimize DOM churn

---

**Size:** M

## Summary

Implemented crypto server module with types, server, and UI store. All tests passing (698/698), build succeeded, formatting complete. Merged to main.
