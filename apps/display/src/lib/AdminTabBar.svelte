<script lang="ts">
  export let activeTab: 'modules' | 'plugins';
  export let onTabChange: (tab: 'modules' | 'plugins') => void = () => {};
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
</style>
