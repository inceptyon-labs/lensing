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

  /** Set up a WebSocket listener that handles layout_change and plugin_data messages */
  function setupWsListener(ws: WebSocket): void {
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
  }

  let ws: WebSocket | null = null;
  let cleanupWs: (() => void) | null = null;

  function connectWs(): void {
    // eslint-disable-next-line no-undef
    const wsProto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    // eslint-disable-next-line no-undef
    const newWs = new WebSocket(`${wsProto}//${location.host}/ws`);
    setupWsListener(newWs);
    ws = newWs;
    cleanupWs = () => newWs.close();
  }

  /**
   * After a widget config save, reconnect WebSocket so the server pushes
   * the latest cached data bus state (which includes fresh module data).
   */
  function handleConfigSaved(): void {
    void loadPlugins();
    // Reconnect WebSocket to trigger server-side "connection" handler
    // which sends all cached data bus messages to the new client
    if (ws) {
      ws.close();
    }
    connectWs();
  }

  onMount(() => {
    void loadPlugins();
    connectWs();

    return () => {
      cleanupWs?.();
    };
  });
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Lensing Display</title>
</svelte:head>

<DashboardGrid
  plugins={plugins.filter((p) => p.enabled)}
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
