<script lang="ts">
  import { onMount } from 'svelte';
  import type {
    DisplayCapabilities,
    DisplaySettings,
    PluginAdminEntry,
    RotationValue,
  } from '@lensing/types';
  import AdminPluginCard from './AdminPluginCard.svelte';
  import AdminConfigModal from './AdminConfigModal.svelte';

  export let plugins: PluginAdminEntry[] = [];
  export let onConfigSave: (
    id: string,
    config: Record<string, string | number | boolean>
  ) => void | Promise<void> = () => {};
  export let onToggleEnabled: (id: string, enabled: boolean) => void = () => {};
  export let onRestart: ((id: string) => Promise<void>) | undefined = undefined;
  export let onRefreshPlugins: () => Promise<void> = async () => {};
  export let dirtyIds: Set<string> = new Set();

  let capabilities: DisplayCapabilities | null = null;
  let settings: DisplaySettings = {};
  let loading = true;
  let error: string | null = null;

  /** Per-control save feedback */
  let savedFeedback: Record<string, boolean> = {};

  /** Marketplace settings */
  let marketplaceRepoUrl = 'lensing-marketplace';
  let gitHubToken = '';
  let marketplaceLoading = false;
  let marketplaceError: string | null = null;

  /** Plugin currently being configured in the modal */
  let configPlugin: PluginAdminEntry | null = null;

  $: pirPlugin = plugins.find((p) => p.plugin_id === 'pir');

  onMount(async () => {
    try {
      const [capsRes, settingsRes, marketplaceRes] = await Promise.all([
        fetch('/display/capabilities'),
        fetch('/display/settings'),
        fetch('/api/admin/marketplace'),
      ]);
      if (capsRes.ok) {
        capabilities = (await capsRes.json()) as DisplayCapabilities;
      }
      if (settingsRes.ok) {
        settings = (await settingsRes.json()) as DisplaySettings;
      }
      if (marketplaceRes.ok) {
        const marketplaceData = (await marketplaceRes.json()) as { marketplaceRepoUrl: string };
        marketplaceRepoUrl = marketplaceData.marketplaceRepoUrl;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load display settings';
    } finally {
      loading = false;
    }
  });

  function showSaved(key: string) {
    savedFeedback = { ...savedFeedback, [key]: true };
    setTimeout(() => {
      savedFeedback = { ...savedFeedback, [key]: false };
    }, 1500);
  }

  async function handleBrightnessChange(e: Event) {
    const value = parseInt((e.target as HTMLInputElement).value, 10);
    try {
      const res = await fetch('/display/brightness', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      settings = { ...settings, brightness: value };
      showSaved('brightness');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to set brightness';
    }
  }

  async function handleContrastChange(e: Event) {
    const value = parseInt((e.target as HTMLInputElement).value, 10);
    try {
      const res = await fetch('/display/contrast', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      settings = { ...settings, contrast: value };
      showSaved('contrast');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to set contrast';
    }
  }

  let persistRotation = false;

  async function handleRotationChange(e: Event) {
    const value = parseInt((e.target as HTMLSelectElement).value, 10) as RotationValue;
    try {
      const res = await fetch('/display/rotation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, persistent: persistRotation }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      settings = { ...settings, rotation: value };
      showSaved('rotation');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to set rotation';
    }
  }

  async function handleModalSave(config: Record<string, string | number | boolean>) {
    if (!configPlugin) return;
    const id = configPlugin.plugin_id;
    await onConfigSave(id, config);
    if (onRestart) await onRestart(id);
    await onRefreshPlugins();
  }

  async function handleMarketplaceSave() {
    if (!gitHubToken.trim() || !marketplaceRepoUrl.trim()) {
      marketplaceError = 'Both GitHub token and repository URL are required';
      return;
    }
    marketplaceLoading = true;
    marketplaceError = null;
    try {
      const res = await fetch('/api/admin/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gitHubToken,
          marketplaceRepoUrl,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json() as { error?: string };
        throw new Error(errorData.error || `Server returned ${res.status}`);
      }
      showSaved('marketplace');
      gitHubToken = '';
    } catch (err) {
      marketplaceError = err instanceof Error ? err.message : 'Failed to save marketplace settings';
    } finally {
      marketplaceLoading = false;
    }
  }
</script>

<div class="settings-panel">
  {#if loading}
    <p class="state-message">Loading settings…</p>
  {:else if error}
    <p class="state-message state-message--error">Error: {error}</p>
  {:else}
    <section class="settings-section">
      <h3 class="section-title">Display</h3>

      <div class="control-row" class:control-row--disabled={!capabilities?.brightness.available}>
        <div class="control-label">
          <span>Brightness</span>
          {#if capabilities?.brightness.available}
            <span class="control-method">via {capabilities.brightness.method}</span>
          {:else}
            <span class="control-unavailable">unavailable</span>
          {/if}
        </div>
        <div class="control-input">
          <input
            type="range"
            min="0"
            max="100"
            value={settings.brightness ?? 50}
            on:change={handleBrightnessChange}
            class="slider"
            disabled={!capabilities?.brightness.available}
          />
          <span class="control-value">{settings.brightness ?? 50}%</span>
          {#if savedFeedback['brightness']}
            <span class="saved-badge">Saved</span>
          {/if}
        </div>
        {#if !capabilities?.brightness.available && capabilities?.brightness.reason}
          <p class="control-reason">{capabilities.brightness.reason}</p>
        {/if}
      </div>

      <div class="control-row" class:control-row--disabled={!capabilities?.contrast.available}>
        <div class="control-label">
          <span>Contrast</span>
          {#if capabilities?.contrast.available}
            <span class="control-method">via {capabilities.contrast.method}</span>
          {:else}
            <span class="control-unavailable">unavailable</span>
          {/if}
        </div>
        <div class="control-input">
          <input
            type="range"
            min="0"
            max="100"
            value={settings.contrast ?? 50}
            on:change={handleContrastChange}
            class="slider"
            disabled={!capabilities?.contrast.available}
          />
          <span class="control-value">{settings.contrast ?? 50}%</span>
          {#if savedFeedback['contrast']}
            <span class="saved-badge">Saved</span>
          {/if}
        </div>
        {#if !capabilities?.contrast.available && capabilities?.contrast.reason}
          <p class="control-reason">{capabilities.contrast.reason}</p>
        {/if}
      </div>

      <div class="control-row" class:control-row--disabled={!capabilities?.rotation.available}>
        <div class="control-label">
          <span>Rotation</span>
          {#if capabilities?.rotation.available}
            <span class="control-method">via {capabilities.rotation.method}</span>
          {:else}
            <span class="control-unavailable">unavailable</span>
          {/if}
        </div>
        <div class="control-input">
          <select
            value={settings.rotation ?? 0}
            on:change={handleRotationChange}
            class="rotation-select"
            disabled={!capabilities?.rotation.available}
          >
            <option value={0}>0° (Normal)</option>
            <option value={90}>90° (Left)</option>
            <option value={180}>180° (Inverted)</option>
            <option value={270}>270° (Right)</option>
          </select>
          <label class="persist-label">
            <input
              type="checkbox"
              bind:checked={persistRotation}
              disabled={!capabilities?.rotation.available}
            />
            Persist across reboot
          </label>
          {#if savedFeedback['rotation']}
            <span class="saved-badge">Saved</span>
          {/if}
        </div>
        {#if !capabilities?.rotation.available && capabilities?.rotation.reason}
          <p class="control-reason">{capabilities.rotation.reason}</p>
        {/if}
      </div>
    </section>

    {#if pirPlugin}
      <section class="settings-section">
        <h3 class="section-title">Motion Sensor</h3>
        <div class="pir-card">
          <AdminPluginCard
            plugin={pirPlugin}
            {onToggleEnabled}
            onZoneChange={() => {}}
            {onConfigSave}
            {onRestart}
            onConfigure={(p) => (configPlugin = p)}
            configDirty={dirtyIds.has(pirPlugin.plugin_id)}
          />
        </div>
      </section>
    {/if}

    <section class="settings-section">
      <h3 class="section-title">Marketplace</h3>

      <p class="section-description">
        Configure your GitHub token to publish plugins to the marketplace.
        <a href="https://github.com/settings/tokens" target="_blank" rel="noopener">
          Create a token at github.com/settings/tokens
        </a>
        with <code>public_repo</code> scope.
      </p>

      {#if marketplaceError}
        <div class="error-message">{marketplaceError}</div>
      {/if}

      <div class="control-row">
        <div class="control-label">
          <span>GitHub Token</span>
        </div>
        <div class="control-input">
          <input
            type="password"
            bind:value={gitHubToken}
            placeholder="ghp_..."
            class="marketplace-input"
            disabled={marketplaceLoading}
          />
        </div>
      </div>

      <div class="control-row">
        <div class="control-label">
          <span>Marketplace Repository</span>
        </div>
        <div class="control-input">
          <input
            type="text"
            bind:value={marketplaceRepoUrl}
            placeholder="lensing-marketplace"
            class="marketplace-input"
            disabled={marketplaceLoading}
          />
          <span class="control-hint">Default: lensing-marketplace</span>
        </div>
      </div>

      <div class="control-row">
        <button
          on:click={handleMarketplaceSave}
          disabled={marketplaceLoading || !gitHubToken.trim() || !marketplaceRepoUrl.trim()}
          class="save-button"
        >
          {marketplaceLoading ? 'Saving...' : 'Save'}
        </button>
        {#if savedFeedback['marketplace']}
          <span class="saved-badge">Saved</span>
        {/if}
      </div>
    </section>
  {/if}

  {#if configPlugin}
    <AdminConfigModal
      plugin={configPlugin}
      onSave={handleModalSave}
      onClose={() => (configPlugin = null)}
    />
  {/if}
</div>

<style>
  .settings-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .settings-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .section-title {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    font-family: var(--font-mono);
    color: var(--starlight);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
  }

  .control-row {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-3);
    background: var(--glass-bg);
    border: 1px solid var(--edge);
    border-radius: var(--radius-md);
  }

  .control-row--disabled {
    opacity: 0.5;
  }

  .control-label {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--starlight);
  }

  .control-method {
    font-size: var(--text-xs);
    color: var(--dim-light);
  }

  .control-unavailable {
    font-size: var(--text-xs);
    color: var(--dim);
    font-style: italic;
  }

  .control-reason {
    margin: 0;
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    color: var(--dim);
  }

  .control-input {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .slider {
    flex: 1;
    accent-color: var(--ember);
    cursor: pointer;
  }

  .slider:disabled {
    cursor: not-allowed;
    accent-color: var(--dim);
  }

  .control-value {
    min-width: 3ch;
    text-align: right;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--dim-light);
  }

  .rotation-select {
    background: var(--deep-space);
    color: var(--starlight);
    border: 1px solid var(--edge);
    border-radius: var(--radius-sm);
    padding: var(--space-1) var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    cursor: pointer;
  }

  .rotation-select:disabled {
    cursor: not-allowed;
    color: var(--dim);
  }

  .persist-label {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--dim-light);
    cursor: pointer;
  }

  .saved-badge {
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    color: var(--nebula);
    animation: fade-in 0.15s ease-out;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .pir-card {
    max-width: 400px;
  }

  .state-message {
    color: var(--dim-light);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    padding: var(--space-4);
    text-align: center;
  }

  .state-message--error {
    color: var(--nova);
  }
</style>
