<script lang="ts">
  import type { PluginAdminEntry } from '@lensing/types';

  export let plugin: PluginAdminEntry;
  export let onSave: (config: Record<string, string | number | boolean>) => void = () => {};

  // Initialize local state from current plugin config
  $: schema = plugin.manifest.config_schema;
  $: fields = schema?.fields ?? [];

  // Build a reactive local copy of the config values
  let values: Record<string, string | number | boolean> = {};
  $: {
    values = {};
    for (const field of fields) {
      values[field.key] =
        plugin.config[field.key] !== undefined
          ? plugin.config[field.key]
          : field.default !== undefined
            ? field.default
            : field.type === 'boolean'
              ? false
              : field.type === 'number'
                ? 0
                : '';
    }
  }

  function handleSubmit() {
    onSave({ ...values });
  }
</script>

{#if !schema || fields.length === 0}
  <p class="no-config">No configuration available</p>
{:else}
  <form class="config-form" on:submit|preventDefault={handleSubmit}>
    {#each fields as field (field.key)}
      <div class="form-field">
        <label class="field-label" for="cfg-{field.key}">
          {field.label}
          {#if field.required}<span class="required-mark" aria-label="required">*</span>{/if}
        </label>

        {#if field.description}
          <p class="field-description">{field.description}</p>
        {/if}

        {#if field.type === 'string'}
          <input
            id="cfg-{field.key}"
            type="text"
            class="field-input"
            bind:value={values[field.key]}
            required={field.required}
          />
        {:else if field.type === 'number'}
          <input
            id="cfg-{field.key}"
            type="number"
            class="field-input"
            bind:value={values[field.key]}
            min={field.min}
            max={field.max}
            required={field.required}
          />
        {:else if field.type === 'boolean'}
          <input
            id="cfg-{field.key}"
            type="checkbox"
            class="field-checkbox"
            bind:checked={values[field.key] as boolean}
          />
        {:else if field.type === 'select'}
          <select id="cfg-{field.key}" class="field-select" bind:value={values[field.key]}>
            {#each field.options ?? [] as opt (opt.value)}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        {/if}
      </div>
    {/each}

    <div class="form-actions">
      <button type="submit" class="save-btn">Save</button>
    </div>
  </form>
{/if}

<style>
  .no-config {
    font-size: var(--text-sm);
    color: var(--faint-light);
    font-style: italic;
    margin: 0;
    padding: var(--space-3) 0;
  }

  .config-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .field-label {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--dim-light);
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .required-mark {
    color: var(--ember);
    font-weight: var(--weight-bold);
    line-height: 1;
  }

  .field-description {
    font-size: var(--text-xs);
    color: var(--faint-light);
    margin: 0;
    line-height: var(--leading-normal);
  }

  .field-input,
  .field-select {
    background-color: var(--control-bg);
    border: 1px solid var(--control-border);
    border-radius: var(--radius-sm);
    color: var(--starlight);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-3);
    width: 100%;
    box-sizing: border-box;
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .field-input:focus,
  .field-select:focus {
    outline: none;
    border-color: var(--control-focus);
    box-shadow: 0 0 0 2px hsla(28, 85%, 55%, 0.1);
  }

  .field-checkbox {
    width: 18px;
    height: 18px;
    accent-color: var(--ember);
    cursor: pointer;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: var(--space-2);
    border-top: 1px solid var(--edge-soft);
  }

  .save-btn {
    background-color: var(--ember);
    color: var(--void);
    border: none;
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    padding: var(--space-2) var(--space-4);
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-out);
  }

  .save-btn:hover {
    background-color: var(--ember-dim);
  }

  .save-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--edge-focus);
  }
</style>
