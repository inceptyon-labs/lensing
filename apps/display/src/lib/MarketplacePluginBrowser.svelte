<script lang="ts">
  import type { MarketplacePlugin } from '@lensing/types';
  import MarketplacePluginDetailView from './MarketplacePluginDetailView.svelte';

  export let plugins: MarketplacePlugin[] | null = null;
  export let loading = false;
  export let onInstall: ((plugin: MarketplacePlugin) => Promise<void>) | undefined = undefined;

  let selectedPlugin: MarketplacePlugin | null = null;
  let searchTerm = '';
  let debouncedSearchTerm = '';
  let activeCategory = 'All';
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function openDetail(plugin: MarketplacePlugin) {
    selectedPlugin = plugin;
  }

  function closeDetail() {
    selectedPlugin = null;
  }

  function onSearchInput(e: Event) {
    searchTerm = (e.target as HTMLInputElement).value;
    if (debounceTimer !== null) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debouncedSearchTerm = searchTerm;
      debounceTimer = null;
    }, 300);
  }

  function clearSearch() {
    searchTerm = '';
    debouncedSearchTerm = '';
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  }

  function selectCategory(cat: string) {
    activeCategory = cat;
  }

  $: categories = ['All', ...new Set((plugins ?? []).map((p) => p.category))];
  $: filteredPlugins = (plugins ?? []).filter((p) => {
    const q = debouncedSearchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
</script>

<div class="marketplace-browser">
  {#if selectedPlugin}
    <MarketplacePluginDetailView plugin={selectedPlugin} onBack={closeDetail} {onInstall} />
  {:else}
    <div class="mp-controls">
      <div class="mp-search-row">
        <input
          type="text"
          class="mp-search-input"
          placeholder="Search plugins..."
          value={searchTerm}
          on:input={onSearchInput}
          aria-label="Search plugins"
        />
        {#if searchTerm}
          <button class="mp-chip-clear" aria-label="×" on:click={clearSearch}>×</button>
        {/if}
      </div>
      <div class="mp-categories">
        {#each categories as cat (cat)}
          <button
            class="mp-category-btn"
            class:active={activeCategory === cat}
            on:click={() => selectCategory(cat)}
          >
            {cat}
          </button>
        {/each}
      </div>
    </div>
    <div class="mp-result-count">
      {filteredPlugins.length}
      {filteredPlugins.length === 1 ? 'plugin' : 'plugins'}
    </div>
    {#if loading}
      <p class="mp-state">Loading…</p>
    {:else if !plugins || filteredPlugins.length === 0}
      <p class="mp-state">No plugins found</p>
    {:else}
      <div class="plugin-grid">
        {#each filteredPlugins as plugin (plugin.id)}
          <button class="plugin-card" on:click={() => openDetail(plugin)}>
            {#if plugin.thumbnail}
              <img class="card-thumbnail" src={plugin.thumbnail} alt="{plugin.name} thumbnail" />
            {:else}
              <div class="card-thumbnail-placeholder">🔌</div>
            {/if}
            <span class="plugin-card-name">{plugin.name}</span>
            <span class="plugin-card-author">{plugin.author}</span>
            <span class="plugin-card-category">{plugin.category}</span>
            {#if plugin.updateAvailable}
              <span class="plugin-card-badge">Update</span>
            {:else if plugin.installed}
              <span class="plugin-card-installed">Installed</span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  {/if}
</div>
