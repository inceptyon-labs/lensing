<script lang="ts">
  import type { PollenTrigger, PollenPeriod } from '@lensing/types';

  export let index: number = 0;
  export let level: string = 'Low';
  export let color: string = '#4caf50';
  export let location: string = '';
  export let triggers: PollenTrigger[] = [];
  export let periods: PollenPeriod[] = [];

  // Group triggers by plant type: { Tree: ["Juniper", "Oak"], Ragweed: ["Nettle"] }
  $: groupedTriggers = triggers.reduce<Record<string, string[]>>((acc, t) => {
    const key = t.plantType || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(t.name);
    return acc;
  }, {});

  function periodColor(idx: number): string {
    if (idx <= 2.4) return '#4caf50';
    if (idx <= 4.8) return '#8bc34a';
    if (idx <= 7.2) return '#ffeb3b';
    if (idx <= 9.6) return '#ff9800';
    return '#f44336';
  }

  $: gaugeWidth = `${Math.min(100, (index / 12) * 100)}%`;
</script>

<div class="allergies-widget">
  <div class="allergies-widget__header">
    <span class="allergies-widget__title">Pollen</span>
    <span class="allergies-widget__label" style="color: {color}">{level}</span>
  </div>

  {#if location}
    <div class="allergies-widget__location">{location}</div>
  {/if}

  <div class="allergies-widget__index-row">
    <span class="allergies-widget__index" style="color: {color}">{index.toFixed(1)}</span>
    <span class="allergies-widget__scale">/12</span>
  </div>

  <div class="allergies-widget__gauge">
    <div class="allergies-widget__bar" style="width: {gaugeWidth}; background: {color};"></div>
  </div>

  {#if triggers.length > 0}
    <div class="allergies-widget__triggers">
      {#each Object.entries(groupedTriggers) as [type, names] (type)}
        <span class="allergies-widget__trigger-chip">{type}: {names.join(', ')}</span>
      {/each}
    </div>
  {/if}

  {#if periods.length > 0}
    <div class="allergies-widget__forecast">
      {#each periods as period (period.type)}
        <div class="allergies-widget__period">
          <span class="allergies-widget__period-label">{period.type}</span>
          <span class="allergies-widget__period-index" style="color: {periodColor(period.index)}"
            >{period.index.toFixed(1)}</span
          >
        </div>
      {/each}
    </div>
  {:else}
    <div class="allergies-widget__empty">No pollen data available</div>
  {/if}
</div>

<style>
  .allergies-widget {
    background: var(--event-horizon, hsl(240, 6%, 7%));
    border: 1px solid var(--edge, hsla(220, 10%, 50%, 0.12));
    border-radius: var(--radius-md, 8px);
    padding: var(--space-4, 16px);
    box-shadow: 0 0 0 1px var(--edge, hsla(220, 10%, 50%, 0.12));
    color: var(--starlight, hsl(220, 15%, 90%));
  }

  .allergies-widget__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-1, 4px);
  }

  .allergies-widget__title {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    color: var(--dim-light, hsl(220, 10%, 62%));
    letter-spacing: var(--tracking-wide, 0.04em);
    text-transform: uppercase;
  }

  .allergies-widget__label {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-semi, 600);
    letter-spacing: var(--tracking-wide, 0.04em);
  }

  .allergies-widget__location {
    font-size: var(--text-xs, 0.75rem);
    color: var(--faint-light, hsl(220, 8%, 42%));
    margin-bottom: var(--space-2, 8px);
  }

  .allergies-widget__index-row {
    display: flex;
    align-items: baseline;
    gap: var(--space-1, 4px);
    margin-bottom: var(--space-2, 8px);
  }

  .allergies-widget__index {
    font-size: var(--text-2xl, 2rem);
    font-weight: var(--weight-bold, 700);
    line-height: var(--leading-tight, 1.2);
    letter-spacing: var(--tracking-tight, -0.02em);
    font-variant-numeric: tabular-nums;
  }

  .allergies-widget__scale {
    font-size: var(--text-base, 1rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
  }

  .allergies-widget__gauge {
    height: 4px;
    background: var(--edge-soft, hsla(220, 10%, 50%, 0.07));
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: var(--space-4, 16px);
  }

  .allergies-widget__bar {
    height: 100%;
    border-radius: 2px;
    transition:
      width 0.3s ease,
      background 0.3s ease;
  }

  .allergies-widget__triggers {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2, 8px);
    margin-bottom: var(--space-3, 12px);
  }

  .allergies-widget__trigger-chip {
    font-size: var(--text-xs, 0.75rem);
    color: var(--starlight, hsl(220, 15%, 90%));
    background: var(--edge-soft, hsla(220, 10%, 50%, 0.07));
    border: 1px solid var(--edge, hsla(220, 10%, 50%, 0.12));
    border-radius: var(--radius-sm, 4px);
    padding: var(--space-1, 4px) var(--space-2, 8px);
  }

  .allergies-widget__forecast {
    display: flex;
    gap: var(--space-3, 12px);
  }

  .allergies-widget__period {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1, 4px);
  }

  .allergies-widget__period-label {
    font-size: var(--text-xs, 0.75rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide, 0.04em);
  }

  .allergies-widget__period-index {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-semi, 600);
    font-variant-numeric: tabular-nums;
  }

  .allergies-widget__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-5, 24px);
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-size: var(--text-sm, 0.875rem);
  }
</style>
