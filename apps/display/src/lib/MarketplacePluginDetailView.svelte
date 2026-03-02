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

  type InstallStatus = 'idle' | 'installing' | 'done' | 'error';
  let installStatus: InstallStatus = 'idle';
  let installError = '';
  let showConfirm = false;

  // Reset install state when plugin changes (component reuse)
  let _trackedId = plugin.id;
  $: if (plugin.id !== _trackedId) {
    _trackedId = plugin.id;
    installStatus = 'idle';
    installError = '';
    showConfirm = false;
  }

  async function handleInstall() {
    if (!onInstall || installStatus === 'installing') return;
    installStatus = 'installing';
    installError = '';
    try {
      await onInstall(plugin);
      installStatus = 'done';
    } catch (err) {
      installError = err instanceof Error ? err.message : 'Install failed';
      installStatus = 'error';
    }
  }

  function requestUpdate() {
    showConfirm = true;
  }

  function cancelUpdate() {
    showConfirm = false;
  }

  async function confirmUpdate() {
    showConfirm = false;
    await handleInstall();
  }
</script>

<div class="detail-view">
  <div class="detail-header">
    <button class="back-btn" on:click={onBack} aria-label="Back"> ← Back </button>
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
            <span class="connector-badge"
              >{CONNECTOR_LABELS[plugin.connectorType] ?? plugin.connectorType}</span
            >
          </div>
        {/if}
      </div>

      <p class="plugin-description">{plugin.description}</p>

      <div class="install-area">
        {#if plugin.installed && !plugin.updateAvailable && installStatus === 'idle'}
          <span class="installed-badge">Installed</span>
        {:else if plugin.installed && plugin.updateAvailable && installStatus === 'idle' && !showConfirm}
          {#if plugin.installedVersion}
            <span class="version-comparison">{plugin.installedVersion} → {plugin.version}</span>
          {/if}
          <button
            class="install-btn install-btn--update"
            on:click={requestUpdate}
            aria-label="Update"
          >
            Update
          </button>
        {:else if plugin.installed && plugin.updateAvailable && installStatus === 'idle' && showConfirm}
          <p class="update-confirm-msg">
            Update will replace widget template. Config will be preserved.
          </p>
          <button class="install-btn" on:click={confirmUpdate} aria-label="Confirm">Confirm</button>
          <button
            class="install-btn install-btn--cancel"
            on:click={cancelUpdate}
            aria-label="Cancel">Cancel</button
          >
        {:else if installStatus === 'installing'}
          <button class="install-btn install-btn--progress" disabled aria-label="Installing">
            Installing…
          </button>
        {:else if installStatus === 'done'}
          <span class="installed-badge">Installed</span>
        {:else}
          <button class="install-btn" on:click={handleInstall} aria-label="Install">
            Install
          </button>
        {/if}

        {#if installStatus === 'error' && installError}
          <p class="install-error">{installError}</p>
        {/if}
      </div>
    </div>
  </div>
</div>
