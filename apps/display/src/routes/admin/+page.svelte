<script lang="ts">
  import AdminPluginList from '../../lib/AdminPluginList.svelte';
</script>

<svelte:head>
  <title>Admin — Lensing</title>
</svelte:head>

<div class="admin-page">
  <header class="admin-header">
    <div class="admin-nav">
      <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
      <a href="/" class="back-link">← Back to Display</a>
    </div>
    <h1 class="admin-title">Admin</h1>
  </header>

  <main class="admin-main">
    <AdminPluginList />
  </main>
</div>

<style>
  :global(body) {
    overflow: auto;
  }

  .admin-page {
    min-height: 100vh;
    background-color: var(--void);
    overflow: auto;
    color: var(--starlight);
  }

  .admin-header {
    padding: var(--space-4) var(--space-6);
    border-bottom: 1px solid var(--edge);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    position: sticky;
    top: 0;
    background-color: var(--void);
    z-index: 10;
  }

  .admin-nav {
    display: flex;
    align-items: center;
  }

  .back-link {
    font-size: var(--text-sm);
    color: var(--dim-light);
    text-decoration: none;
    font-family: var(--font-mono);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .back-link:hover {
    color: var(--ember);
  }

  .admin-title {
    font-size: var(--text-xl);
    font-weight: var(--weight-semibold);
    color: var(--starlight);
    margin: 0;
  }

  .admin-main {
    padding: var(--space-6);
    max-width: 800px;
    margin: 0 auto;
  }
</style>
