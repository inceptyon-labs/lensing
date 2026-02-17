<script lang="ts">
  import Layout from '../lib/Layout.svelte';
  import Placeholder from '../lib/Placeholder.svelte';
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Lensing Display</title>
</svelte:head>

<Layout>
  <svelte:fragment slot="top-bar">
    <Placeholder title="Status Bar" index={0} />
  </svelte:fragment>

  <svelte:fragment slot="left-col">
    <Placeholder title="Navigation" index={0} />
    <Placeholder title="Panel" index={1} />
    <Placeholder title="Info" index={2} />
  </svelte:fragment>

  <svelte:fragment slot="center">
    <Placeholder title="Main View" index={0} />
    <Placeholder title="Content" index={1} />
    <Placeholder title="Primary" index={2} />
    <Placeholder title="Secondary" index={3} />
    <Placeholder title="Tertiary" index={4} />
    <Placeholder title="Detail" index={5} />
  </svelte:fragment>

  <svelte:fragment slot="right-col">
    <Placeholder title="Controls" index={0} />
    <Placeholder title="Settings" index={1} />
    <Placeholder title="Actions" index={2} />
  </svelte:fragment>

  <svelte:fragment slot="bottom-bar">
    <Placeholder title="Status" index={0} />
  </svelte:fragment>
</Layout>
