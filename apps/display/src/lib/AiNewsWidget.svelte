<script lang="ts">
  import type { AiNewsSummary } from '@lensing/types';

  export let summaries: AiNewsSummary[] = [];
  /** How many headlines to show at once */
  export let pageSize: number = 5;
  /** Seconds between page rotations (0 = no auto-rotate) */
  export let rotateSeconds: number = 30;

  let pageIndex = 0;
  let timer: ReturnType<typeof setInterval> | undefined;

  $: totalPages = Math.max(1, Math.ceil(summaries.length / pageSize));

  // Reset page when summaries change
  $: if (summaries) pageIndex = 0;

  $: page = summaries.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  function nextPage() {
    pageIndex = (pageIndex + 1) % totalPages;
  }

  function prevPage() {
    pageIndex = (pageIndex - 1 + totalPages) % totalPages;
  }

  // Auto-rotate — restart timer when config changes
  $: {
    if (timer !== undefined) clearInterval(timer);
    timer = undefined;
    if (rotateSeconds > 0 && totalPages > 1) {
      timer = setInterval(nextPage, rotateSeconds * 1000);
    }
  }

  function formatAge(published: number): string {
    const ageMs = Math.max(0, Date.now() - published);
    const ageMin = Math.floor(ageMs / 60_000);
    if (ageMin < 60) return `${ageMin}m ago`;
    const ageHr = Math.floor(ageMin / 60);
    if (ageHr < 24) return `${ageHr}h ago`;
    return `${Math.floor(ageHr / 24)}d ago`;
  }
</script>

<div class="ai-news">
  {#if summaries.length === 0}
    <div class="ai-news__empty">
      <span>No AI summaries available</span>
    </div>
  {:else}
    <ul class="ai-news__list">
      {#each page as item (item.id)}
        <li class="ai-news__item">
          <div class="ai-news__meta">
            <span class="ai-news__category">{item.category}</span>
            <span class="ai-news__source">{item.source}</span>
            <span class="ai-news__age">{formatAge(item.published)}</span>
          </div>
          <p class="ai-news__title">{item.title}</p>
          <p class="ai-news__summary">{item.summary}</p>
        </li>
      {/each}
    </ul>

    {#if totalPages > 1}
      <div class="ai-news__pager">
        <button class="ai-news__pager-btn" on:click={prevPage} aria-label="Previous page">&lsaquo;</button>
        <span class="ai-news__pager-info">{pageIndex + 1} / {totalPages}</span>
        <button class="ai-news__pager-btn" on:click={nextPage} aria-label="Next page">&rsaquo;</button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .ai-news {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--event-horizon, hsl(240, 6%, 7%));
    border-radius: var(--radius-md, 8px);
    padding: var(--space-4, 16px);
    box-shadow: 0 0 0 1px var(--edge, hsla(220, 10%, 50%, 0.12));
    color: var(--starlight, hsl(220, 15%, 90%));
    overflow: hidden;
  }

  .ai-news__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 12px);
    flex: 1;
    overflow: hidden;
  }

  .ai-news__item {
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 4px);
    padding-bottom: var(--space-3, 12px);
    border-bottom: 1px solid var(--edge-soft, hsla(220, 10%, 50%, 0.07));
  }

  .ai-news__item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .ai-news__meta {
    display: flex;
    align-items: center;
    gap: var(--space-2, 8px);
    flex-wrap: wrap;
  }

  .ai-news__category {
    font-size: var(--text-xs, 0.75rem);
    font-weight: var(--weight-medium, 500);
    color: var(--ember, hsl(28, 85%, 55%));
    letter-spacing: var(--tracking-wide, 0.04em);
    text-transform: uppercase;
  }

  .ai-news__source {
    font-size: var(--text-xs, 0.75rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
  }

  .ai-news__age {
    font-size: var(--text-xs, 0.75rem);
    color: var(--faint-light, hsl(220, 8%, 42%));
    margin-left: auto;
  }

  .ai-news__title {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-semi, 600);
    color: var(--starlight, hsl(220, 15%, 90%));
    line-height: var(--leading-tight, 1.2);
    margin: 0;
  }

  .ai-news__summary {
    font-size: var(--text-xs, 0.75rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
    line-height: var(--leading-normal, 1.5);
    margin: 0;
  }

  /* Pager */
  .ai-news__pager {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3, 12px);
    padding-top: var(--space-3, 12px);
    border-top: 1px solid var(--edge-soft, hsla(220, 10%, 50%, 0.07));
  }

  .ai-news__pager-btn {
    background: none;
    border: 1px solid var(--edge, hsla(220, 10%, 50%, 0.12));
    border-radius: var(--radius-sm, 4px);
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-size: var(--text-base, 1rem);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .ai-news__pager-btn:hover {
    color: var(--starlight, hsl(220, 15%, 90%));
    border-color: var(--ember, hsl(28, 85%, 55%));
  }

  .ai-news__pager-info {
    font-size: var(--text-xs, 0.75rem);
    color: var(--faint-light, hsl(220, 8%, 42%));
    font-family: var(--font-mono, monospace);
  }

  /* Empty state */
  .ai-news__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: var(--space-5, 24px);
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-size: var(--text-sm, 0.875rem);
  }
</style>
