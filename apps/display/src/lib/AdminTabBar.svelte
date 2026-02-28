<script lang="ts">
  export let activeTab: 'modules' | 'plugins' | 'marketplace' | 'settings';
  export let onTabChange: (tab: 'modules' | 'plugins' | 'marketplace' | 'settings') => void =
    () => {};
  export let marketplaceCount: number = 0;
</script>

<nav class="tab-bar" role="tablist">
  <button
    class="tab"
    class:tab--active={activeTab === 'modules'}
    role="tab"
    aria-selected={activeTab === 'modules'}
    on:click={() => onTabChange('modules')}
  >
    Modules
  </button>
  <button
    class="tab"
    class:tab--active={activeTab === 'plugins'}
    role="tab"
    aria-selected={activeTab === 'plugins'}
    on:click={() => onTabChange('plugins')}
  >
    Plugins
  </button>
  <button
    class="tab"
    class:tab--active={activeTab === 'marketplace'}
    role="tab"
    aria-selected={activeTab === 'marketplace'}
    on:click={() => onTabChange('marketplace')}
  >
    Marketplace
    {#if marketplaceCount > 0}
      <span class="badge">{marketplaceCount} plugins</span>
    {/if}
  </button>
  <button
    class="tab"
    class:tab--active={activeTab === 'settings'}
    role="tab"
    aria-selected={activeTab === 'settings'}
    on:click={() => onTabChange('settings')}
  >
    Settings
  </button>
</nav>

<style>
  .tab-bar {
    display: flex;
    gap: var(--space-1);
    border-bottom: 1px solid var(--edge);
    margin-bottom: var(--space-4);
  }

  .tab {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    font-family: var(--font-mono);
    color: var(--dim-light);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .tab:hover {
    color: var(--starlight);
  }

  .tab--active {
    color: var(--ember);
    border-bottom-color: var(--ember);
  }

  .badge {
    display: inline-block;
    margin-left: var(--space-1);
    padding: 1px var(--space-2);
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    color: var(--dim-light);
    background: var(--accretion);
    border-radius: var(--radius-sm);
  }
</style>
