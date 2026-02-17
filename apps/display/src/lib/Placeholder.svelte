<script lang="ts">
  export let title: string = 'Widget';
  export let index: number = 0;
</script>

<div class="placeholder" aria-label="Placeholder widget {index + 1}: {title}">
  <span class="label">{title}</span>
  <span class="index">#{index + 1}</span>
</div>

<style>
  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-4);
    background-color: var(--event-horizon);
    border: 1px solid var(--edge);
    border-radius: var(--radius-md);
    color: var(--starlight);
    box-shadow: 0 0 0 1px var(--edge);
    transition: box-shadow var(--duration-fast) var(--ease-out);
    min-height: 80px;
  }

  .placeholder:hover {
    box-shadow:
      0 0 0 1px var(--edge-bright),
      0 0 20px var(--ember-trace);
  }

  .label {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--starlight);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .index {
    font-size: var(--text-xs);
    color: var(--dim-light);
    font-family: var(--font-mono);
  }
</style>
