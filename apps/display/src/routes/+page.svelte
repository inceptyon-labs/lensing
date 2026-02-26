<script lang="ts">
  import { onMount } from 'svelte';
  import type { PluginAdminEntry } from '@lensing/types';
  import type { DataBusMessage, WsMessage } from '@lensing/types';
  import DashboardGrid from '../lib/grid/DashboardGrid.svelte';
  import { handlePluginData } from '../lib/stores/dataBusStore';

  let plugins: PluginAdminEntry[] = [];

  async function loadPlugins() {
    // eslint-disable-next-line no-undef
    const res = await fetch('/plugins');
    if (!res.ok) return;
    plugins = (await res.json()) as PluginAdminEntry[];
  }

  /**
   * After a widget config save, reload plugin metadata.
   * Widget data updates arrive automatically via the data bus → WebSocket
   * pipeline (the server broadcasts plugin_data when modules publish).
   */
  function handleConfigSaved(): void {
    void loadPlugins();
  }

  onMount(() => {
    void loadPlugins();

    // eslint-disable-next-line no-undef
    const wsProto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    // eslint-disable-next-line no-undef
    const ws = new WebSocket(`${wsProto}//${location.host}/ws`);

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

<DashboardGrid
  plugins={plugins}
  allPlugins={plugins}
  onconfigsaved={handleConfigSaved}
/>
<a href="/admin" class="admin-link">Admin</a>

<style>
  .admin-link {
    position: fixed;
    top: var(--space-2);
    right: var(--space-2);
    z-index: 100;
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
