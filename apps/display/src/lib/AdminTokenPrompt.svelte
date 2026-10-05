<script lang="ts">
  import { tokenPromptOpen, submitToken, cancelToken } from './admin-auth';

  let value = '';

  function handleSave() {
    submitToken(value);
    value = '';
  }

  // eslint-disable-next-line no-undef
  function handleKeydown(event: KeyboardEvent) {
    if (!$tokenPromptOpen) return;
    if (event.key === 'Escape') cancelToken();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $tokenPromptOpen}
  <div class="modal-backdrop">
    <form
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-label="Admin token required"
      on:submit|preventDefault={handleSave}
    >
      <h2 class="modal__title">Admin token required</h2>
      <p class="modal__desc">Paste the token from data/admin-token on the Pi.</p>
      <!-- svelte-ignore a11y_autofocus -->
      <input
        class="modal__input"
        type="password"
        autocomplete="off"
        spellcheck="false"
        autofocus
        placeholder="Admin token"
        bind:value
      />
      <div class="modal__actions">
        <button type="button" class="btn btn--ghost" on:click={cancelToken}>Cancel</button>
        <button type="submit" class="btn btn--primary" disabled={!value.trim()}>Save</button>
      </div>
    </form>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 300;
  }

  .modal {
    background: var(--accretion);
    border: 1px solid var(--edge-bright);
    border-radius: var(--radius-lg);
    width: min(420px, 90vw);
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .modal__title {
    font-size: var(--text-lg);
    font-weight: var(--weight-semibold);
    color: var(--starlight);
    margin: 0;
  }

  .modal__desc {
    font-size: var(--text-xs);
    color: var(--faint-light);
    margin: 0;
    line-height: var(--leading-normal);
  }

  .modal__input {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--starlight);
    background: var(--event-horizon);
    border: 1px solid var(--edge);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
  }

  .modal__input:focus {
    outline: none;
    border-color: var(--edge-bright);
  }

  .modal__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
  }

  .btn {
    font-size: var(--text-sm);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-4);
    cursor: pointer;
    border: 1px solid var(--edge);
    background: transparent;
    color: var(--starlight);
  }

  .btn--primary {
    background: var(--ember);
    color: var(--void);
    border-color: transparent;
  }

  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
