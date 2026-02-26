<script lang="ts">
  import Pencil from '@lucide/svelte/icons/pencil';
  import Move from '@lucide/svelte/icons/move';
  import PanelTop from '@lucide/svelte/icons/panel-top';
  import Trash2 from '@lucide/svelte/icons/trash-2';

  interface Props {
    pluginId: string;
    pluginName: string;
    showHeader?: boolean;
    x?: number;
    y?: number;
    onconfigure: () => void;
    ondelete: () => void;
    onresize: () => void;
    ontoggleheader?: () => void;
    onclose: () => void;
  }

  let {
    pluginId,
    pluginName,
    showHeader = true,
    x = 0,
    y = 0,
    onconfigure,
    ondelete,
    onresize,
    ontoggleheader,
    onclose,
  }: Props = $props();

  // Clamp menu position so it doesn't overflow the viewport
  let menuStyle = $derived.by(() => {
    const clampedX = Math.min(x, window.innerWidth - 200);
    const clampedY = Math.min(y, window.innerHeight - 200);
    return `left: ${clampedX}px; top: ${clampedY}px;`;
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') onclose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="context-menu-backdrop" onmousedown={onclose}>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="context-menu"
    role="menu"
    tabindex="-1"
    aria-label="Widget actions for {pluginName}"
    onmousedown={(e) => e.stopPropagation()}
    data-plugin-id={pluginId}
    style={menuStyle}
  >
    <div class="context-menu__header">
      <span class="context-menu__name">{pluginName}</span>
    </div>

    <button type="button" class="context-menu__item" role="menuitem" onclick={onconfigure}>
      <span class="context-menu__icon" aria-hidden="true"><Pencil size={14} /></span>
      Configure
    </button>

    <button type="button" class="context-menu__item" role="menuitem" onclick={onresize}>
      <span class="context-menu__icon" aria-hidden="true"><Move size={14} /></span>
      Move &amp; Resize
    </button>

    {#if ontoggleheader}
      <button type="button" class="context-menu__item" role="menuitem" onclick={ontoggleheader}>
        <span class="context-menu__icon" aria-hidden="true"><PanelTop size={14} /></span>
        {showHeader ? 'Hide Header' : 'Show Header'}
      </button>
    {/if}

    <hr class="context-menu__divider" />

    <button
      type="button"
      class="context-menu__item context-menu__item--danger"
      role="menuitem"
      onclick={ondelete}
    >
      <span class="context-menu__icon" aria-hidden="true"><Trash2 size={14} /></span>
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
    position: fixed;
    background: var(--singularity);
    border: 1px solid var(--edge-bright);
    border-radius: var(--radius-md);
    min-width: 190px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--faint-light);
    width: 16px;
  }

  .context-menu__item:hover .context-menu__icon {
    color: inherit;
  }

  .context-menu__divider {
    margin: var(--space-1) 0;
    border: none;
    border-top: 1px solid var(--edge);
  }
</style>
