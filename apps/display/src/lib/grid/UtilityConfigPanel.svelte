<script lang="ts">
  import type { UtilityType } from './layout-utilities';

  interface Props {
    utilityType: UtilityType;
    config: Record<string, string | number | boolean>;
    onclose: () => void;
    onsave: (config: Record<string, string | number | boolean>) => void;
  }

  let { utilityType, config, onclose, onsave }: Props = $props();

  let hour12 = $state(config['hour12'] !== false);

  function handleSave() {
    onsave({ ...config, hour12 });
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') onclose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="util-config-backdrop" onmousedown={onclose}>
  <div
    class="util-config-panel"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-label="Configure {utilityType}"
    onmousedown={(e) => e.stopPropagation()}
  >
    <h2 class="util-config__title">Clock Settings</h2>

    {#if utilityType === 'clock'}
      <label class="util-config__field">
        <span class="util-config__label">Time Format</span>
        <select
          class="util-config__select"
          value={hour12 ? '12' : '24'}
          onchange={(e) => (hour12 = e.currentTarget.value === '12')}
        >
          <option value="12">12-hour (7:29 PM)</option>
          <option value="24">24-hour (19:29)</option>
        </select>
      </label>
    {/if}

    <div class="util-config__actions">
      <button type="button" class="util-config__btn util-config__btn--cancel" onclick={onclose}>
        Cancel
      </button>
      <button type="button" class="util-config__btn util-config__btn--save" onclick={handleSave}>
        Save
      </button>
    </div>
  </div>
</div>

<style>
  .util-config-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }

  .util-config-panel {
    background: var(--accretion);
    border: 1px solid var(--edge-bright);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    width: min(360px, 90vw);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .util-config__title {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--starlight);
    letter-spacing: var(--tracking-wide);
    margin: 0;
  }

  .util-config__field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .util-config__label {
    font-size: var(--text-xs);
    color: var(--dim-light);
    font-family: var(--font-mono);
    letter-spacing: var(--tracking-wide);
  }

  .util-config__select {
    background: var(--event-horizon);
    border: 1px solid var(--edge);
    border-radius: var(--radius-sm);
    color: var(--starlight);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-3);
  }

  .util-config__select:focus {
    outline: none;
    border-color: var(--ember-dim);
  }

  .util-config__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
    padding-top: var(--space-2);
    border-top: 1px solid var(--edge);
  }

  .util-config__btn {
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

  .util-config__btn--cancel {
    background: transparent;
    border: 1px solid var(--edge);
    color: var(--dim-light);
  }

  .util-config__btn--cancel:hover {
    border-color: var(--edge-bright);
    color: var(--starlight);
  }

  .util-config__btn--save {
    background: var(--ember-glow);
    border: 1px solid var(--ember-dim);
    color: var(--ember);
  }

  .util-config__btn--save:hover {
    background: var(--ember-dim);
    color: var(--starlight);
  }
</style>
