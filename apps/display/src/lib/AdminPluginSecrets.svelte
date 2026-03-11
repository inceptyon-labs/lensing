<script lang="ts">
  import type { PluginAdminEntry } from '@lensing/types';
  import './styles/builder.css';

  export let plugin: PluginAdminEntry;
  export let secretNames: string[] = [];
  export let onSave: (secrets: Record<string, string>) => void | Promise<void> = () => {};
  export let onClose: () => void = () => {};

  let saving = false;
  let status: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  let errorMsg = '';

  const secretValues: Record<string, string> = {};
  for (const name of secretNames) {
    secretValues[name] = '';
  }

  async function handleSave() {
    saving = true;
    status = 'saving';
    errorMsg = '';

    try {
      await onSave(secretValues);
      status = 'saved';
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        status = 'idle';
        onClose();
      }, 1200);
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : 'Save failed';
      status = 'error';
      saving = false;
    }
  }

  // eslint-disable-next-line no-undef
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') onClose();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="secrets-modal-backdrop" on:click={onClose}>
  <div
    class="secrets-modal"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-label="Manage secrets for {plugin.manifest.name}"
    on:click|stopPropagation
  >
    <div class="secrets-modal__header">
      <div class="secrets-modal__header-info">
        <h2 class="secrets-modal__title">{plugin.manifest.name} Secrets</h2>
        <p class="secrets-modal__desc">Store credentials securely encrypted in the database</p>
      </div>
    </div>

    <div class="secrets-modal__body">
      {#if secretNames.length === 0}
        <p class="secrets-modal__empty">
          No secrets required. This plugin doesn't declare any secrets in its manifest.
        </p>
      {:else}
        <div class="secrets-modal__form">
          {#each secretNames as name (name)}
            <div class="secrets-modal__field">
              <label for="secret-{name}" class="secrets-modal__label">{name}</label>
              <input
                id="secret-{name}"
                type="password"
                class="secrets-modal__input"
                placeholder="Enter {name}..."
                value={secretValues[name]}
                on:input={(e) => {
                  secretValues[name] = e.currentTarget.value;
                }}
                on:change={(e) => {
                  secretValues[name] = e.currentTarget.value;
                }}
                disabled={saving}
              />
            </div>
          {/each}
        </div>
      {/if}
    </div>

    {#if status === 'saving'}
      <div class="secrets-modal__footer">
        <span class="secrets-modal__status secrets-modal__status--saving">Saving secrets…</span>
      </div>
    {:else if status === 'saved'}
      <div class="secrets-modal__footer">
        <span class="secrets-modal__status secrets-modal__status--saved">Secrets saved</span>
      </div>
    {:else if status === 'error'}
      <div class="secrets-modal__footer">
        <span class="secrets-modal__status secrets-modal__status--error">Error: {errorMsg}</span>
      </div>
    {/if}

    <div class="secrets-modal__buttons">
      <button
        type="button"
        class="secrets-modal__btn secrets-modal__btn--secondary"
        on:click={onClose}
        disabled={saving}
        aria-label="Cancel"
      >
        Cancel
      </button>
      <button
        type="button"
        class="secrets-modal__btn secrets-modal__btn--primary"
        on:click={handleSave}
        disabled={saving || secretNames.length === 0}
        aria-label="Save secrets"
      >
        {#if saving}
          Saving…
        {:else}
          Save Secrets
        {/if}
      </button>
    </div>
  </div>
</div>
