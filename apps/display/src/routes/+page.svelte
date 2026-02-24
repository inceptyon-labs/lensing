<script lang="ts">
  import { onMount } from 'svelte';
  import type { PluginAdminEntry } from '@lensing/types';
  import type { DataBusMessage, WsMessage } from '@lensing/types';
  import Layout from '../lib/Layout.svelte';
  import Placeholder from '../lib/Placeholder.svelte';
  import ErrorBoundary from '../lib/ErrorBoundary.svelte';
  import PluginRenderer from '../lib/PluginRenderer.svelte';
  import { handlePluginData } from '../lib/stores/dataBusStore';

  type ZoneKey = 'top-bar' | 'left-col' | 'center' | 'right-col' | 'bottom-bar';

  let pluginsByZone: Record<ZoneKey, PluginAdminEntry[]> = {
    'top-bar': [],
    'left-col': [],
    center: [],
    'right-col': [],
    'bottom-bar': [],
  };

  async function loadPlugins() {
    // eslint-disable-next-line no-undef
    const res = await fetch('/plugins');
    if (!res.ok) return;
    const plugins = (await res.json()) as PluginAdminEntry[];
    const grouped: Record<ZoneKey, PluginAdminEntry[]> = {
      'top-bar': [],
      'left-col': [],
      center: [],
      'right-col': [],
      'bottom-bar': [],
    };
    for (const plugin of plugins) {
      if (plugin.enabled && plugin.zone && Object.hasOwn(grouped, plugin.zone)) {
        grouped[plugin.zone as ZoneKey].push(plugin);
      }
    }
    pluginsByZone = grouped;
  }

  onMount(() => {
    void loadPlugins();

    // eslint-disable-next-line no-undef
    const ws = new WebSocket(`ws://${location.host}`);
    ws.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(String(event.data)) as WsMessage;
        if (msg.type === 'layout_change') {
          void loadPlugins();
        } else if (msg.type === 'plugin_data') {
          handlePluginData(msg.payload as DataBusMessage);
        }
      } catch {
        // ignore malformed messages
      }
    });

    return () => {
      ws.close();
    };
  });
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Lensing Display</title>
</svelte:head>

<Layout>
  <svelte:fragment slot="top-bar">
    {#each pluginsByZone['top-bar'] as plugin (plugin.plugin_id)}
      <ErrorBoundary name={plugin.manifest.name}>
        <PluginRenderer {plugin} />
      </ErrorBoundary>
    {:else}
      <ErrorBoundary name="Status Bar">
        <Placeholder title="Status Bar" index={0} />
      </ErrorBoundary>
    {/each}
    <a href="/admin" class="admin-link">Admin</a>
  </svelte:fragment>

  <svelte:fragment slot="left-col">
    {#each pluginsByZone['left-col'] as plugin (plugin.plugin_id)}
      <ErrorBoundary name={plugin.manifest.name}>
        <PluginRenderer {plugin} />
      </ErrorBoundary>
    {:else}
      <ErrorBoundary name="Navigation">
        <Placeholder title="Navigation" index={0} />
      </ErrorBoundary>
      <ErrorBoundary name="Panel">
        <Placeholder title="Panel" index={1} />
      </ErrorBoundary>
      <ErrorBoundary name="Info">
        <Placeholder title="Info" index={2} />
      </ErrorBoundary>
    {/each}
  </svelte:fragment>

  <svelte:fragment slot="center">
    {#each pluginsByZone['center'] as plugin (plugin.plugin_id)}
      <ErrorBoundary name={plugin.manifest.name}>
        <PluginRenderer {plugin} />
      </ErrorBoundary>
    {:else}
      <ErrorBoundary name="Main View">
        <Placeholder title="Main View" index={0} />
      </ErrorBoundary>
      <ErrorBoundary name="Content">
        <Placeholder title="Content" index={1} />
      </ErrorBoundary>
      <ErrorBoundary name="Primary">
        <Placeholder title="Primary" index={2} />
      </ErrorBoundary>
      <ErrorBoundary name="Secondary">
        <Placeholder title="Secondary" index={3} />
      </ErrorBoundary>
      <ErrorBoundary name="Tertiary">
        <Placeholder title="Tertiary" index={4} />
      </ErrorBoundary>
      <ErrorBoundary name="Detail">
        <Placeholder title="Detail" index={5} />
      </ErrorBoundary>
    {/each}
  </svelte:fragment>

  <svelte:fragment slot="right-col">
    {#each pluginsByZone['right-col'] as plugin (plugin.plugin_id)}
      <ErrorBoundary name={plugin.manifest.name}>
        <PluginRenderer {plugin} />
      </ErrorBoundary>
    {:else}
      <ErrorBoundary name="Controls">
        <Placeholder title="Controls" index={0} />
      </ErrorBoundary>
      <ErrorBoundary name="Settings">
        <Placeholder title="Settings" index={1} />
      </ErrorBoundary>
      <ErrorBoundary name="Actions">
        <Placeholder title="Actions" index={2} />
      </ErrorBoundary>
    {/each}
  </svelte:fragment>

  <svelte:fragment slot="bottom-bar">
    {#each pluginsByZone['bottom-bar'] as plugin (plugin.plugin_id)}
      <ErrorBoundary name={plugin.manifest.name}>
        <PluginRenderer {plugin} />
      </ErrorBoundary>
    {:else}
      <ErrorBoundary name="Status">
        <Placeholder title="Status" index={0} />
      </ErrorBoundary>
    {/each}
  </svelte:fragment>
</Layout>

<style>
  .admin-link {
    font-size: var(--text-xs);
    color: var(--dim-light);
    text-decoration: none;
    font-family: var(--font-mono);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .admin-link:hover {
    color: var(--ember);
  }
</style>
