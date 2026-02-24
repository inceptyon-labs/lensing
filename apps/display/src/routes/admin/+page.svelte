<script lang="ts">
  import AdminPluginList from '../../lib/AdminPluginList.svelte';
  import AdminModuleSettings from '../../lib/AdminModuleSettings.svelte';

  let activeTab: 'plugins' | 'settings' = 'plugins';
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
    <div class="tab-bar" role="tablist" aria-label="Admin sections">
      <button
        class="tab-btn"
        class:tab-btn--active={activeTab === 'plugins'}
        on:click={() => (activeTab = 'plugins')}
        role="tab"
        aria-selected={activeTab === 'plugins'}
      >
        Plugins
      </button>
      <button
        class="tab-btn"
        class:tab-btn--active={activeTab === 'settings'}
        on:click={() => (activeTab = 'settings')}
        role="tab"
        aria-selected={activeTab === 'settings'}
      >
        Settings
      </button>
    </div>
  </header>

  <main class="admin-main">
    {#if activeTab === 'plugins'}
      <AdminPluginList />
    {:else}
      <AdminModuleSettings />
    {/if}
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

  .tab-bar {
    display: flex;
    gap: var(--space-1);
    border-bottom: 1px solid var(--edge-soft);
    padding-bottom: 0;
  }

  .tab-btn {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--dim-light);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    font-family: var(--font-sans);
    padding: var(--space-2) var(--space-3);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
    margin-bottom: -1px;
  }

  .tab-btn:hover {
    color: var(--starlight);
  }

  .tab-btn--active {
    color: var(--ember);
    border-bottom-color: var(--ember);
  }

  .admin-main {
    padding: var(--space-6);
    max-width: 800px;
    margin: 0 auto;
  }
</style>
