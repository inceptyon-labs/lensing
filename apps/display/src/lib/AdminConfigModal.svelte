<script lang="ts">
  import type { PluginAdminEntry } from '@lensing/types';
  import AdminConfigForm from './AdminConfigForm.svelte';

  export let plugin: PluginAdminEntry;
  export let onSave: (config: Record<string, string | number | boolean>) => void | Promise<void> =
    () => {};
  export let onClose: () => void = () => {};

  let saving = false;
  let restartStatus: 'idle' | 'restarting' | 'restarted' | 'error' = 'idle';
  let restartError = '';

  async function handleSave(config: Record<string, string | number | boolean>) {
    saving = true;
    try {
      await onSave(config);
      restartStatus = 'restarted';
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        restartStatus = 'idle';
        onClose();
      }, 1200);
    } catch (err) {
      restartError = err instanceof Error ? err.message : 'Save failed';
      restartStatus = 'error';
    } finally {
      saving = false;
    }
  }

  // eslint-disable-next-line no-undef
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') onClose();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="modal-backdrop" on:click={onClose}>
  <div
    class="modal"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-label="Configure {plugin.manifest.name}"
    on:click|stopPropagation
  >
    <div class="modal-header">
      <div class="modal-header__info">
        <h2 class="modal-header__title">{plugin.manifest.name}</h2>
        {#if plugin.manifest.description}
          <p class="modal-header__desc">{plugin.manifest.description}</p>
        {/if}
      </div>
      {#if plugin.integration_status === 'ready'}
        <span class="badge badge--ready">Configured</span>
      {:else if plugin.integration_status === 'missing'}
        <span class="badge badge--missing">Setup Required</span>
      {/if}
    </div>

    <div class="modal-body">
      <AdminConfigForm {plugin} onSave={handleSave} />
    </div>

    {#if restartStatus === 'restarting' || saving}
      <div class="modal-footer">
        <span class="status-msg status-msg--saving">Saving & restarting…</span>
      </div>
    {:else if restartStatus === 'restarted'}
      <div class="modal-footer">
        <span class="status-msg status-msg--success">Saved & restarted</span>
      </div>
    {:else if restartStatus === 'error'}
      <div class="modal-footer">
        <span class="status-msg status-msg--error">{restartError}</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }

  .modal {
    background: var(--accretion);
    border: 1px solid var(--edge-bright);
    border-radius: var(--radius-lg);
    width: min(480px, 90vw);
    max-height: 85vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-5) var(--space-5) var(--space-3);
  }

  .modal-header__info {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 0;
  }

  .modal-header__title {
    font-size: var(--text-lg);
    font-weight: var(--weight-semibold);
    color: var(--starlight);
    margin: 0;
  }

  .modal-header__desc {
    font-size: var(--text-xs);
    color: var(--faint-light);
    margin: 0;
    line-height: var(--leading-normal);
  }

  .badge {
    font-size: 10px;
    font-family: var(--font-mono);
    font-weight: var(--weight-semibold);
    padding: 2px 8px;
    border-radius: var(--radius-full);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .badge--ready {
    background-color: color-mix(in srgb, var(--alert-success) 20%, transparent);
    color: var(--alert-success);
    border: 1px solid color-mix(in srgb, var(--alert-success) 30%, transparent);
  }

  .badge--missing {
    background-color: color-mix(in srgb, var(--dim-light) 20%, transparent);
    color: var(--dim-light);
    border: 1px solid color-mix(in srgb, var(--dim-light) 30%, transparent);
  }

  .modal-body {
    padding: 0 var(--space-5) var(--space-5);
  }

  .modal-footer {
    padding: var(--space-3) var(--space-5);
    border-top: 1px solid var(--edge-soft);
  }

  .status-msg {
    font-size: var(--text-xs);
    font-family: var(--font-mono);
  }

  .status-msg--saving {
    color: var(--ember);
  }

  .status-msg--success {
    color: var(--alert-success);
  }

  .status-msg--error {
    color: var(--alert-urgent);
  }
</style>
