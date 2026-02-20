---
# lensing-pqbe
title: Create crypto server module and widget
status: in-progress
type: task
priority: normal
tags:
  - pasiv
  - size:M
  - area:backend
  - area:frontend
created_at: 2026-02-16T21:24:24Z
updated_at: 2026-02-20T03:30:37Z
parent: lensing-itei
---

Crypto prices plugin: server polling and widget display.

## Acceptance Criteria

- [ ] Server module polls crypto prices (CoinGecko or similar free API)
- [ ] Config: watchlist of coins, alert thresholds, change windows (1h, 24h, 7d)
- [ ] Publishes crypto.prices and crypto.alerts to data bus
- [ ] Widget shows price, percent change with color indicators
- [ ] Diff updates to minimize DOM churn

---

**Size:** M
