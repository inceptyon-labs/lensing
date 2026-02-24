---
# lensing-bxi7
title: Build CryptoWidget.svelte
status: completed
type: task
priority: high
created_at: 2026-02-24T18:00:25Z
updated_at: 2026-02-24T22:18:15Z
parent: lensing-wbum
blocked_by:
    - lensing-zl2i
---

No crypto display widget exists. PluginRenderer has no 'crypto' branch — it falls through to Placeholder.

## What to Build

- apps/display/src/lib/CryptoWidget.svelte
- Props: CryptoData (coins: CoinPrice[])
- Show coin name, symbol, price, 1h/24h/7d change with color coding (green up, red down)
- Tabular layout with price alignment
- Support compact mode
- Use lensing design system tokens

## Data Shape (from @lensing/types)

```ts
interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change_1h: number;
  change_24h: number;
  change_7d: number;
}
interface CryptoData {
  coins: CoinPrice[];
  lastUpdated: number;
}
```

Channel: crypto.prices

## Blocked By

- lensing-zl2i (PluginRenderer data wiring)

## Key Files

- apps/display/src/lib/CryptoWidget.svelte (NEW)
- apps/display/src/lib/PluginRenderer.svelte (add branch)
