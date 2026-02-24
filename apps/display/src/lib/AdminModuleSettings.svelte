<script lang="ts">
  import { onMount } from 'svelte';
  import { MODULE_SCHEMAS } from '@lensing/types';
  import AdminModuleCard from './AdminModuleCard.svelte';

  /** Module states keyed by module ID: { enabled, values } */
  let moduleStates: Record<
    string,
    { enabled: boolean; values: Record<string, string | number | boolean> }
  > = {};
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      // eslint-disable-next-line no-undef
      const res = await fetch('/settings');
      if (!res.ok) throw new Error(`Failed to load settings (${res.status})`);
      const settings = (await res.json()) as Record<string, string>;

      // Parse flat settings into per-module state
      for (const schema of MODULE_SCHEMAS) {
        const prefix = schema.id;
        const enabled = settings[`${prefix}.enabled`] === 'true';
        const values: Record<string, string | number | boolean> = {};

        for (const field of schema.fields) {
          const raw = settings[`${prefix}.${field.key}`];
          if (raw !== undefined) {
            if (field.type === 'number') {
              const n = parseFloat(raw);
              values[field.key] = Number.isFinite(n) ? n : 0;
            } else if (field.type === 'boolean') {
              values[field.key] = raw === 'true';
            } else {
              values[field.key] = raw;
            }
          } else if (field.default !== undefined) {
            values[field.key] = field.default;
          }
        }

        moduleStates[prefix] = { enabled, values };
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading = false;
    }
  });

  async function handleModuleSave(
    moduleId: string,
    enabled: boolean,
    config: Record<string, string | number | boolean>
  ) {
    try {
      // Build flat settings from module state
      const flat: Record<string, string> = {};
      flat[`${moduleId}.enabled`] = String(enabled);
      for (const [key, value] of Object.entries(config)) {
        flat[`${moduleId}.${key}`] = String(value);
      }

      // eslint-disable-next-line no-undef
      const res = await fetch('/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flat),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      // Update local state
      moduleStates[moduleId] = { enabled, values: config };
      moduleStates = moduleStates; // trigger reactivity
      error = null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to save settings';
    }
  }
</script>

<div class="module-settings">
  {#if loading}
    <p class="state-message">Loading settings…</p>
  {:else if error}
    <p class="state-message state-message--error">Error: {error}</p>
  {:else}
    {#each MODULE_SCHEMAS as schema (schema.id)}
      <AdminModuleCard
        {schema}
        enabled={moduleStates[schema.id]?.enabled ?? false}
        config={moduleStates[schema.id]?.values ?? {}}
        onSave={handleModuleSave}
      />
    {/each}
  {/if}
</div>

<style>
  .module-settings {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .state-message {
    color: var(--dim-light);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    padding: var(--space-4);
    text-align: center;
  }

  .state-message--error {
    color: var(--nova);
  }
</style>
