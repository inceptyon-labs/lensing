<script lang="ts">
  import type { PluginHealthReport } from '@lensing/types';

  interface Props {
    plugins: PluginHealthReport[];
    expanded?: string | null;
  }

  let { plugins = [], expanded = $state(null) }: Props = $props();

  function toggleExpanded(pluginId: string) {
    expanded = expanded === pluginId ? null : pluginId;
  }

  function formatTime(isoString: string): string {
    const date = new Date(isoString);
    if (!Number.isFinite(date.getTime())) return '--:--:--';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
</script>

{#if plugins.length > 0}
  <div
    class="dev-tools-panel fixed bottom-6 right-6 max-h-96 max-w-sm bg-event-horizon border border-edge rounded-md overflow-y-auto"
  >
    <div class="sticky top-0 bg-accretion border-b border-edge-soft p-3 z-10">
      <p class="text-sm text-starlight font-semi">Developer Tools</p>
    </div>

    <div>
      {#each plugins as plugin (plugin.pluginId)}
        <div class="border-b border-edge-soft">
          <!-- Header -->
          <button
            onclick={() => toggleExpanded(plugin.pluginId)}
            class="w-full p-3 text-left hover:bg-accretion transition-colors flex items-center justify-between"
          >
            <span class="text-sm text-dim-light">{plugin.pluginId}</span>
            <span class="text-xs text-faint-light">{expanded === plugin.pluginId ? '−' : '+'}</span>
          </button>

          <!-- Expanded Content -->
          {#if expanded === plugin.pluginId}
            <div class="bg-singularity p-3 space-y-2 border-t border-edge-soft">
              <!-- Timing Info -->
              <div>
                <p class="text-xs text-faint-light mb-1">Refresh Timing</p>
                <p class="text-xs text-dim-light">Last: {formatTime(plugin.lastRefreshAt)}</p>
                <p class="text-xs text-dim-light">Next: {formatTime(plugin.nextRefreshAt)}</p>
                <p class="text-xs text-dim-light">Total: {plugin.refreshCount} runs</p>
              </div>

              <!-- Resource Usage -->
              <div>
                <p class="text-xs text-faint-light mb-1">Resource Usage</p>
                <p class="text-xs text-dim-light">CPU: {plugin.resourceUsage.cpuMs}ms</p>
                <p class="text-xs text-dim-light">
                  Memory: {(plugin.resourceUsage.memoryBytes / (1024 * 1024)).toFixed(1)}MB
                </p>
              </div>

              <!-- Error Log -->
              {#if plugin.errors.length > 0}
                <div>
                  <p class="text-xs text-alert-urgent mb-1">Errors ({plugin.errors.length})</p>
                  <ul class="space-y-1 max-h-32 overflow-y-auto">
                    {#each plugin.errors as error}
                      <li class="text-xs text-faint-light bg-event-horizon p-1 rounded">{error}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  :global(.bg-event-horizon) {
    background-color: hsl(240, 6%, 7%);
  }

  :global(.bg-accretion) {
    background-color: hsl(240, 5%, 10%);
  }

  :global(.bg-singularity) {
    background-color: hsl(240, 4%, 13%);
  }

  :global(.border-edge) {
    border-color: hsla(220, 10%, 50%, 0.12);
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

  :global(.text-alert-urgent) {
    color: hsl(0, 60%, 55%);
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

  :global(.transition-colors) {
    transition: background-color 100ms cubic-bezier(0.16, 1, 0.3, 1);
  }
</style>
