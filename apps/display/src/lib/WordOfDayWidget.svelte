<script lang="ts">
  import { onMount, tick } from 'svelte';
  import type { WordOfDayData } from '@lensing/types';

  export let data: WordOfDayData | null = null;

  const MIN_SCALE = 0.7;
  // eslint-disable-next-line no-undef
  let root: HTMLDivElement | undefined;
  // eslint-disable-next-line no-undef
  let definitionEl: HTMLParagraphElement | undefined;
  let scale = 1;
  let clamp = 'none';
  let fitRun = 0;

  function overflowing(): boolean {
    if (!root || !definitionEl) return false;
    return (
      root.scrollHeight > root.clientHeight ||
      definitionEl.scrollHeight > definitionEl.clientHeight + 1
    );
  }

  // Shrink the definition until it fits its grid cell
  async function fitText() {
    const run = ++fitRun;
    scale = 1;
    clamp = 'none';
    await tick();
    while (run === fitRun && overflowing() && scale > MIN_SCALE) {
      scale = Math.round((scale - 0.05) * 100) / 100;
      await tick();
    }
    // Still too tall at the smallest size: end the definition with an ellipsis
    if (run === fitRun && definitionEl && overflowing()) {
      // eslint-disable-next-line no-undef
      const lineHeight = parseFloat(getComputedStyle(definitionEl).lineHeight);
      clamp = String(Math.max(1, Math.floor(definitionEl.clientHeight / lineHeight)));
    }
  }

  $: if (data) void fitText();

  onMount(() => {
    if (!root || typeof ResizeObserver === 'undefined') return;
    // eslint-disable-next-line no-undef
    const observer = new ResizeObserver(() => void fitText());
    observer.observe(root);
    return () => observer.disconnect();
  });
</script>

<div class="wotd" bind:this={root} style:--wotd-scale={scale} style:--wotd-clamp={clamp}>
  {#if !data}
    <div class="wotd__empty">
      <span>No word available</span>
    </div>
  {:else}
    <div class="wotd__word">{data.word}</div>
    {#if data.partOfSpeech}
      <span class="wotd__pos">{data.partOfSpeech}</span>
    {/if}
    <p class="wotd__definition" bind:this={definitionEl}>{data.definition}</p>
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
    /* safe: when content overflows, align to the top so the word is never clipped */
    justify-content: safe center;
    overflow: hidden;
  }

  .wotd__word {
    font-size: var(--text-2xl, 2rem);
    font-weight: var(--weight-bold, 700);
    color: var(--starlight, hsl(220, 15%, 90%));
    letter-spacing: var(--tracking-tight, -0.02em);
    line-height: 1.1;
    flex-shrink: 0;
    overflow-wrap: anywhere;
  }

  .wotd__pos {
    font-family: var(--font-mono);
    font-size: var(--text-xs, 0.75rem);
    color: var(--ember, hsl(25, 90%, 55%));
    font-style: italic;
    letter-spacing: var(--tracking-wide, 0.04em);
  }

  .wotd__definition {
    font-size: calc(var(--text-sm, 0.875rem) * var(--wotd-scale, 1));
    color: var(--dim-light, hsl(220, 10%, 62%));
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--wotd-clamp, none);
    overflow: hidden;
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
