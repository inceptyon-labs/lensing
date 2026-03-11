<script lang="ts">
  import { browser } from '$app/environment';
  import type {
    PluginAdminEntry,
    MarketplacePlugin,
    MarketplaceListResponse,
  } from '@lensing/types';
  import { MODULE_GROUPS } from './admin-module-groups.ts';
  import AdminPluginCard from './AdminPluginCard.svelte';
  import AdminConfigModal from './AdminConfigModal.svelte';
  import AdminPluginUpload from './AdminPluginUpload.svelte';
  import AdminPluginSecrets from './AdminPluginSecrets.svelte';
  import AdminTabBar from './AdminTabBar.svelte';
  import AdminModuleSection from './AdminModuleSection.svelte';
  import AdminSettingsPanel from './AdminSettingsPanel.svelte';
  import MarketplacePluginBrowser from './MarketplacePluginBrowser.svelte';
  import AdminBuilderView from './AdminBuilderView.svelte';

  let plugins: PluginAdminEntry[] = [];
  let loading = true;
  let error: string | null = null;
  let activeTab: 'modules' | 'plugins' | 'marketplace' | 'settings' = 'modules';
  let marketplaceCount: number = 0;
  let activeView: 'list' | 'builder' = 'list';
  let editingPluginId: string | null = null;

  let marketplacePlugins: MarketplacePlugin[] | null = null;
  let marketplaceLoading = false;
  let marketplaceLoadFailed = false;

  /** Track which plugins have been saved since last restart */
  let dirtyIds = new Set<string>();

  /** Plugin currently being configured in the modal */
  let configPlugin: PluginAdminEntry | null = null;

  /** Plugin currently managing secrets */
  let secretsPlugin: PluginAdminEntry | null = null;
  let secretNames: string[] = [];

  /** PIR lives in the Settings tab, not Modules */
  const SETTINGS_ONLY_IDS = new Set(['pir']);
  $: builtins = plugins.filter(
    (p) => p.builtin && p.manifest.config_schema && !SETTINGS_ONLY_IDS.has(p.plugin_id)
  );
  $: thirdParty = plugins.filter((p) => !p.builtin);

  /** Group built-in plugins by MODULE_GROUPS; ungrouped go into "Other" */
  $: groupedBuiltins = (() => {
    const groups = MODULE_GROUPS.map((group) => ({
      label: group.label,
      plugins: group.ids
        .map((id) => builtins.find((p) => p.plugin_id === id))
        .filter((p): p is PluginAdminEntry => !!p),
    })).filter((g) => g.plugins.length > 0);

    const knownIds = new Set(MODULE_GROUPS.flatMap((g) => g.ids));
    const ungrouped = builtins.filter((p) => !knownIds.has(p.plugin_id));
    if (ungrouped.length > 0) {
      groups.push({ label: 'Other', plugins: ungrouped });
    }
    return groups;
  })();

  if (browser) {
    void (async () => {
      try {
        const res = await fetch('/plugins');
        if (!res.ok) throw new Error(`Failed to load plugins (${res.status})`);
        plugins = (await res.json()) as PluginAdminEntry[];
      } catch (err) {
        error = err instanceof Error ? err.message : 'Unknown error';
      } finally {
        loading = false;
      }
    })();
  }

  async function fetchMarketplace() {
    if (marketplacePlugins !== null || marketplaceLoading) return; // already loaded or in progress
    marketplaceLoading = true;
    marketplaceLoadFailed = false;
    try {
      // eslint-disable-next-line no-undef
      const res = await fetch('/marketplace');
      if (!res.ok) throw new Error(`Failed to load marketplace (${res.status})`);
      const data = (await res.json()) as MarketplaceListResponse;
      marketplacePlugins = data.plugins;
      marketplaceCount = data.total;
    } catch {
      marketplaceLoadFailed = true; // allow retry on next tab visit
    } finally {
      marketplaceLoading = false;
    }
  }

  async function handleMarketplaceInstall(plugin: MarketplacePlugin) {
    // eslint-disable-next-line no-undef
    const res = await fetch(`/marketplace/${encodeURIComponent(plugin.id)}/install`, {
      method: 'POST',
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? `Install failed (${res.status})`);
    }
    await refreshPlugins();
  }

  $: if (activeTab === 'marketplace') {
    fetchMarketplace();
  }

  async function handleToggleEnabled(id: string, enabled: boolean) {
    try {
      // eslint-disable-next-line no-undef
      const res = await fetch(`/plugins/${encodeURIComponent(id)}/enabled`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      plugins = plugins.map((p) => (p.plugin_id === id ? { ...p, enabled } : p));
      error = null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to toggle plugin';
    }
  }

  async function refreshPlugins() {
    try {
      // eslint-disable-next-line no-undef
      const res = await fetch('/plugins');
      if (!res.ok) throw new Error(`Failed to load plugins (${res.status})`);
      plugins = (await res.json()) as PluginAdminEntry[];
      error = null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
    }
  }

  async function handleConfigSave(id: string, config: Record<string, string | number | boolean>) {
    try {
      // eslint-disable-next-line no-undef
      const res = await fetch(`/plugins/${encodeURIComponent(id)}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      plugins = plugins.map((p) => (p.plugin_id === id ? { ...p, config } : p));
      dirtyIds = new Set([...dirtyIds, id]);
      error = null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to save config';
    }
  }

  async function handleRestart(id: string) {
    // eslint-disable-next-line no-undef
    const res = await fetch(`/modules/${encodeURIComponent(id)}/restart`, { method: 'POST' });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? `Server returned ${res.status}`);
    }
    dirtyIds = new Set([...dirtyIds].filter((d) => d !== id));
  }

  /** Save config + auto-restart for the modal flow */
  async function handleModalSave(config: Record<string, string | number | boolean>) {
    if (!configPlugin) return;
    const id = configPlugin.plugin_id;
    await handleConfigSave(id, config);
    await handleRestart(id);
    // Refresh the plugin list so the badge updates
    await refreshPlugins();
  }

  async function handleManageSecrets(plugin: PluginAdminEntry) {
    try {
      const res = await fetch(`/plugins/${encodeURIComponent(plugin.plugin_id)}/secrets`);
      if (!res.ok) throw new Error(`Failed to load secrets (${res.status})`);
      secretNames = (await res.json()) as string[];
    } catch {
      // Fallback to manifest-declared secrets
      secretNames = plugin.manifest.permissions?.secrets ?? [];
    }
    secretsPlugin = plugin;
  }

  async function handleSaveSecrets(secrets: Record<string, string>) {
    if (!secretsPlugin) return;
    const id = secretsPlugin.plugin_id;
    const errors: string[] = [];
    for (const [key, value] of Object.entries(secrets)) {
      if (!value) continue; // skip empty
      try {
        const res = await fetch(
          `/plugins/${encodeURIComponent(id)}/secrets/${encodeURIComponent(key)}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value }),
          }
        );
        if (!res.ok) throw new Error(`Failed to save ${key} (${res.status})`);
      } catch (err) {
        errors.push(err instanceof Error ? err.message : `Failed to save ${key}`);
      }
    }
    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }
  }

  function handleEditPlugin(plugin: PluginAdminEntry) {
    editingPluginId = plugin.plugin_id;
    activeView = 'builder';
  }

  /** Plugin pending delete confirmation */
  let deleteTarget: PluginAdminEntry | null = null;
  let deleting = false;

  async function handleDeletePlugin() {
    if (!deleteTarget) return;
    deleting = true;
    try {
      const res = await fetch(`/plugins/${encodeURIComponent(deleteTarget.plugin_id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Delete failed (${res.status})`);
      }
      deleteTarget = null;
      await refreshPlugins();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to delete plugin';
    } finally {
      deleting = false;
    }
  }
</script>

<div class="plugin-list">
  <AdminTabBar {activeTab} onTabChange={(tab) => (activeTab = tab)} {marketplaceCount} />

  {#if loading}
    <p class="state-message">Loading plugins…</p>
  {:else}
    {#if error}
      <div class="error-banner">
        <span>Error: {error}</span>
        <button class="error-dismiss" on:click={() => (error = null)}>Dismiss</button>
      </div>
    {/if}

    {#if activeTab === 'modules'}
      {#if builtins.length === 0}
        <p class="state-message">No built-in modules found.</p>
      {:else}
        <div class="modules-layout">
          {#each groupedBuiltins as group (group.label)}
            <AdminModuleSection label={group.label}>
              {#each group.plugins as plugin (plugin.plugin_id)}
                <AdminPluginCard
                  {plugin}
                  onToggleEnabled={handleToggleEnabled}
                  onConfigSave={handleConfigSave}
                  onRestart={plugin.builtin ? handleRestart : undefined}
                  onConfigure={(p) => (configPlugin = p)}
                  configDirty={dirtyIds.has(plugin.plugin_id)}
                />
              {/each}
            </AdminModuleSection>
          {/each}
        </div>
      {/if}
    {:else if activeTab === 'plugins'}
      {#if activeView === 'builder'}
        <AdminBuilderView
          editPluginId={editingPluginId}
          onCancel={() => {
            activeView = 'list';
            editingPluginId = null;
          }}
          onSaved={() => {
            activeView = 'list';
            editingPluginId = null;
            refreshPlugins();
          }}
        />
      {:else}
        <div class="plugins-header">
          <button type="button" class="create-plugin-btn" on:click={() => (activeView = 'builder')}
            >Create Plugin</button
          >
        </div>

        <AdminPluginUpload onInstalled={refreshPlugins} />

        {#if thirdParty.length === 0}
          <p class="state-message">No third-party plugins installed.</p>
        {:else}
          <div class="plugins-grid">
            {#each thirdParty as plugin (plugin.plugin_id)}
              <AdminPluginCard
                {plugin}
                onToggleEnabled={handleToggleEnabled}
                onConfigSave={handleConfigSave}
                onManageSecrets={handleManageSecrets}
                onEdit={handleEditPlugin}
                onDelete={(p) => (deleteTarget = p)}
              />
            {/each}
          </div>
        {/if}
      {/if}
    {:else if activeTab === 'marketplace'}
      <MarketplacePluginBrowser
        plugins={marketplacePlugins}
        loading={marketplaceLoading}
        onInstall={handleMarketplaceInstall}
      />
    {:else if activeTab === 'settings'}
      <AdminSettingsPanel
        {plugins}
        onConfigSave={handleConfigSave}
        onToggleEnabled={handleToggleEnabled}
        onRestart={handleRestart}
        onRefreshPlugins={refreshPlugins}
        {dirtyIds}
      />
    {/if}
  {/if}

  {#if configPlugin}
    <AdminConfigModal
      plugin={configPlugin}
      onSave={handleModalSave}
      onClose={() => (configPlugin = null)}
    />
  {/if}

  {#if secretsPlugin}
    <AdminPluginSecrets
      plugin={secretsPlugin}
      {secretNames}
      onSave={handleSaveSecrets}
      onClose={() => (secretsPlugin = null)}
    />
  {/if}

  {#if deleteTarget}
    <div class="confirm-overlay" on:click={() => (deleteTarget = null)} on:keydown={() => {}}>
      <div class="confirm-dialog" on:click|stopPropagation on:keydown|stopPropagation>
        <p class="confirm-text">
          Delete <strong>{deleteTarget.manifest.name}</strong>? This removes all plugin files,
          config, and secrets. This cannot be undone.
        </p>
        <div class="confirm-actions">
          <button
            class="confirm-btn confirm-btn--cancel"
            disabled={deleting}
            on:click={() => (deleteTarget = null)}
          >
            Cancel
          </button>
          <button
            class="confirm-btn confirm-btn--delete"
            disabled={deleting}
            on:click={handleDeletePlugin}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .plugin-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .modules-layout {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .plugins-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: var(--space-4);
  }

  .state-message {
    color: var(--dim-light);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    padding: var(--space-4);
    text-align: center;
  }

  .error-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background-color: color-mix(in srgb, var(--nova) 10%, var(--void));
    border: 1px solid color-mix(in srgb, var(--nova) 30%, transparent);
    border-radius: var(--radius-sm);
    color: var(--nova);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
  }

  .error-dismiss {
    background: none;
    border: 1px solid color-mix(in srgb, var(--nova) 40%, transparent);
    border-radius: var(--radius-sm);
    color: var(--nova);
    font-size: var(--text-xs);
    padding: var(--space-1) var(--space-2);
    cursor: pointer;
    white-space: nowrap;
  }

  .error-dismiss:hover {
    background-color: color-mix(in srgb, var(--nova) 20%, transparent);
  }

  .plugins-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: var(--space-2);
  }

  .create-plugin-btn {
    background-color: var(--ember);
    color: var(--void);
    border: 1px solid var(--ember);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    padding: var(--space-2) var(--space-4);
    cursor: pointer;
    font-family: var(--font-sans);
    transition:
      background-color var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out);
  }

  .create-plugin-btn:hover {
    background-color: var(--ember-dim);
    border-color: var(--ember-dim);
  }

  .create-plugin-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--edge-focus);
  }

  .confirm-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: hsla(240, 8%, 4%, 0.75);
    z-index: 200;
  }

  .confirm-dialog {
    background-color: var(--accretion);
    border: 1px solid var(--edge-bright);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .confirm-text {
    font-size: var(--text-sm);
    color: var(--dim-light);
    line-height: var(--leading-normal);
    margin: 0;
  }

  .confirm-actions {
    display: flex;
    gap: var(--space-3);
    justify-content: flex-end;
  }

  .confirm-btn {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .confirm-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .confirm-btn--cancel {
    background-color: transparent;
    color: var(--dim-light);
    border: 1px solid var(--edge);
  }

  .confirm-btn--cancel:hover:not(:disabled) {
    color: var(--starlight);
    border-color: var(--edge-bright);
  }

  .confirm-btn--delete {
    background-color: color-mix(in srgb, var(--nova) 15%, var(--void));
    color: var(--nova);
    border: 1px solid color-mix(in srgb, var(--nova) 40%, transparent);
  }

  .confirm-btn--delete:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--nova) 25%, var(--void));
  }
</style>
