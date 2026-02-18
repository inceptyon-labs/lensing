<script lang="ts">
  /** The plugin/widget name to display in the error tile */
  export let name: string = 'Widget';

  function handleError(error: unknown, reset: () => void) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ErrorBoundary] "${name}" crashed:`, error);
  }

  function retry(reset: () => void) {
    reset();
  }
</script>

<svelte:boundary onerror={handleError}>
  <slot />

  {#snippet failed(error, reset)}
    <div class="error-tile" role="alert" aria-label="Error in {name}">
      <div class="error-icon" aria-hidden="true">⚠</div>
      <div class="error-name">{name}</div>
      <div class="error-message">
        {error instanceof Error ? error.message : 'An error occurred'}
      </div>
      <button class="retry-btn" onclick={() => retry(reset)}> Retry </button>
    </div>
  {/snippet}
</svelte:boundary>

<style>
  .error-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-4);
    background-color: var(--event-horizon);
    border: 1px solid var(--alert-urgent);
    border-radius: var(--radius-md);
    color: var(--starlight);
    min-height: 80px;
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--alert-urgent) 20%, transparent);
  }

  .error-icon {
    font-size: var(--text-lg);
    color: var(--alert-urgent);
  }

  .error-name {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--starlight);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .error-message {
    font-size: var(--text-xs);
    color: var(--dim-light);
    font-family: var(--font-mono);
    text-align: center;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .retry-btn {
    margin-top: var(--space-2);
    padding: var(--space-1) var(--space-3);
    background-color: transparent;
    border: 1px solid var(--ember);
    border-radius: var(--radius-sm);
    color: var(--ember);
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-out);
  }

  .retry-btn:hover {
    background-color: var(--ember-trace);
  }

  .retry-btn:focus-visible {
    outline: 2px solid var(--edge-focus);
    outline-offset: 2px;
  }
</style>
