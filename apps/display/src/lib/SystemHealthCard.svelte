<script lang="ts">
  import type { SystemHealthSnapshot } from '@lensing/types';

  interface Props {
    health: SystemHealthSnapshot | null;
  }

  const { health = null }: Props = $props();

  function getMetricColor(percent: number, thresholds = { warning: 70, critical: 85 }): string {
    if (percent >= thresholds.critical) return 'hsl(0, 60%, 55%)'; // alert-urgent
    if (percent >= thresholds.warning) return 'hsl(38, 65%, 50%)'; // alert-warning
    return 'hsl(160, 45%, 45%)'; // alert-success
  }

  function formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes < 0) return '0 KB';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    if (bytes < 1024 * 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(1) + ' TB';
  }

  function formatTime(isoString: string): string {
    const date = new Date(isoString);
    if (!Number.isFinite(date.getTime())) return '--:--:--';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  const memoryPercent = $derived(
    health && health.memoryTotalBytes > 0
      ? Math.min((health.memoryUsedBytes / health.memoryTotalBytes) * 100, 100)
      : 0
  );
  const diskPercent = $derived(
    health && health.diskTotalBytes > 0
      ? Math.min((health.diskUsedBytes / health.diskTotalBytes) * 100, 100)
      : 0
  );
</script>

{#if health}
  <div
    class="system-health-card fixed right-6 top-20 max-w-xs bg-event-horizon border border-edge rounded-md p-4"
  >
    <p class="text-lg text-starlight font-semi mb-4">System Health</p>

    <div class="space-y-3">
      <!-- CPU -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <p class="text-xs text-faint-light">CPU</p>
          <p class="text-xs font-semi" style="color: {getMetricColor(health.cpuPercent)}">
            {health.cpuPercent.toFixed(1)}%
          </p>
        </div>
        <div class="h-2 bg-control-bg rounded-sm overflow-hidden">
          <div
            class="h-full transition-all"
            style="width: {Math.min(health.cpuPercent, 100)}%; background-color: {getMetricColor(
              health.cpuPercent
            )}"
          />
        </div>
      </div>

      <!-- Memory -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <p class="text-xs text-faint-light">Memory</p>
          <p class="text-xs text-dim-light">
            {formatBytes(health.memoryUsedBytes)} / {formatBytes(health.memoryTotalBytes)}
          </p>
        </div>
        <div class="h-2 bg-control-bg rounded-sm overflow-hidden">
          <div
            class="h-full transition-all"
            style="width: {Math.min(memoryPercent, 100)}%; background-color: {getMetricColor(
              memoryPercent
            )}"
          />
        </div>
        <p class="text-xs text-faint-light mt-1">{memoryPercent.toFixed(1)}%</p>
      </div>

      <!-- Disk -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <p class="text-xs text-faint-light">Disk</p>
          <p class="text-xs text-dim-light">
            {formatBytes(health.diskUsedBytes)} / {formatBytes(health.diskTotalBytes)}
          </p>
        </div>
        <div class="h-2 bg-control-bg rounded-sm overflow-hidden">
          <div
            class="h-full transition-all"
            style="width: {Math.min(diskPercent, 100)}%; background-color: {getMetricColor(
              diskPercent
            )}"
          />
        </div>
        <p class="text-xs text-faint-light mt-1">{diskPercent.toFixed(1)}%</p>
      </div>

      <!-- Chromium Memory -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <p class="text-xs text-faint-light">Chromium</p>
          <p class="text-xs text-dim-light">{formatBytes(health.chromiumMemoryBytes)}</p>
        </div>
      </div>

      <!-- Timestamp -->
      <div class="border-t border-edge-soft pt-2">
        <p class="text-xs text-faint-light">Last update: {formatTime(health.timestamp)}</p>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.bg-event-horizon) {
    background-color: hsl(240, 6%, 7%);
  }

  :global(.border-edge) {
    border-color: hsla(220, 10%, 50%, 0.12);
  }

  :global(.border-edge-soft) {
    border-color: hsla(220, 10%, 50%, 0.07);
  }

  :global(.bg-control-bg) {
    background-color: hsl(240, 6%, 9%);
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

  :global(.rounded-sm) {
    border-radius: 4px;
  }

  :global(.font-semi) {
    font-weight: 600;
  }

  :global(.space-y-3 > * + *) {
    margin-top: 12px;
  }

  :global(.space-y-1 > * + *) {
    margin-top: 4px;
  }

  :global(.transition-all) {
    transition: width 200ms cubic-bezier(0.45, 0, 0.55, 1);
  }
</style>
