<script lang="ts">
  import type { PluginAdminEntry } from '@lensing/types';
  import { ZONE_NAMES } from './config.ts';

  export let plugin: PluginAdminEntry;
  export let onToggleEnabled: (id: string, enabled: boolean) => void = () => {};
  export let onZoneChange: (id: string, zone: string | undefined) => void = () => {};

  function handleToggle() {
    onToggleEnabled(plugin.plugin_id, !plugin.enabled);
  }

  // eslint-disable-next-line no-undef
  function handleZoneChange(e: Event) {
    // eslint-disable-next-line no-undef
    const val = (e.target as HTMLSelectElement).value;
    onZoneChange(plugin.plugin_id, val === '' ? undefined : val);
  }
</script>

<div class="plugin-card">
  <div class="card-header">
    <h3 class="plugin-name">{plugin.manifest.name}</h3>
    <span class="status status--{plugin.status}">{plugin.status}</span>
  </div>

  <div class="card-body">
    <div class="field">
      <label class="field-label" for="zone-{plugin.plugin_id}">Zone</label>
      <select
        id="zone-{plugin.plugin_id}"
        class="zone-select"
        value={plugin.zone ?? ''}
        on:change={handleZoneChange}
      >
        <option value="">— unassigned —</option>
        {#each ZONE_NAMES as zone (zone)}
          <option value={zone}>{zone}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="card-footer">
    <button
      class="toggle-btn toggle-btn--{plugin.enabled ? 'disable' : 'enable'}"
      on:click={handleToggle}
      aria-pressed={plugin.enabled}
    >
      {plugin.enabled ? 'Disable' : 'Enable'}
    </button>
  </div>
</div>

<style>
  .plugin-card {
    background-color: var(--event-horizon);
    border: 1px solid var(--edge);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    transition: box-shadow var(--duration-fast) var(--ease-out);
  }

  .plugin-card:hover {
    box-shadow:
      0 0 0 1px var(--edge-bright),
      0 0 20px var(--ember-trace);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
  }

  .plugin-name {
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
    color: var(--starlight);
    margin: 0;
  }

  .status {
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .status--active {
    background-color: color-mix(in srgb, var(--ember) 20%, transparent);
    color: var(--ember);
    border: 1px solid color-mix(in srgb, var(--ember) 40%, transparent);
  }

  .status--error {
    background-color: color-mix(in srgb, var(--nova) 20%, transparent);
    color: var(--nova);
    border: 1px solid color-mix(in srgb, var(--nova) 40%, transparent);
  }

  .status--inactive,
  .status--loading {
    background-color: color-mix(in srgb, var(--dim-light) 20%, transparent);
    color: var(--dim-light);
    border: 1px solid color-mix(in srgb, var(--dim-light) 40%, transparent);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .field-label {
    font-size: var(--text-xs);
    color: var(--dim-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .zone-select {
    background-color: var(--void);
    border: 1px solid var(--edge);
    border-radius: var(--radius-sm);
    color: var(--starlight);
    padding: var(--space-1) var(--space-2);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    cursor: pointer;
    width: 100%;
  }

  .zone-select:focus {
    outline: none;
    border-color: var(--ember);
    box-shadow: 0 0 0 2px var(--ember-trace);
  }

  .toggle-btn {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-sm);
    border: 1px solid var(--edge);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
    background-color: var(--void);
    color: var(--starlight);
  }

  .toggle-btn--disable {
    border-color: color-mix(in srgb, var(--ember) 50%, transparent);
    color: var(--ember);
  }

  .toggle-btn--disable:hover {
    background-color: color-mix(in srgb, var(--ember) 15%, transparent);
  }

  .toggle-btn--enable {
    color: var(--dim-light);
  }

  .toggle-btn--enable:hover {
    color: var(--starlight);
    background-color: color-mix(in srgb, var(--edge) 30%, transparent);
  }
</style>
