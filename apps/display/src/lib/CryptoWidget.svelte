<script lang="ts">
  import type { CoinPrice } from '@lensing/types';

  export let coins: CoinPrice[] = [];
  export let compact: boolean = false;

  function formatPrice(price: number): string {
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 });
  }

  function formatChange(pct: number): string {
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(2)}%`;
  }

  function changeClass(pct: number): string {
    if (pct > 0) return 'crypto-widget__change--positive';
    if (pct < 0) return 'crypto-widget__change--negative';
    return 'crypto-widget__change--neutral';
  }
</script>

<div class="crypto-widget" class:crypto-widget--compact={compact}>
  {#if coins.length === 0}
    <div class="crypto-widget__empty">
      <span>No crypto data available</span>
    </div>
  {:else if compact}
    <ul class="crypto-widget__compact-list">
      {#each coins as coin (coin.id)}
        <li class="crypto-widget__compact-item">
          <span class="crypto-widget__symbol">{coin.symbol.toUpperCase()}</span>
          <span class="crypto-widget__compact-price">${formatPrice(coin.price)}</span>
          <span class="crypto-widget__change {changeClass(coin.change_24h)}">{formatChange(coin.change_24h)}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <table class="crypto-widget__table">
      <thead>
        <tr>
          <th class="crypto-widget__th">Coin</th>
          <th class="crypto-widget__th crypto-widget__th--right">Price</th>
          <th class="crypto-widget__th crypto-widget__th--right">1h</th>
          <th class="crypto-widget__th crypto-widget__th--right">24h</th>
          <th class="crypto-widget__th crypto-widget__th--right">7d</th>
        </tr>
      </thead>
      <tbody>
        {#each coins as coin (coin.id)}
          <tr class="crypto-widget__row">
            <td class="crypto-widget__td">
              <span class="crypto-widget__symbol">{coin.symbol.toUpperCase()}</span>
              <span class="crypto-widget__name">{coin.name}</span>
            </td>
            <td class="crypto-widget__td crypto-widget__td--right crypto-widget__price">
              ${formatPrice(coin.price)}
            </td>
            <td class="crypto-widget__td crypto-widget__td--right">
              <span class="crypto-widget__change {changeClass(coin.change_1h)}">{formatChange(coin.change_1h)}</span>
            </td>
            <td class="crypto-widget__td crypto-widget__td--right">
              <span class="crypto-widget__change {changeClass(coin.change_24h)}">{formatChange(coin.change_24h)}</span>
            </td>
            <td class="crypto-widget__td crypto-widget__td--right">
              <span class="crypto-widget__change {changeClass(coin.change_7d)}">{formatChange(coin.change_7d)}</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .crypto-widget {
    background: var(--event-horizon, hsl(240, 6%, 7%));
    border: 1px solid var(--edge, hsla(220, 10%, 50%, 0.12));
    border-radius: var(--radius-md, 8px);
    padding: var(--space-4, 16px);
    box-shadow: 0 0 0 1px var(--edge, hsla(220, 10%, 50%, 0.12));
    color: var(--starlight, hsl(220, 15%, 90%));
    overflow-x: auto;
  }

  /* ── Table layout ─────────────────────────────────────────────────────────── */

  .crypto-widget__table {
    width: 100%;
    border-collapse: collapse;
  }

  .crypto-widget__th {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    color: var(--dim-light, hsl(220, 10%, 62%));
    letter-spacing: var(--tracking-wide, 0.04em);
    text-transform: uppercase;
    text-align: left;
    padding: 0 var(--space-2, 8px) var(--space-2, 8px);
    border-bottom: 1px solid var(--edge-soft, hsla(220, 10%, 50%, 0.07));
  }

  .crypto-widget__th--right {
    text-align: right;
  }

  .crypto-widget__td {
    padding: var(--space-2, 8px) var(--space-2, 8px);
    font-size: var(--text-base, 1rem);
    border-bottom: 1px solid var(--edge-soft, hsla(220, 10%, 50%, 0.07));
    font-variant-numeric: tabular-nums;
  }

  .crypto-widget__td--right {
    text-align: right;
  }

  .crypto-widget__row:last-child .crypto-widget__td {
    border-bottom: none;
  }

  /* ── Coin identity ────────────────────────────────────────────────────────── */

  .crypto-widget__symbol {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-semi, 600);
    color: var(--ember, hsl(28, 85%, 55%));
    letter-spacing: var(--tracking-wide, 0.04em);
    text-transform: uppercase;
    margin-right: var(--space-2, 8px);
  }

  .crypto-widget__name {
    font-size: var(--text-sm, 0.875rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
  }

  /* ── Price ────────────────────────────────────────────────────────────────── */

  .crypto-widget__price {
    font-size: var(--text-base, 1rem);
    font-weight: var(--weight-semi, 600);
    color: var(--starlight, hsl(220, 15%, 90%));
  }

  /* ── Change indicators ────────────────────────────────────────────────────── */

  .crypto-widget__change {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    font-variant-numeric: tabular-nums;
  }

  .crypto-widget__change--positive {
    color: var(--alert-success, hsl(160, 45%, 45%));
  }

  .crypto-widget__change--negative {
    color: var(--alert-urgent, hsl(0, 60%, 55%));
  }

  .crypto-widget__change--neutral {
    color: var(--dim-light, hsl(220, 10%, 62%));
  }

  /* ── Compact mode ─────────────────────────────────────────────────────────── */

  .crypto-widget__compact-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 8px);
  }

  .crypto-widget__compact-item {
    display: flex;
    align-items: baseline;
    gap: var(--space-3, 12px);
  }

  .crypto-widget__compact-price {
    font-size: var(--text-sm, 0.875rem);
    color: var(--starlight, hsl(220, 15%, 90%));
    font-variant-numeric: tabular-nums;
    flex: 1;
    text-align: right;
  }

  /* ── Empty state ──────────────────────────────────────────────────────────── */

  .crypto-widget__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-5, 24px);
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-size: var(--text-sm, 0.875rem);
  }
</style>
