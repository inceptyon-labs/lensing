<script lang="ts">
  import type { ModuleSettingsSchema, PluginAdminEntry, ConfigField } from '@lensing/types';
  import AdminConfigForm from './AdminConfigForm.svelte';

  export let schema: ModuleSettingsSchema;
  export let enabled: boolean;
  export let config: Record<string, string | number | boolean>;
  export let onSave: (
    moduleId: string,
    enabled: boolean,
    config: Record<string, string | number | boolean>
  ) => Promise<void> | void = () => {};

  let configOpen = false;
  let saved = false;
  let saving = false;

  /** Build a synthetic PluginAdminEntry so AdminConfigForm can render the fields */
  $: syntheticPlugin = {
    plugin_id: schema.id,
    manifest: {
      id: schema.id,
      name: schema.name,
      version: '0.0.0', // synthetic — module cards are not versioned plugins
      config_schema: { fields: schema.fields as ConfigField[] },
    },
    status: 'active' as const,
    enabled,
    config,
  } satisfies PluginAdminEntry;

  async function handleToggle() {
    saving = true;
    try {
      await onSave(schema.id, !enabled, config);
      saved = true;
      setTimeout(() => (saved = false), 2000);
    } finally {
      saving = false;
    }
  }

  async function handleConfigSave(newConfig: Record<string, string | number | boolean>) {
    saving = true;
    try {
      await onSave(schema.id, enabled, newConfig);
      config = newConfig;
      configOpen = false;
      saved = true;
      setTimeout(() => (saved = false), 2000);
    } finally {
      saving = false;
    }
  }
</script>

<div class="module-card">
  <div class="card-header">
    <div class="card-info">
      <h3 class="module-name">{schema.name}</h3>
      <p class="module-description">{schema.description}</p>
    </div>
    <button
      class="toggle-btn toggle-btn--{enabled ? 'disable' : 'enable'}"
      on:click={handleToggle}
      aria-pressed={enabled ? 'true' : 'false'}
    >
      {enabled ? 'Disable' : 'Enable'}
    </button>
  </div>

  <div class="card-actions">
    <button
      class="configure-btn"
      on:click={() => (configOpen = !configOpen)}
      aria-expanded={configOpen ? 'true' : 'false'}
    >
      Configure
    </button>
    {#if saved}
      <span class="saved-notice">Saved — restart required</span>
    {/if}
  </div>

  {#if configOpen}
    <div class="config-section">
      <AdminConfigForm plugin={syntheticPlugin} onSave={handleConfigSave} />
    </div>
  {/if}
</div>

<style>
  .module-card {
    background-color: var(--event-horizon);
    border: 1px solid var(--edge);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    transition: box-shadow var(--duration-fast) var(--ease-out);
  }

  .module-card:hover {
    box-shadow:
      0 0 0 1px var(--edge-bright),
      0 0 20px var(--ember-trace);
  }

  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-3);
  }

  .card-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .module-name {
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
    color: var(--starlight);
    margin: 0;
  }

  .module-description {
    font-size: var(--text-xs);
    color: var(--faint-light);
    margin: 0;
    line-height: var(--leading-normal);
  }

  .card-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
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
    flex-shrink: 0;
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

  .configure-btn {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-sm);
    border: 1px solid var(--edge);
    cursor: pointer;
    background-color: var(--void);
    color: var(--dim-light);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .configure-btn:hover {
    color: var(--starlight);
    border-color: var(--edge-bright);
  }

  .saved-notice {
    font-size: var(--text-xs);
    color: var(--ember);
    font-family: var(--font-mono);
  }

  .config-section {
    border-top: 1px solid var(--edge-soft);
    padding-top: var(--space-4);
    margin-top: var(--space-1);
  }
</style>
