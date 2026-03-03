<script lang="ts">
  import type { PluginAdminEntry } from '@lensing/types';

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
<div class="modal-backdrop" on:click={onClose}>
  <div
    class="modal"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-label="Manage secrets for {plugin.manifest.name}"
    on:click|stopPropagation
  >
    <div class="modal-header">
      <div class="modal-header__info">
        <h2 class="modal-header__title">🔐 {plugin.manifest.name} Secrets</h2>
        <p class="modal-header__desc">Store credentials securely encrypted in the database</p>
      </div>
    </div>

    <div class="modal-body">
      {#if secretNames.length === 0}
        <div class="no-secrets">
          <p>No secrets required. This plugin doesn't declare any secrets in its manifest.</p>
        </div>
      {:else}
        <div class="secrets-form">
          {#each secretNames as name (name)}
            <div class="form-group">
              <label for="secret-{name}" class="form-label">{name}</label>
              <input
                id="secret-{name}"
                type="password"
                class="form-input"
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
      <div class="modal-footer">
        <span class="status-msg status-msg--saving">Saving secrets…</span>
      </div>
    {:else if status === 'saved'}
      <div class="modal-footer">
        <span class="status-msg status-msg--saved">✓ Secrets saved</span>
      </div>
    {:else if status === 'error'}
      <div class="modal-footer">
        <span class="status-msg status-msg--error">Error: {errorMsg}</span>
      </div>
    {/if}

    <div class="modal-buttons">
      <button
        type="button"
        class="btn btn-secondary"
        on:click={onClose}
        disabled={saving}
        aria-label="Cancel"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-primary"
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

