<script lang="ts">
  import {
    validatePosition,
    clampToConstraints,
    type WidgetPosition,
  } from './resize-modal-validation';

  interface Props {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    pluginName?: string;
    onconfirm: (pos: WidgetPosition) => void;
    oncancel: () => void;
  }

  let {
    x,
    y,
    w,
    h,
    minW = 1,
    minH = 1,
    maxW = 24,
    maxH = 24,
    pluginName = 'Widget',
    onconfirm,
    oncancel,
  }: Props = $props();

  let localX = $state(x);
  let localY = $state(y);
  let localW = $state(w);
  let localH = $state(h);

  let validation = $derived(
    validatePosition({ x: localX, y: localY, w: localW, h: localH }, 24),
  );

  function handleConfirm() {
    if (!validation.valid) return;
    const clamped = clampToConstraints(
      { x: localX, y: localY, w: localW, h: localH },
      { minW, minH, maxW, maxH },
    );
    onconfirm(clamped);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') oncancel();
    if (event.key === 'Enter' && validation.valid) handleConfirm();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="modal-backdrop" onclick={oncancel}>
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-label="Resize {pluginName}"
    onclick={(e) => e.stopPropagation()}
  >
    <h2 class="modal__title">Move &amp; Resize — {pluginName}</h2>

    <div class="modal__fields">
      <label class="modal__field">
        <span class="modal__label">Column (X)</span>
        <div class="modal__stepper">
          <button
            type="button"
            class="modal__step-btn"
            onclick={() => (localX = Math.max(0, localX - 1))}
            aria-label="Decrease X">−</button
          >
          <input
            type="number"
            class="modal__input"
            bind:value={localX}
            min={0}
            max={23}
            aria-label="X position"
          />
          <button
            type="button"
            class="modal__step-btn"
            onclick={() => (localX = Math.min(23, localX + 1))}
            aria-label="Increase X">+</button
          >
        </div>
      </label>

      <label class="modal__field">
        <span class="modal__label">Row (Y)</span>
        <div class="modal__stepper">
          <button
            type="button"
            class="modal__step-btn"
            onclick={() => (localY = Math.max(0, localY - 1))}
            aria-label="Decrease Y">−</button
          >
          <input
            type="number"
            class="modal__input"
            bind:value={localY}
            min={0}
            aria-label="Y position"
          />
          <button
            type="button"
            class="modal__step-btn"
            onclick={() => (localY = localY + 1)}
            aria-label="Increase Y">+</button
          >
        </div>
      </label>

      <label class="modal__field">
        <span class="modal__label">Width (W)</span>
        <div class="modal__stepper">
          <button
            type="button"
            class="modal__step-btn"
            onclick={() => (localW = Math.max(minW, localW - 1))}
            aria-label="Decrease width">−</button
          >
          <input
            type="number"
            class="modal__input"
            bind:value={localW}
            min={minW}
            max={maxW}
            aria-label="Width"
          />
          <button
            type="button"
            class="modal__step-btn"
            onclick={() => (localW = Math.min(maxW, localW + 1))}
            aria-label="Increase width">+</button
          >
        </div>
      </label>

      <label class="modal__field">
        <span class="modal__label">Height (H)</span>
        <div class="modal__stepper">
          <button
            type="button"
            class="modal__step-btn"
            onclick={() => (localH = Math.max(minH, localH - 1))}
            aria-label="Decrease height">−</button
          >
          <input
            type="number"
            class="modal__input"
            bind:value={localH}
            min={minH}
            max={maxH}
            aria-label="Height"
          />
          <button
            type="button"
            class="modal__step-btn"
            onclick={() => (localH = Math.min(maxH, localH + 1))}
            aria-label="Increase height">+</button
          >
        </div>
      </label>
    </div>

    {#if !validation.valid}
      <ul class="modal__errors" role="alert">
        {#each validation.errors as error}
          <li class="modal__error">{error}</li>
        {/each}
      </ul>
    {/if}

    <div class="modal__actions">
      <button type="button" class="modal__btn modal__btn--cancel" onclick={oncancel}>
        Cancel
      </button>
      <button
        type="button"
        class="modal__btn modal__btn--confirm"
        onclick={handleConfirm}
        disabled={!validation.valid}
      >
        Apply
      </button>
    </div>
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
    padding: var(--space-6);
    width: min(420px, 90vw);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .modal__title {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--starlight);
    letter-spacing: var(--tracking-wide);
    margin: 0;
  }

  .modal__fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
  }

  .modal__field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .modal__label {
    font-size: var(--text-xs);
    color: var(--dim-light);
    font-family: var(--font-mono);
    letter-spacing: var(--tracking-wide);
  }

  .modal__stepper {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .modal__step-btn {
    width: 28px;
    height: 28px;
    background: var(--event-horizon);
    border: 1px solid var(--edge);
    border-radius: var(--radius-sm);
    color: var(--starlight);
    font-size: var(--text-base);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .modal__step-btn:hover {
    border-color: var(--ember-dim);
    color: var(--ember);
  }

  .modal__input {
    flex: 1;
    background: var(--event-horizon);
    border: 1px solid var(--edge);
    border-radius: var(--radius-sm);
    color: var(--starlight);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    padding: var(--space-1) var(--space-2);
    text-align: center;
    min-width: 0;
  }

  .modal__input:focus {
    outline: 2px solid var(--edge-focus);
    outline-offset: 1px;
    border-color: var(--ember-dim);
  }

  /* Hide browser number spinners */
  .modal__input::-webkit-inner-spin-button,
  .modal__input::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  .modal__errors {
    list-style: none;
    padding: var(--space-2) var(--space-3);
    background: hsla(0, 60%, 55%, 0.08);
    border: 1px solid hsla(0, 60%, 55%, 0.2);
    border-radius: var(--radius-sm);
    margin: 0;
  }

  .modal__error {
    font-size: var(--text-xs);
    color: var(--alert-urgent);
    font-family: var(--font-mono);
  }

  .modal__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
  }

  .modal__btn {
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

  .modal__btn--cancel {
    background: transparent;
    border: 1px solid var(--edge);
    color: var(--dim-light);
  }

  .modal__btn--cancel:hover {
    border-color: var(--edge-bright);
    color: var(--starlight);
  }

  .modal__btn--confirm {
    background: var(--ember-glow);
    border: 1px solid var(--ember-dim);
    color: var(--ember);
  }

  .modal__btn--confirm:hover:not(:disabled) {
    background: var(--ember-dim);
    color: var(--starlight);
  }

  .modal__btn--confirm:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
