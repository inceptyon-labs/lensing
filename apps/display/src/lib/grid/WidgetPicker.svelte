<script lang="ts">
  import type { PluginAdminEntry } from '@lensing/types';
  import { getPreferredSize } from './widget-sizes';

  interface Props {
    availablePlugins: PluginAdminEntry[];
    onadd: (plugin: PluginAdminEntry) => void;
    onclose: () => void;
  }

  let { availablePlugins, onadd, onclose }: Props = $props();

  let search = $state('');

  let filtered = $derived(
    search.trim().length === 0
      ? availablePlugins
      : availablePlugins.filter((p) => {
          const q = search.toLowerCase();
          return p.manifest.name.toLowerCase().includes(q) || p.plugin_id.toLowerCase().includes(q);
        })
  );

  /** Group plugins: builtins first, then third-party */
  let grouped = $derived.by(() => {
    const builtin = filtered.filter((p) => p.builtin);
    const thirdParty = filtered.filter((p) => !p.builtin);
    const groups: { label: string; plugins: PluginAdminEntry[] }[] = [];
    if (builtin.length > 0) groups.push({ label: 'Built-in', plugins: builtin });
    if (thirdParty.length > 0) groups.push({ label: 'Plugins', plugins: thirdParty });
    return groups;
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') onclose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="picker-backdrop" onclick={onclose}>
  <div
    class="picker"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-label="Add widget"
    onclick={(e) => e.stopPropagation()}
  >
    <div class="picker__header">
      <div>
        <h2 class="picker__title">Add Widget</h2>
        <p class="picker__subtitle">Choose a widget to add to your dashboard</p>
      </div>
      <button
        type="button"
        class="picker__close"
        onclick={onclose}
        aria-label="Close widget picker"
      >
        ✕
      </button>
    </div>

    <div class="picker__search">
      <input
        type="text"
        class="picker__search-input"
        placeholder="Search widgets..."
        bind:value={search}
      />
    </div>

    <div class="picker__body">
      {#if filtered.length === 0}
        <p class="picker__empty">
          {#if availablePlugins.length === 0}
            All widgets are already on the dashboard.
          {:else}
            No widgets match your search.
          {/if}
        </p>
      {:else}
        {#each grouped as group (group.label)}
          <div class="picker__group">
            <h3 class="picker__group-label">
              {group.label}
              <span class="picker__group-count">({group.plugins.length})</span>
            </h3>
            <div class="picker__grid">
              {#each group.plugins as plugin (plugin.plugin_id)}
                {@const size = getPreferredSize(plugin.plugin_id, plugin.manifest)}
                <div class="picker__card">
                  <div class="picker__card-body">
                    <div class="picker__card-icon">
                      {plugin.manifest.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="picker__card-info">
                      <span class="picker__card-name">{plugin.manifest.name}</span>
                      <span class="picker__card-id">{plugin.plugin_id}</span>
                    </div>
                  </div>
                  <div class="picker__card-meta">
                    <span class="picker__card-size">{size.w}×{size.h}</span>
                    {#if plugin.status === 'active'}
                      <span class="picker__card-status picker__card-status--active">Active</span>
                    {:else if plugin.status === 'error'}
                      <span class="picker__card-status picker__card-status--error">Error</span>
                    {:else}
                      <span class="picker__card-status">{plugin.status}</span>
                    {/if}
                  </div>
                  <button
                    type="button"
                    class="picker__card-add"
                    onclick={() => onadd(plugin)}
                    aria-label="Add {plugin.manifest.name} to dashboard"
                  >
                    + Add to Dashboard
                  </button>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .picker-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-6);
    z-index: 200;
  }

  .picker {
    background: var(--accretion);
    border: 1px solid var(--edge-bright);
    border-radius: var(--radius-lg);
    width: min(720px, 95vw);
    max-height: 85vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .picker__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: var(--space-5) var(--space-5) var(--space-3);
  }

  .picker__title {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: 700;
    color: var(--starlight);
    margin: 0;
  }

  .picker__subtitle {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--dim-light);
    margin: var(--space-1) 0 0;
    letter-spacing: var(--tracking-wide);
  }

  .picker__close {
    background: transparent;
    border: none;
    color: var(--faint-light);
    cursor: pointer;
    font-size: var(--text-lg);
    padding: var(--space-2);
    border-radius: var(--radius-sm);
    transition: color var(--duration-fast) var(--ease-out);
    line-height: 1;
  }

  .picker__close:hover {
    color: var(--starlight);
  }

  .picker__search {
    padding: 0 var(--space-5) var(--space-4);
  }

  .picker__search-input {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    background: var(--event-horizon);
    border: 1px solid var(--edge);
    border-radius: var(--radius-md);
    color: var(--starlight);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-wide);
    outline: none;
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .picker__search-input::placeholder {
    color: var(--faint-light);
  }

  .picker__search-input:focus {
    border-color: var(--ember-dim);
  }

  .picker__body {
    overflow-y: auto;
    padding: 0 var(--space-5) var(--space-5);
    flex: 1;
  }

  .picker__empty {
    padding: var(--space-8) var(--space-4);
    color: var(--faint-light);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    text-align: center;
    letter-spacing: var(--tracking-wide);
  }

  .picker__group {
    margin-bottom: var(--space-5);
  }

  .picker__group:last-child {
    margin-bottom: 0;
  }

  .picker__group-label {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--starlight);
    margin: 0 0 var(--space-3);
    letter-spacing: var(--tracking-wide);
  }

  .picker__group-count {
    color: var(--ember);
    font-weight: 400;
  }

  .picker__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .picker__card {
    background: var(--event-horizon);
    border: 1px solid var(--edge);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    transition:
      border-color var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out);
  }

  .picker__card:hover {
    border-color: var(--ember-dim);
    box-shadow: 0 0 20px color-mix(in srgb, var(--ember) 10%, transparent);
  }

  .picker__card-body {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .picker__card-icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-sm);
    background: var(--ember-glow);
    color: var(--ember);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: 700;
    flex-shrink: 0;
  }

  .picker__card-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .picker__card-name {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--starlight);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .picker__card-id {
    font-size: var(--text-xs);
    color: var(--faint-light);
    font-family: var(--font-mono);
    letter-spacing: var(--tracking-wide);
  }

  .picker__card-meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .picker__card-size {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--dim-light);
    letter-spacing: var(--tracking-wide);
  }

  .picker__card-status {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: var(--tracking-wide);
    padding: 1px var(--space-2);
    border-radius: var(--radius-sm);
    color: var(--dim-light);
    border: 1px solid var(--edge);
  }

  .picker__card-status--active {
    color: var(--signal-ok);
    border-color: color-mix(in srgb, var(--signal-ok) 40%, transparent);
  }

  .picker__card-status--error {
    color: var(--alert-urgent);
    border-color: color-mix(in srgb, var(--alert-urgent) 40%, transparent);
  }

  .picker__card-add {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    background: var(--ember-glow);
    border: 1px solid var(--ember-dim);
    border-radius: var(--radius-sm);
    color: var(--ember);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 600;
    letter-spacing: var(--tracking-wide);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out);
  }

  .picker__card-add:hover {
    background: var(--ember-dim);
    color: var(--starlight);
  }

  @media (max-width: 768px) {
    .picker {
      width: 100vw;
      height: 100vh;
      max-height: 100vh;
      border-radius: 0;
    }

    .picker__grid {
      grid-template-columns: 1fr;
    }

    .picker__card-add {
      min-height: 44px;
    }
  }
</style>
