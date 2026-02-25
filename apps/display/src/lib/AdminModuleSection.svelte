<script lang="ts">
  export let label: string;
</script>

<section class="module-section">
  <h2 class="section-header">{label}</h2>
  <div class="section-grid">
    <slot />
  </div>
</section>

<style>
  .module-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .section-header {
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    color: var(--faint-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    margin: 0;
    padding: 0 var(--space-1);
  }

  .section-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: var(--space-4);
  }
</style>
