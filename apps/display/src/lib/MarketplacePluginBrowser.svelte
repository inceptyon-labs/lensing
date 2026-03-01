<script lang="ts">
  import type { MarketplacePlugin } from '@lensing/types';
  import MarketplacePluginDetailView from './MarketplacePluginDetailView.svelte';

  export let plugins: MarketplacePlugin[] | null = null;
  export let loading = false;
  export let onInstall: ((plugin: MarketplacePlugin) => Promise<void>) | undefined = undefined;

  let selectedPlugin: MarketplacePlugin | null = null;

  function openDetail(plugin: MarketplacePlugin) {
    selectedPlugin = plugin;
  }

  function closeDetail() {
    selectedPlugin = null;
  }
</script>

<div class="marketplace-browser">
  {#if selectedPlugin}
    <MarketplacePluginDetailView plugin={selectedPlugin} onBack={closeDetail} {onInstall} />
  {:else if loading}
    <p class="mp-state">Loading…</p>
  {:else if !plugins || plugins.length === 0}
    <p class="mp-state">No plugins found</p>
  {:else}
    <div class="plugin-grid">
      {#each plugins as plugin (plugin.id)}
        <button class="plugin-card" on:click={() => openDetail(plugin)}>
          <span class="plugin-card-name">{plugin.name}</span>
          <span class="plugin-card-author">{plugin.author}</span>
          <span class="plugin-card-category">{plugin.category}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
