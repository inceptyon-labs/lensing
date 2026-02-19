<script lang="ts">
  import type { ConnectivityStatus } from '@lensing/types';

  interface Props {
    status: ConnectivityStatus | null;
  }

  const { status = null }: Props = $props();

  function formatTime(isoString: string): string {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
</script>

{#if status}
  <div
    class="connectivity-indicator fixed bottom-6 left-6 bg-event-horizon border border-edge rounded-md p-3"
  >
    <div class="flex items-center gap-2">
      <div
        class="w-2 h-2 rounded-full"
        style="background-color: {status.online ? 'hsl(160, 45%, 45%)' : 'hsl(0, 60%, 55%)'}"
        title={status.online ? 'Online' : 'Offline'}
      />
      <p class="text-sm text-starlight">{status.online ? 'Online' : 'Offline'}</p>
    </div>

    {#if status.online}
      <p class="text-xs text-dim-light mt-1">{status.latencyMs}ms latency</p>
    {/if}

    <p class="text-xs text-faint-light mt-1">Last check: {formatTime(status.lastCheckAt)}</p>
  </div>
{/if}

<style>
  :global(.bg-event-horizon) {
    background-color: hsl(240, 6%, 7%);
  }

  :global(.border-edge) {
    border-color: hsla(220, 10%, 50%, 0.12);
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
</style>
