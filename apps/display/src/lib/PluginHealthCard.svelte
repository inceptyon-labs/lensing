<script lang="ts">
  import type { PluginHealthReport } from '@lensing/types';

  interface Props {
    health: PluginHealthReport | null;
  }

  const { health = null }: Props = $props();

  function getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'hsl(160, 45%, 45%)'; // alert-success
      case 'error':
        return 'hsl(0, 60%, 55%)'; // alert-urgent
      case 'disabled':
        return 'hsl(220, 8%, 42%)'; // faint-light
      default:
        return 'hsl(210, 50%, 55%)'; // alert-info
    }
  }

  function formatMemoryBytes(bytes: number): string {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }

  function formatTime(isoString: string): string {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
</script>

{#if health}
  <div
    class="plugin-health-card fixed left-6 top-20 max-w-xs bg-event-horizon border rounded-md p-4"
    style="border-color: {getStatusColor(health.status)}"
  >
    <div class="mb-3">
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm text-starlight font-semi">{health.pluginId}</p>
        <div
          class="w-2 h-2 rounded-full"
          style="background-color: {getStatusColor(health.status)}"
          title={health.status}
        />
      </div>

      {#if health.errorCount > 0}
        <p class="text-xs text-alert-urgent">
          {health.errorCount} error{health.errorCount !== 1 ? 's' : ''}
        </p>
      {/if}
    </div>

    <div class="space-y-2 mb-3">
      <div>
        <p class="text-xs text-faint-light">Last refresh</p>
        <p class="text-xs text-dim-light">{formatTime(health.lastRefreshAt)}</p>
      </div>

      <div>
        <p class="text-xs text-faint-light">Memory</p>
        <p class="text-xs text-dim-light">{formatMemoryBytes(health.resourceUsage.memoryBytes)}</p>
      </div>

      <div>
        <p class="text-xs text-faint-light">CPU</p>
        <p class="text-xs text-dim-light">{health.resourceUsage.cpuMs}ms</p>
      </div>

      <div>
        <p class="text-xs text-faint-light">Refreshes</p>
        <p class="text-xs text-dim-light">{health.refreshCount} total</p>
      </div>
    </div>

    {#if health.errors.length > 0}
      <div class="border-t border-edge-soft pt-2">
        <p class="text-xs text-alert-urgent mb-1">Latest errors:</p>
        <ul class="space-y-1">
          {#each health.errors.slice(0, 3) as error}
            <li class="text-xs text-faint-light">{error}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
{/if}

<style>
  :global(.bg-event-horizon) {
    background-color: hsl(240, 6%, 7%);
  }

  :global(.border-edge-soft) {
    border-color: hsla(220, 10%, 50%, 0.07);
  }

  :global(.text-starlight) {
    color: hsl(220, 15%, 90%);
  }

  :global(.text-dim-light) {
    color: hsl(220, 10%, 62%);
  }

  :global(.text-faint-light) {
    color: hsl(220, 8%, 42%);
  }

  :global(.rounded-md) {
    border-radius: 8px;
  }

  :global(.font-semi) {
    font-weight: 600;
  }

  :global(.space-y-2 > * + *) {
    margin-top: 8px;
  }

  :global(.space-y-1 > * + *) {
    margin-top: 4px;
  }

  :global(.alert-urgent) {
    color: hsl(0, 60%, 55%);
  }
</style>
