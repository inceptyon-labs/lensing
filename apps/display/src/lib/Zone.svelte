<script lang="ts">
  import { createZoneStyle } from './config';
  import type { ZoneConfig } from './config';

  export let name: string;
  export let rows: number = 1;
  export let columns: number = 1;

  $: config = { name, rows, columns } satisfies ZoneConfig;
  $: gridStyle = createZoneStyle(config);
</script>

<section
  class="zone"
  data-zone={name}
  style="display: grid; {gridStyle}"
  aria-label="Zone: {name}"
>
  <slot />
</section>

<style>
  .zone {
    overflow: hidden;
    gap: var(--space-2);
    padding: var(--space-2);
    background-color: transparent;
  }
</style>
