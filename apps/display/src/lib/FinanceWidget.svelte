<script lang="ts">
  import type { StockQuote } from '@lensing/types';
  import Sparkline from './Sparkline.svelte';

  export let stocks: StockQuote[] = [];
  export let show1h: boolean = false;
  export let show24h: boolean = true;
  export let show7d: boolean = false;
  export let showSparkline: boolean = true;

  type Period = { key: '1h' | '24h' | '7d'; label: string };

  $: periods = [
    show1h && { key: '1h' as const, label: '1H' },
    show24h && { key: '24h' as const, label: '24H' },
    show7d && { key: '7d' as const, label: '7D' },
  ].filter(Boolean) as Period[];

  function getChange(stock: StockQuote, key: '1h' | '24h' | '7d'): number {
    if (key === '1h') return stock.change_1h;
    if (key === '7d') return stock.change_7d;
    return stock.change_24h;
  }

  function getSparklineData(stock: StockQuote): number[] {
    return stock.sparkline.length > 0 ? stock.sparkline : [];
  }

  function formatPrice(price: number): string {
    if (price >= 1000)
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1)
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 });
  }

  function formatChange(pct: number): string {
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(2)}%`;
  }

  function changeClass(pct: number): string {
    if (pct > 0) return 'finance-widget__change--positive';
    if (pct < 0) return 'finance-widget__change--negative';
    return 'finance-widget__change--neutral';
  }
</script>

<div class="finance-widget">
  {#if stocks.length === 0}
    <div class="finance-widget__empty">
      <span>No stock data available</span>
    </div>
  {:else}
    <div class="finance-widget__list">
      {#each stocks as stock (stock.symbol)}
        {@const sparkData = getSparklineData(stock)}
        <div class="finance-widget__row">
          <div class="finance-widget__info">
            <span class="finance-widget__symbol">{stock.symbol}</span>
            <span class="finance-widget__name">{stock.name}</span>
          </div>
          {#if showSparkline && sparkData.length >= 2}
            <div class="finance-widget__chart">
              <Sparkline data={sparkData} width={80} height={28} positive={stock.change_24h >= 0} />
            </div>
          {/if}
          <div class="finance-widget__values">
            <span class="finance-widget__price">${formatPrice(stock.price)}</span>
            <div class="finance-widget__changes">
              {#each periods as period (period.key)}
                {@const change = getChange(stock, period.key)}
                <span class="finance-widget__change {changeClass(change)}" title="{period.label} change">
                  <span class="finance-widget__change-label">{period.label}</span>
                  {formatChange(change)}
                </span>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .finance-widget {
    background: var(--event-horizon, hsl(240, 6%, 7%));
    border: 1px solid var(--edge, hsla(220, 10%, 50%, 0.12));
    border-radius: var(--radius-md, 8px);
    padding: var(--space-4, 16px);
    box-shadow: 0 0 0 1px var(--edge, hsla(220, 10%, 50%, 0.12));
    color: var(--starlight, hsl(220, 15%, 90%));
    overflow-x: auto;
  }

  /* ── List layout ───────────────────────────────────────────────────────── */

  .finance-widget__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 8px);
  }

  .finance-widget__row {
    display: flex;
    align-items: center;
    gap: var(--space-3, 12px);
    padding-bottom: var(--space-2, 8px);
    border-bottom: 1px solid var(--edge-soft, hsla(220, 10%, 50%, 0.07));
  }

  .finance-widget__row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .finance-widget__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 4rem;
    flex: 1;
  }

  .finance-widget__symbol {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-semi, 600);
    color: var(--ember, hsl(28, 85%, 55%));
    letter-spacing: var(--tracking-wide, 0.04em);
  }

  .finance-widget__name {
    font-size: var(--text-xs, 0.75rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 8rem;
  }

  .finance-widget__chart {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 60px;
  }

  .finance-widget__values {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    flex-shrink: 0;
  }

  .finance-widget__price {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-semi, 600);
    color: var(--starlight, hsl(220, 15%, 90%));
    font-variant-numeric: tabular-nums;
  }

  /* ── Change indicators ─────────────────────────────────────────────────── */

  .finance-widget__changes {
    display: flex;
    gap: var(--space-2, 8px);
  }

  .finance-widget__change {
    font-size: var(--text-xs, 0.75rem);
    font-weight: var(--weight-medium, 500);
    font-variant-numeric: tabular-nums;
    display: flex;
    align-items: baseline;
    gap: 2px;
  }

  .finance-widget__change-label {
    font-size: 0.6rem;
    color: var(--faint-light, hsl(220, 10%, 42%));
    letter-spacing: var(--tracking-wide, 0.04em);
  }

  .finance-widget__change--positive {
    color: var(--alert-success, hsl(160, 45%, 45%));
  }

  .finance-widget__change--negative {
    color: var(--alert-urgent, hsl(0, 60%, 55%));
  }

  .finance-widget__change--neutral {
    color: var(--dim-light, hsl(220, 10%, 62%));
  }

  /* ── Empty state ───────────────────────────────────────────────────────── */

  .finance-widget__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-5, 24px);
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-size: var(--text-sm, 0.875rem);
  }
</style>
