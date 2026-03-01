<script lang="ts">
  import type { MarketplacePlugin } from '@lensing/types';

  export let plugin: MarketplacePlugin;
  export let onBack: () => void = () => {};
  export let onInstall: ((plugin: MarketplacePlugin) => Promise<void>) | undefined = undefined;

  const CONNECTOR_LABELS: Record<string, string> = {
    'json-api': 'JSON API',
    rss: 'RSS',
    static: 'Static',
  };
</script>

<div class="detail-view">
  <div class="detail-header">
    <button class="back-btn" on:click={onBack} aria-label="Back">
      ← Back
    </button>
  </div>

  <div class="detail-body">
    <div class="detail-media">
      {#if plugin.thumbnail}
        <img src={plugin.thumbnail} alt={plugin.name} class="thumbnail" />
      {:else}
        <div class="thumbnail-placeholder" aria-hidden="true">
          <span>◻</span>
        </div>
      {/if}
    </div>

    <div class="detail-content">
      <div class="detail-meta">
        <h2 class="plugin-name">{plugin.name}</h2>
        <div class="meta-row">
          <span class="meta-label">Author</span>
          <span class="meta-value">{plugin.author}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Version</span>
          <span class="meta-value">{plugin.version}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Category</span>
          <span class="mp-badge">{plugin.category}</span>
        </div>
        {#if plugin.connectorType}
          <div class="meta-row">
            <span class="meta-label">Connector</span>
            <span class="connector-badge">{CONNECTOR_LABELS[plugin.connectorType] ?? plugin.connectorType}</span>
          </div>
        {/if}
      </div>

      <p class="plugin-description">{plugin.description}</p>

      <div class="install-area">
        {#if plugin.installed && !plugin.updateAvailable}
          <span class="installed-badge">Installed</span>
        {:else if plugin.installed && plugin.updateAvailable}
          <button class="install-btn install-btn--update" on:click={() => onInstall?.(plugin)} aria-label="Update">
            Update
          </button>
        {:else}
          <button class="install-btn" on:click={() => onInstall?.(plugin)} aria-label="Install">
            Install
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>
