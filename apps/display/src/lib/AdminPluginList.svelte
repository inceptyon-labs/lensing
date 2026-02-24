<script lang="ts">
  import { onMount } from 'svelte';
  import type { PluginAdminEntry } from '@lensing/types';
  import { ZONE_NAMES } from './config.ts';
  import AdminPluginCard from './AdminPluginCard.svelte';

  let plugins: PluginAdminEntry[] = [];
  let loading = true;
  let error: string | null = null;

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
      error = null; // Clear error on success
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to toggle plugin';
    }
  }

  async function handleZoneChange(id: string, zone: string | undefined) {
    try {
      // Validate zone before sending
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
      error = null; // Clear error on success
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to change plugin zone';
    }
  }
</script>

<div class="plugin-list">
  {#if loading}
    <p class="state-message">Loading plugins…</p>
  {:else if error}
    <p class="state-message state-message--error">Error: {error}</p>
  {:else if plugins.length === 0}
    <p class="state-message">No plugins installed.</p>
  {:else}
    {#each plugins as plugin (plugin.plugin_id)}
      <AdminPluginCard
        {plugin}
        onToggleEnabled={handleToggleEnabled}
        onZoneChange={handleZoneChange}
      />
    {/each}
  {/if}
</div>

<style>
  .plugin-list {
    display: flex;
    flex-direction: column;
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
