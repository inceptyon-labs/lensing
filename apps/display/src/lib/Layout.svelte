<script lang="ts">
  import Zone from './Zone.svelte';
  import { DEFAULT_LAYOUT } from './config';
  import type { LayoutConfig } from './config';

  export let config: LayoutConfig = DEFAULT_LAYOUT;

  $: topBar = config.zones.find((z) => z.name === 'top-bar') ?? {
    name: 'top-bar',
    rows: 1,
    columns: 4,
  };
  $: leftCol = config.zones.find((z) => z.name === 'left-col') ?? {
    name: 'left-col',
    rows: 3,
    columns: 1,
  };
  $: center = config.zones.find((z) => z.name === 'center') ?? {
    name: 'center',
    rows: 3,
    columns: 2,
  };
  $: rightCol = config.zones.find((z) => z.name === 'right-col') ?? {
    name: 'right-col',
    rows: 3,
    columns: 1,
  };
  $: bottomBar = config.zones.find((z) => z.name === 'bottom-bar') ?? {
    name: 'bottom-bar',
    rows: 1,
    columns: 4,
  };
</script>

<div class="layout">
  <div class="zone-top-bar">
    <Zone name="top-bar" rows={topBar.rows} columns={topBar.columns}>
      <slot name="top-bar" />
    </Zone>
  </div>

  <div class="zone-left-col">
    <Zone name="left-col" rows={leftCol.rows} columns={leftCol.columns}>
      <slot name="left-col" />
    </Zone>
  </div>

  <div class="zone-center">
    <Zone name="center" rows={center.rows} columns={center.columns}>
      <slot name="center" />
    </Zone>
  </div>

  <div class="zone-right-col">
    <Zone name="right-col" rows={rightCol.rows} columns={rightCol.columns}>
      <slot name="right-col" />
    </Zone>
  </div>

  <div class="zone-bottom-bar">
    <Zone name="bottom-bar" rows={bottomBar.rows} columns={bottomBar.columns}>
      <slot name="bottom-bar" />
    </Zone>
  </div>
</div>

<style>
  .layout {
    display: grid;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: var(--void);
    grid-template-areas:
      'top-bar    top-bar  top-bar   top-bar'
      'left-col   center   center    right-col'
      'bottom-bar bottom-bar bottom-bar bottom-bar';
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 200px 1fr 1fr 200px;
  }

  .zone-top-bar {
    grid-area: top-bar;
    border-bottom: 1px solid var(--edge);
  }

  .zone-left-col {
    grid-area: left-col;
    border-right: 1px solid var(--edge);
  }

  .zone-center {
    grid-area: center;
    flex: 1;
  }

  .zone-right-col {
    grid-area: right-col;
    border-left: 1px solid var(--edge);
  }

  .zone-bottom-bar {
    grid-area: bottom-bar;
    border-top: 1px solid var(--edge);
  }
</style>
