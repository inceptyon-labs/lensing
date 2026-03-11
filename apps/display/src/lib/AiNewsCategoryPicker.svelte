<script lang="ts">
  import { AI_NEWS_CATEGORIES } from '@lensing/types';

  export let currentCategories: string;
  export let onCategoriesChange: (categories: string) => void = () => {};

  function parseIds(raw: string): Set<string> {
    return new Set(
      raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }

  function handleToggle(id: string, checked: boolean) {
    const ids = parseIds(currentCategories);
    if (checked) {
      ids.add(id);
    } else {
      ids.delete(id);
    }
    onCategoriesChange([...ids].join(','));
  }

  $: activeIds = parseIds(currentCategories);
</script>

<div class="category-picker">
  {#each AI_NEWS_CATEGORIES as cat (cat.id)}
    <label class="category-item">
      <input
        type="checkbox"
        class="category-checkbox"
        checked={activeIds.has(cat.id)}
        on:change={(e) => handleToggle(cat.id, e.currentTarget.checked)}
      />
      <span class="category-label">{cat.label}</span>
      <span class="category-count">{cat.feeds.length} {cat.feeds.length === 1 ? 'feed' : 'feeds'}</span>
    </label>
  {/each}
</div>

<style>
  .category-picker {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding-top: var(--space-1);
  }

  .category-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
    padding: var(--space-1) 0;
  }

  .category-checkbox {
    width: 16px;
    height: 16px;
    accent-color: var(--ember);
    cursor: pointer;
    flex-shrink: 0;
  }

  .category-label {
    font-size: var(--text-sm);
    color: var(--dim-light);
  }

  .category-count {
    font-size: var(--text-xs);
    color: var(--faint-light);
    margin-left: auto;
  }

  .category-item:hover .category-label {
    color: var(--starlight);
  }
</style>
