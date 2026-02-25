<script lang="ts">
  interface Props {
    pluginId: string;
    pluginName: string;
    ondelete: () => void;
    onresize: () => void;
    onclose: () => void;
  }

  let { pluginId, pluginName, ondelete, onresize, onclose }: Props = $props();

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') onclose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="context-menu-backdrop" onclick={onclose}>
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="context-menu"
    role="menu"
    aria-label="Widget actions for {pluginName}"
    onclick={(e) => e.stopPropagation()}
    data-plugin-id={pluginId}
  >
    <div class="context-menu__header">
      <span class="context-menu__name">{pluginName}</span>
    </div>

    <button type="button" class="context-menu__item" role="menuitem" onclick={onresize}>
      <span class="context-menu__icon" aria-hidden="true">⊹</span>
      Move &amp; Resize
    </button>

    <hr class="context-menu__divider" />

    <button
      type="button"
      class="context-menu__item context-menu__item--danger"
      role="menuitem"
      onclick={ondelete}
    >
      <span class="context-menu__icon" aria-hidden="true">✕</span>
      Remove Widget
    </button>
  </div>
</div>

<style>
  .context-menu-backdrop {
    position: fixed;
    inset: 0;
    z-index: 150;
  }

  .context-menu {
    position: absolute;
    background: var(--singularity);
    border: 1px solid var(--edge-bright);
    border-radius: var(--radius-md);
    min-width: 180px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .context-menu__header {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--edge);
  }

  .context-menu__name {
    font-size: var(--text-xs);
    color: var(--dim-light);
    font-family: var(--font-mono);
    letter-spacing: var(--tracking-wide);
  }

  .context-menu__item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-2) var(--space-3);
    background: transparent;
    border: none;
    color: var(--starlight);
    font-size: var(--text-sm);
    font-family: var(--font-sans);
    cursor: pointer;
    text-align: left;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .context-menu__item:hover {
    background: var(--ember-trace);
    color: var(--ember);
  }

  .context-menu__item--danger:hover {
    background: hsla(0, 60%, 55%, 0.08);
    color: var(--alert-urgent);
  }

  .context-menu__icon {
    font-size: var(--text-xs);
    color: var(--faint-light);
    width: 14px;
    text-align: center;
  }

  .context-menu__divider {
    margin: var(--space-1) 0;
    border: none;
    border-top: 1px solid var(--edge);
  }
</style>
