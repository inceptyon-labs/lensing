<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { NewsArticle } from '@lensing/types';

  export let headlines: NewsArticle[] = [];
  export let maxItems: number = 5;
  export let compact: boolean = false;

  $: displayedHeadlines = headlines.slice(0, maxItems);

  let unsubscribe: (() => void) | null = null;

  onMount(() => {
    // Component is ready — consumers wire up store subscriptions externally
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  function formatAge(published: number): string {
    const ageMs = Date.now() - published;
    const ageMin = Math.floor(ageMs / 60_000);
    if (ageMin < 60) return `${ageMin}m ago`;
    const ageHr = Math.floor(ageMin / 60);
    if (ageHr < 24) return `${ageHr}h ago`;
    return `${Math.floor(ageHr / 24)}d ago`;
  }
</script>

<div class="news-headlines" class:news-headlines--compact={compact}>
  {#if displayedHeadlines.length === 0}
    <div class="news-headlines__empty">
      <span>No headlines available</span>
    </div>
  {:else if compact}
    <ul class="news-headlines__compact-list">
      {#each displayedHeadlines as article (article.id)}
        <li class="news-headlines__compact-item">
          <span class="news-headlines__category-badge">{article.category}</span>
          <span class="news-headlines__compact-title">{article.title}</span>
          <span class="news-headlines__age">{formatAge(article.published)}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <ul class="news-headlines__list">
      {#each displayedHeadlines as article (article.id)}
        <li class="news-headlines__item">
          <div class="news-headlines__meta">
            <span class="news-headlines__category-badge">{article.category}</span>
            <span class="news-headlines__source">{article.source}</span>
            <span class="news-headlines__age">{formatAge(article.published)}</span>
          </div>
          <p class="news-headlines__title">{article.title}</p>
          {#if article.summary}
            <p class="news-headlines__summary">{article.summary}</p>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .news-headlines {
    background: var(--event-horizon, hsl(240, 6%, 7%));
    border-radius: var(--radius-md, 8px);
    padding: var(--space-4, 16px);
    box-shadow: 0 0 0 1px var(--edge, hsla(220, 10%, 50%, 0.12));
    color: var(--starlight, hsl(220, 15%, 90%));
  }

  .news-headlines__list,
  .news-headlines__compact-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 12px);
  }

  .news-headlines__item {
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 4px);
    padding-bottom: var(--space-3, 12px);
    border-bottom: 1px solid var(--edge-soft, hsla(220, 10%, 50%, 0.07));
  }

  .news-headlines__item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .news-headlines__meta {
    display: flex;
    align-items: center;
    gap: var(--space-2, 8px);
    flex-wrap: wrap;
  }

  .news-headlines__category-badge {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    color: var(--ember, hsl(28, 85%, 55%));
    letter-spacing: var(--tracking-wide, 0.04em);
    text-transform: uppercase;
  }

  .news-headlines__source {
    font-size: var(--text-sm, 0.875rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
  }

  .news-headlines__age {
    font-size: var(--text-sm, 0.875rem);
    color: var(--faint-light, hsl(220, 8%, 42%));
    margin-left: auto;
  }

  .news-headlines__title {
    font-size: var(--text-base, 1rem);
    font-weight: var(--weight-semi, 600);
    color: var(--starlight, hsl(220, 15%, 90%));
    line-height: var(--leading-tight, 1.2);
    margin: 0;
  }

  .news-headlines__summary {
    font-size: var(--text-sm, 0.875rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
    line-height: var(--leading-normal, 1.5);
    margin: 0;
  }

  /* Compact mode */
  .news-headlines__compact-item {
    display: flex;
    align-items: baseline;
    gap: var(--space-2, 8px);
    overflow: hidden;
  }

  .news-headlines__compact-title {
    font-size: var(--text-sm, 0.875rem);
    color: var(--starlight, hsl(220, 15%, 90%));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  /* Empty state */
  .news-headlines__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-5, 24px);
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-size: var(--text-sm, 0.875rem);
  }
</style>
