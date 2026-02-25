<script lang="ts">
  import { FEED_PRESETS } from './news-feed-presets.ts';

  export let currentUrls: string;
  export let onUrlsChange: (urls: string) => void = () => {};

  /** Parse comma-separated URLs into a trimmed Set */
  function parseUrls(raw: string): Set<string> {
    return new Set(
      raw
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean)
    );
  }

  /** Rebuild comma-separated string preserving non-preset manual URLs */
  function buildUrlString(urls: Set<string>): string {
    return [...urls].join(', ');
  }

  function handleToggle(url: string, checked: boolean) {
    const urls = parseUrls(currentUrls);
    if (checked) {
      urls.add(url);
    } else {
      urls.delete(url);
    }
    onUrlsChange(buildUrlString(urls));
  }

  $: activeUrls = parseUrls(currentUrls);
</script>

<div class="presets">
  {#each FEED_PRESETS as category (category.label)}
    <div class="preset-category">
      <span class="category-label">{category.label}</span>
      {#each category.feeds as feed (feed.url)}
        <label class="preset-item">
          <input
            type="checkbox"
            class="preset-checkbox"
            checked={activeUrls.has(feed.url)}
            on:change={(e) => handleToggle(feed.url, e.currentTarget.checked)}
          />
          <span class="preset-label">{feed.label}</span>
        </label>
      {/each}
    </div>
  {/each}
</div>

<style>
  .presets {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding-top: var(--space-2);
  }

  .preset-category {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .category-label {
    font-size: var(--text-xs);
    color: var(--faint-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    font-weight: var(--weight-medium);
    padding-bottom: var(--space-1);
  }

  .preset-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
    padding: 2px 0;
  }

  .preset-checkbox {
    width: 16px;
    height: 16px;
    accent-color: var(--ember);
    cursor: pointer;
    flex-shrink: 0;
  }

  .preset-label {
    font-size: var(--text-sm);
    color: var(--dim-light);
  }

  .preset-item:hover .preset-label {
    color: var(--starlight);
  }
</style>
