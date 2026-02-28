<script lang="ts">
  import { onMount } from 'svelte';
  import type { PluginAdminEntry } from '@lensing/types';
  import { ZONE_NAMES } from './config.ts';
  import { MODULE_GROUPS } from './admin-module-groups.ts';
  import AdminPluginCard from './AdminPluginCard.svelte';
  import AdminConfigModal from './AdminConfigModal.svelte';
  import AdminPluginUpload from './AdminPluginUpload.svelte';
  import AdminTabBar from './AdminTabBar.svelte';
  import AdminModuleSection from './AdminModuleSection.svelte';
  import AdminSettingsPanel from './AdminSettingsPanel.svelte';

  let plugins: PluginAdminEntry[] = [];
  let loading = true;
  let error: string | null = null;
  let activeTab: 'modules' | 'plugins' | 'marketplace' | 'settings' = 'modules';
  let marketplaceCount: number = 0;

  /** Track which plugins have been saved since last restart */
  let dirtyIds = new Set<string>();

  /** Plugin currently being configured in the modal */
  let configPlugin: PluginAdminEntry | null = null;

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

  onMount(async () => {
    try {
      // eslint-disable-next-line no-undef
      const res = await fetch('/plugins');
      if (!res.ok) throw new Error(`Failed to load plugins (${res.status})`);
      plugins = (await res.json()) as PluginAdminEntry[];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading = false;
    }
  });

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

  async function handleZoneChange(id: string, zone: string | undefined) {
    try {
      if (zone !== undefined && !ZONE_NAMES.includes(zone as (typeof ZONE_NAMES)[number])) {
        throw new Error('Invalid zone selected');
      }
      // eslint-disable-next-line no-undef
      const res = await fetch(`/plugins/${encodeURIComponent(id)}/zone`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone: zone ?? null }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      plugins = plugins.map((p) =>
        p.plugin_id === id ? { ...p, zone: zone as PluginAdminEntry['zone'] } : p
      );
      error = null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to change plugin zone';
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
</script>

<div class="plugin-list">
  <AdminTabBar {activeTab} onTabChange={(tab) => (activeTab = tab)} {marketplaceCount} />

  {#if loading}
    <p class="state-message">Loading plugins…</p>
  {:else if error}
    <p class="state-message state-message--error">Error: {error}</p>
  {:else if activeTab === 'modules'}
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
                onZoneChange={handleZoneChange}
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
    <AdminPluginUpload onInstalled={refreshPlugins} />

    {#if thirdParty.length === 0}
      <p class="state-message">No third-party plugins installed.</p>
    {:else}
      <div class="plugins-grid">
        {#each thirdParty as plugin (plugin.plugin_id)}
          <AdminPluginCard
            {plugin}
            onToggleEnabled={handleToggleEnabled}
            onZoneChange={handleZoneChange}
            onConfigSave={handleConfigSave}
          />
        {/each}
      </div>
    {/if}
  {:else if activeTab === 'marketplace'}
    <div class="marketplace-placeholder">
      <p class="state-message">Marketplace coming soon.</p>
    </div>
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

  {#if configPlugin}
    <AdminConfigModal
      plugin={configPlugin}
      onSave={handleModalSave}
      onClose={() => (configPlugin = null)}
    />
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

  .state-message--error {
    color: var(--nova);
  }
</style>
