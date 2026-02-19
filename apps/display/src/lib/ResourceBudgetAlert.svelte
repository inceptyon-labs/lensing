<script lang="ts">
  import type { ResourceBudgetViolation } from '@lensing/types';

  interface Props {
    violations: ResourceBudgetViolation[];
  }

  const { violations = [] }: Props = $props();

  function getViolationSeverity(violation: ResourceBudgetViolation): string {
    if (violation.limit <= 0) return 'info';
    const ratio = violation.actual / violation.limit;
    if (!Number.isFinite(ratio)) return 'info';
    if (ratio >= 1.5) return 'critical';
    if (ratio >= 1.2) return 'warning';
    return 'info';
  }

  function getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'hsl(0, 60%, 55%)';
      case 'warning':
        return 'hsl(38, 65%, 50%)';
      default:
        return 'hsl(210, 50%, 55%)';
    }
  }

  function formatViolationType(type: string): string {
    return type
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  function formatValue(value: number): string {
    if (!Number.isFinite(value) || value < 0) return '0';
    if (value < 1000) return value.toFixed(0);
    if (value < 1000000) return (value / 1000).toFixed(1) + 'K';
    if (value < 1000000000) return (value / 1000000).toFixed(1) + 'M';
    return (value / 1000000000).toFixed(1) + 'B';
  }

  function formatTime(isoString: string): string {
    const date = new Date(isoString);
    if (!Number.isFinite(date.getTime())) return '--:--';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
</script>

{#if violations.length > 0}
  <div
    class="resource-budget-alerts fixed bottom-24 right-6 max-h-48 max-w-sm space-y-2 overflow-y-auto"
  >
    {#each violations as violation (`${violation.pluginId}|${violation.violationType}|${violation.timestamp}`)}
      {@const severity = getViolationSeverity(violation)}
      <div
        class="alert-card bg-event-horizon border-l-2 rounded-md p-3"
        style="border-left-color: {getSeverityColor(severity)}"
      >
        <div class="flex items-start justify-between mb-2">
          <div>
            <p class="text-sm font-semi" style="color: {getSeverityColor(severity)}">
              {violation.pluginId}
            </p>
            <p class="text-xs text-dim-light">{formatViolationType(violation.violationType)}</p>
          </div>
          <p class="text-xs text-faint-light">{formatTime(violation.timestamp)}</p>
        </div>

        <div class="flex items-center gap-4 text-xs">
          <div>
            <p class="text-faint-light">Limit</p>
            <p class="text-starlight font-semi">{formatValue(violation.limit)}</p>
          </div>
          <div class="text-faint-light">→</div>
          <div>
            <p class="text-faint-light">Actual</p>
            <p class="text-starlight font-semi" style="color: {getSeverityColor(severity)}">
              {formatValue(violation.actual)}
            </p>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  :global(.bg-event-horizon) {
    background-color: hsl(240, 6%, 7%);
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
</style>
