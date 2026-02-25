<script lang="ts">
  interface Props {
    onsave: () => void;
    oncancel: () => void;
    onundo: () => void;
    onredo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    dirty: boolean;
  }

  let { onsave, oncancel, onundo, onredo, canUndo, canRedo, dirty }: Props = $props();
</script>

<div class="edit-bar" role="toolbar" aria-label="Layout editing">
  <div class="edit-bar__group">
    <button
      class="edit-bar__btn edit-bar__btn--undo"
      type="button"
      disabled={!canUndo}
      onclick={onundo}
      aria-label="Undo"
      title="Undo (Ctrl+Z)"
    >
      Undo
    </button>

    <button
      class="edit-bar__btn edit-bar__btn--redo"
      type="button"
      disabled={!canRedo}
      onclick={onredo}
      aria-label="Redo"
      title="Redo (Ctrl+Shift+Z)"
    >
      Redo
    </button>
  </div>

  {#if dirty}
    <span class="edit-bar__dirty" aria-label="Unsaved changes"> Unsaved changes </span>
  {/if}

  <div class="edit-bar__group">
    <button
      class="edit-bar__btn edit-bar__btn--cancel"
      type="button"
      onclick={oncancel}
      title="Cancel (Escape)"
    >
      Cancel
    </button>

    <button
      class="edit-bar__btn edit-bar__btn--save"
      type="button"
      disabled={!dirty}
      onclick={onsave}
      aria-label="Save layout"
    >
      Save
    </button>
  </div>
</div>

<style>
  .edit-bar {
    display: flex;
    align-items: center;
    gap: var(--space-3, 12px);
    padding: var(--space-2, 8px) var(--space-4, 16px);
    background-color: var(--event-horizon);
    border: 1px solid var(--edge);
    border-radius: var(--radius-md);
  }

  .edit-bar__group {
    display: flex;
    gap: var(--space-1, 4px);
  }

  .edit-bar__btn {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    padding: var(--space-1, 4px) var(--space-3, 12px);
    border-radius: var(--radius-sm);
    cursor: pointer;
    border: 1px solid var(--edge);
    background: transparent;
    color: var(--dim-light);
    transition:
      background var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out);
  }

  .edit-bar__btn:hover:not(:disabled) {
    border-color: var(--edge-bright);
    color: var(--starlight);
  }

  .edit-bar__btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .edit-bar__btn--save {
    background: var(--ember-glow);
    border-color: var(--ember-dim);
    color: var(--ember);
  }

  .edit-bar__btn--save:hover:not(:disabled) {
    background: var(--ember-dim);
    color: var(--starlight);
  }

  .edit-bar__btn--cancel:hover:not(:disabled) {
    border-color: var(--alert-urgent);
    color: var(--alert-urgent);
  }

  .edit-bar__dirty {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--ember);
    letter-spacing: var(--tracking-wide);
    opacity: 0.8;
  }
</style>
