<script lang="ts">
  import type { PluginAdminEntry, ConfigField } from '@lensing/types';

  interface Props {
    plugin: PluginAdminEntry;
    onclose: () => void;
  }

  let { plugin, onclose }: Props = $props();

  let fields = $derived(plugin.manifest.config_schema?.fields ?? []);

  // Local copy of config values for editing
  let values = $state<Record<string, string | number | boolean>>({});
  let saving = $state(false);
  let error = $state('');
  let saved = $state(false);

  // Initialize values from plugin config + schema defaults
  $effect(() => {
    const v: Record<string, string | number | boolean> = {};
    for (const field of fields) {
      v[field.key] =
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
    values = v;
  });

  async function handleSave() {
    saving = true;
    error = '';
    saved = false;
    try {
      const res = await fetch(`/plugins/${encodeURIComponent(plugin.plugin_id)}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: values }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `HTTP ${res.status}`);
      }
      // Restart built-in modules so config takes effect immediately
      if (plugin.builtin) {
        await fetch(`/modules/${encodeURIComponent(plugin.plugin_id)}/restart`, {
          method: 'POST',
        });
      }
      saved = true;
      setTimeout(() => onclose(), 600);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Save failed';
    } finally {
      saving = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') onclose();
  }

  function updateValue(key: string, value: string | number | boolean) {
    values = { ...values, [key]: value };
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="config-backdrop" onmousedown={onclose}>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="config-panel"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-label="Configure {plugin.manifest.name}"
    onmousedown={(e) => e.stopPropagation()}
  >
    <div class="config-panel__header">
      <h2 class="config-panel__title">{plugin.manifest.name}</h2>
      <span class="config-panel__subtitle">Settings</span>
    </div>

    {#if fields.length === 0}
      <p class="config-panel__empty">No configuration options available for this widget.</p>
    {:else}
      <div class="config-panel__fields">
        {#each fields as field (field.key)}
          <div class="config-field">
            <label class="config-field__label" for="wcfg-{field.key}">
              {field.label}
              {#if field.required}<span class="config-field__required">*</span>{/if}
            </label>

            {#if field.description}
              <p class="config-field__desc">{field.description}</p>
            {/if}

            {#if field.type === 'string'}
              <input
                id="wcfg-{field.key}"
                type="text"
                class="config-field__input"
                value={String(values[field.key] ?? '')}
                oninput={(e) => updateValue(field.key, e.currentTarget.value)}
                required={field.required}
              />
            {:else if field.type === 'password'}
              <input
                id="wcfg-{field.key}"
                type="password"
                class="config-field__input"
                value={String(values[field.key] ?? '')}
                oninput={(e) => updateValue(field.key, e.currentTarget.value)}
                required={field.required}
                autocomplete="off"
              />
            {:else if field.type === 'number'}
              <input
                id="wcfg-{field.key}"
                type="number"
                class="config-field__input"
                value={Number(values[field.key] ?? 0)}
                oninput={(e) => updateValue(field.key, e.currentTarget.valueAsNumber)}
                min={field.min}
                max={field.max}
                required={field.required}
              />
            {:else if field.type === 'boolean'}
              <label class="config-field__toggle">
                <input
                  id="wcfg-{field.key}"
                  type="checkbox"
                  class="config-field__checkbox"
                  checked={Boolean(values[field.key])}
                  onchange={(e) => updateValue(field.key, e.currentTarget.checked)}
                />
                <span class="config-field__toggle-label">
                  {values[field.key] ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            {:else if field.type === 'select'}
              <select
                id="wcfg-{field.key}"
                class="config-field__select"
                value={String(values[field.key] ?? '')}
                onchange={(e) => updateValue(field.key, e.currentTarget.value)}
              >
                {#each field.options ?? [] as opt (opt.value)}
                  <option value={opt.value}>{opt.label}</option>
                {/each}
              </select>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    {#if error}
      <div class="config-panel__error" role="alert">{error}</div>
    {/if}

    {#if saved}
      <div class="config-panel__saved" role="status">Settings saved{plugin.builtin ? ' — restarting module' : ''}</div>
    {/if}

    <div class="config-panel__actions">
      <button type="button" class="config-btn config-btn--cancel" onclick={onclose}>
        Cancel
      </button>
      {#if fields.length > 0}
        <button
          type="button"
          class="config-btn config-btn--save"
          onclick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .config-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-6);
    z-index: 200;
  }

  .config-panel {
    background: var(--accretion);
    border: 1px solid var(--edge-bright);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    width: min(460px, 95vw);
    max-height: 80vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .config-panel__header {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
  }

  .config-panel__title {
    font-family: var(--font-mono);
    font-size: var(--text-base);
    font-weight: 700;
    color: var(--starlight);
    margin: 0;
  }

  .config-panel__subtitle {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--dim-light);
    letter-spacing: var(--tracking-wide);
  }

  .config-panel__empty {
    font-size: var(--text-sm);
    color: var(--faint-light);
    font-family: var(--font-mono);
    margin: 0;
    padding: var(--space-4) 0;
    text-align: center;
    letter-spacing: var(--tracking-wide);
  }

  .config-panel__fields {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .config-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .config-field__label {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--dim-light);
    font-family: var(--font-mono);
    letter-spacing: var(--tracking-wide);
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .config-field__required {
    color: var(--ember);
    font-weight: 700;
  }

  .config-field__desc {
    font-size: var(--text-xs);
    color: var(--faint-light);
    margin: 0;
    line-height: 1.4;
  }

  .config-field__input,
  .config-field__select {
    background: var(--event-horizon);
    border: 1px solid var(--edge);
    border-radius: var(--radius-sm);
    color: var(--starlight);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-3);
    width: 100%;
    box-sizing: border-box;
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .config-field__input:focus,
  .config-field__select:focus {
    outline: none;
    border-color: var(--ember-dim);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ember) 10%, transparent);
  }

  .config-field__toggle {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
  }

  .config-field__checkbox {
    width: 18px;
    height: 18px;
    accent-color: var(--ember);
    cursor: pointer;
  }

  .config-field__toggle-label {
    font-size: var(--text-sm);
    color: var(--dim-light);
    font-family: var(--font-mono);
  }

  .config-panel__error {
    padding: var(--space-2) var(--space-3);
    background: hsla(0, 60%, 55%, 0.08);
    border: 1px solid hsla(0, 60%, 55%, 0.2);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    color: var(--alert-urgent);
    font-family: var(--font-mono);
  }

  .config-panel__saved {
    padding: var(--space-2) var(--space-3);
    background: color-mix(in srgb, var(--signal-ok) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--signal-ok) 30%, transparent);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    color: var(--signal-ok);
    font-family: var(--font-mono);
  }

  .config-panel__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
    padding-top: var(--space-2);
    border-top: 1px solid var(--edge);
  }

  .config-btn {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out);
  }

  .config-btn--cancel {
    background: transparent;
    border: 1px solid var(--edge);
    color: var(--dim-light);
  }

  .config-btn--cancel:hover {
    border-color: var(--edge-bright);
    color: var(--starlight);
  }

  .config-btn--save {
    background: var(--ember-glow);
    border: 1px solid var(--ember-dim);
    color: var(--ember);
  }

  .config-btn--save:hover:not(:disabled) {
    background: var(--ember-dim);
    color: var(--starlight);
  }

  .config-btn--save:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .config-panel {
      width: 100vw;
      height: 100vh;
      max-height: 100vh;
      border-radius: 0;
    }

    .config-btn {
      min-height: 44px;
    }
  }
</style>
