<script lang="ts">
  import type { WordOfDayData } from '@lensing/types';

  export let data: WordOfDayData | null = null;
</script>

<div class="wotd">
  {#if !data}
    <div class="wotd__empty">
      <span>No word available</span>
    </div>
  {:else}
    <div class="wotd__word">{data.word}</div>
    {#if data.partOfSpeech}
      <span class="wotd__pos">{data.partOfSpeech}</span>
    {/if}
    <p class="wotd__definition">{data.definition}</p>
  {/if}
</div>

<style>
  .wotd {
    padding: var(--space-4, 16px);
    color: var(--starlight, hsl(220, 15%, 90%));
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 8px);
    height: 100%;
    justify-content: center;
  }

  .wotd__word {
    font-size: var(--text-2xl, 2rem);
    font-weight: var(--weight-bold, 700);
    color: var(--starlight, hsl(220, 15%, 90%));
    letter-spacing: var(--tracking-tight, -0.02em);
    line-height: 1.1;
  }

  .wotd__pos {
    font-family: var(--font-mono);
    font-size: var(--text-xs, 0.75rem);
    color: var(--ember, hsl(25, 90%, 55%));
    font-style: italic;
    letter-spacing: var(--tracking-wide, 0.04em);
  }

  .wotd__definition {
    font-size: var(--text-sm, 0.875rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
    line-height: 1.5;
    margin: 0;
  }

  .wotd__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-size: var(--text-sm, 0.875rem);
  }
</style>
