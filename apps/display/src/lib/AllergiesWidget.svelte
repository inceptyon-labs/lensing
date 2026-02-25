<script lang="ts">
  import type { AllergenLevel } from '@lensing/types';

  export let index: number = 0;
  export let allergens: AllergenLevel[] = [];

  function severityLabel(idx: number): string {
    if (idx <= 0) return 'None';
    if (idx <= 1) return 'Low';
    if (idx <= 2) return 'Moderate';
    if (idx <= 3) return 'High';
    if (idx <= 4) return 'Very High';
    return 'Extreme';
  }

  function gaugeColor(idx: number): string {
    if (idx <= 1) return 'var(--alert-success, hsl(160, 45%, 45%))';
    if (idx <= 2) return 'var(--alert-warning, hsl(38, 65%, 50%))';
    return 'var(--alert-urgent, hsl(0, 60%, 55%))';
  }

  function levelColor(level: number): string {
    if (level <= 1) return 'var(--alert-success, hsl(160, 45%, 45%))';
    if (level <= 2) return 'var(--alert-warning, hsl(38, 65%, 50%))';
    return 'var(--alert-urgent, hsl(0, 60%, 55%))';
  }

  $: gaugeWidth = `${Math.min(100, (index / 5) * 100)}%`;
  $: currentGaugeColor = gaugeColor(index);
  $: label = severityLabel(index);
</script>

<div class="allergies-widget">
  <div class="allergies-widget__header">
    <span class="allergies-widget__title">Allergies</span>
    <span class="allergies-widget__label" style="color: {currentGaugeColor}">{label}</span>
  </div>

  <div class="allergies-widget__index-row">
    <span class="allergies-widget__index">{index}</span>
    <span class="allergies-widget__scale">/5</span>
  </div>

  <div class="allergies-widget__gauge">
    <div
      class="allergies-widget__bar"
      style="width: {gaugeWidth}; background: {currentGaugeColor};"
    ></div>
  </div>

  {#if allergens.length === 0}
    <div class="allergies-widget__empty">No allergy data available</div>
  {:else}
    <ul class="allergies-widget__list">
      {#each allergens as allergen (allergen.name)}
        <li class="allergies-widget__item">
          <span class="allergies-widget__allergen-name">{allergen.name}</span>
          <span class="allergies-widget__allergen-category">{allergen.category}</span>
          <span
            class="allergies-widget__allergen-level"
            style="color: {levelColor(allergen.level)}"
          >{allergen.level}</span>
        </li>
      {/each}
    </ul>
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
    margin-bottom: var(--space-3, 12px);
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
    transition: width 0.3s ease, background 0.3s ease;
  }

  .allergies-widget__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-5, 24px);
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-size: var(--text-sm, 0.875rem);
  }

  .allergies-widget__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 8px);
  }

  .allergies-widget__item {
    display: flex;
    align-items: center;
    gap: var(--space-3, 12px);
  }

  .allergies-widget__allergen-name {
    flex: 1;
    font-size: var(--text-sm, 0.875rem);
    color: var(--starlight, hsl(220, 15%, 90%));
  }

  .allergies-widget__allergen-category {
    font-size: var(--text-xs, 0.75rem);
    color: var(--faint-light, hsl(220, 8%, 42%));
    letter-spacing: var(--tracking-wide, 0.04em);
    text-transform: uppercase;
  }

  .allergies-widget__allergen-level {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-semi, 600);
    font-variant-numeric: tabular-nums;
    min-width: 1ch;
    text-align: right;
  }
</style>
