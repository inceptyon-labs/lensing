<script lang="ts">
  import Layout from '../lib/Layout.svelte';
  import Placeholder from '../lib/Placeholder.svelte';
  import ErrorBoundary from '../lib/ErrorBoundary.svelte';
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Lensing Display</title>
</svelte:head>

<Layout>
  <svelte:fragment slot="top-bar">
    <ErrorBoundary name="Status Bar">
      <Placeholder title="Status Bar" index={0} />
    </ErrorBoundary>
    <a href="/admin" class="admin-link">Admin</a>
  </svelte:fragment>

  <svelte:fragment slot="left-col">
    <ErrorBoundary name="Navigation">
      <Placeholder title="Navigation" index={0} />
    </ErrorBoundary>
    <ErrorBoundary name="Panel">
      <Placeholder title="Panel" index={1} />
    </ErrorBoundary>
    <ErrorBoundary name="Info">
      <Placeholder title="Info" index={2} />
    </ErrorBoundary>
  </svelte:fragment>

  <svelte:fragment slot="center">
    <ErrorBoundary name="Main View">
      <Placeholder title="Main View" index={0} />
    </ErrorBoundary>
    <ErrorBoundary name="Content">
      <Placeholder title="Content" index={1} />
    </ErrorBoundary>
    <ErrorBoundary name="Primary">
      <Placeholder title="Primary" index={2} />
    </ErrorBoundary>
    <ErrorBoundary name="Secondary">
      <Placeholder title="Secondary" index={3} />
    </ErrorBoundary>
    <ErrorBoundary name="Tertiary">
      <Placeholder title="Tertiary" index={4} />
    </ErrorBoundary>
    <ErrorBoundary name="Detail">
      <Placeholder title="Detail" index={5} />
    </ErrorBoundary>
  </svelte:fragment>

  <svelte:fragment slot="right-col">
    <ErrorBoundary name="Controls">
      <Placeholder title="Controls" index={0} />
    </ErrorBoundary>
    <ErrorBoundary name="Settings">
      <Placeholder title="Settings" index={1} />
    </ErrorBoundary>
    <ErrorBoundary name="Actions">
      <Placeholder title="Actions" index={2} />
    </ErrorBoundary>
  </svelte:fragment>

  <svelte:fragment slot="bottom-bar">
    <ErrorBoundary name="Status">
      <Placeholder title="Status" index={0} />
    </ErrorBoundary>
  </svelte:fragment>
</Layout>

<style>
  .admin-link {
    font-size: var(--text-xs);
    color: var(--dim-light);
    text-decoration: none;
    font-family: var(--font-mono);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .admin-link:hover {
    color: var(--ember);
  }
</style>
