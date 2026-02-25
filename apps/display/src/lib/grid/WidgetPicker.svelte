<script lang="ts">
  import type { PluginAdminEntry } from '@lensing/types';

  interface Props {
    availablePlugins: PluginAdminEntry[];
    onadd: (plugin: PluginAdminEntry) => void;
    onclose: () => void;
  }

  let { availablePlugins, onadd, onclose }: Props = $props();

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') onclose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="picker-backdrop" onclick={onclose}>
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="picker"
    role="dialog"
    aria-modal="true"
    aria-label="Add widget"
    onclick={(e) => e.stopPropagation()}
  >
    <div class="picker__header">
      <h2 class="picker__title">Add Widget</h2>
      <button
        type="button"
        class="picker__close"
        onclick={onclose}
        aria-label="Close widget picker"
      >
        ✕
      </button>
    </div>

    {#if availablePlugins.length === 0}
      <p class="picker__empty">All available widgets are already on the dashboard.</p>
    {:else}
      <ul class="picker__list">
        {#each availablePlugins as plugin (plugin.plugin_id)}
          <li class="picker__item">
            <div class="picker__info">
              <span class="picker__name">{plugin.manifest.name}</span>
              <span class="picker__id">{plugin.plugin_id}</span>
            </div>
            <button
              type="button"
              class="picker__add-btn"
              onclick={() => onadd(plugin)}
              aria-label="Add {plugin.manifest.name}"
            >
              Add
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .picker-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: var(--space-4);
    z-index: 200;
  }

  .picker {
    background: var(--accretion);
    border: 1px solid var(--edge-bright);
    border-radius: var(--radius-lg);
    width: min(320px, 90vw);
    max-height: 70vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .picker__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-4) var(--space-3);
    border-bottom: 1px solid var(--edge);
  }

  .picker__title {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--starlight);
    letter-spacing: var(--tracking-wide);
    margin: 0;
  }

  .picker__close {
    background: transparent;
    border: none;
    color: var(--faint-light);
    cursor: pointer;
    font-size: var(--text-sm);
    padding: var(--space-1);
    border-radius: var(--radius-sm);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .picker__close:hover {
    color: var(--starlight);
  }

  .picker__empty {
    padding: var(--space-4);
    color: var(--faint-light);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    text-align: center;
  }

  .picker__list {
    list-style: none;
    padding: var(--space-2) 0;
    margin: 0;
    overflow-y: auto;
  }

  .picker__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-4);
    gap: var(--space-3);
    transition: background var(--duration-fast) var(--ease-out);
  }

  .picker__item:hover {
    background: var(--ember-trace);
  }

  .picker__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .picker__name {
    font-size: var(--text-sm);
    color: var(--starlight);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .picker__id {
    font-size: var(--text-xs);
    color: var(--faint-light);
    font-family: var(--font-mono);
  }

  .picker__add-btn {
    flex-shrink: 0;
    background: var(--ember-glow);
    border: 1px solid var(--ember-dim);
    border-radius: var(--radius-sm);
    color: var(--ember);
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    letter-spacing: var(--tracking-wide);
    padding: var(--space-1) var(--space-3);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out);
  }

  .picker__add-btn:hover {
    background: var(--ember-dim);
    color: var(--starlight);
  }
</style>
