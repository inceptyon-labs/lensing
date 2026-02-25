<script lang="ts">
  import type { PluginAdminEntry } from '@lensing/types';
  import type { GridWidget } from './types';
  import { DEFAULT_GRID_POLICY } from './types';
  import { pluginsToGridWidgets } from './default-layouts';
  import { getPreferredSize } from './widget-sizes';
  import type { WidgetPosition } from './resize-modal-validation';
  import GridStackAdapter from './GridStackAdapter.svelte';
  import PluginRenderer from '../PluginRenderer.svelte';
  import ErrorBoundary from '../ErrorBoundary.svelte';
  import WidgetPicker from './WidgetPicker.svelte';
  import WidgetContextMenu from './WidgetContextMenu.svelte';
  import WidgetResizeModal from './WidgetResizeModal.svelte';
  import '../styles/grid-layout.css';

  interface Props {
    plugins: PluginAdminEntry[];
    allPlugins?: PluginAdminEntry[];
    onsave?: (widgets: GridWidget[]) => void;
  }

  let { plugins, allPlugins = [], onsave }: Props = $props();

  let editMode = $state(false);
  let showPicker = $state(false);
  let activeContextWidget = $state<GridWidget | null>(null);
  let activeResizeWidget = $state<GridWidget | null>(null);
  let localWidgets = $state<GridWidget[]>([]);

  let initialWidgets = $derived(pluginsToGridWidgets(plugins));

  $effect(() => {
    // Sync initial widgets from plugins on first load
    if (localWidgets.length === 0) {
      localWidgets = [...initialWidgets];
    }
  });

  let gridWidgets = $derived(localWidgets.length > 0 ? localWidgets : initialWidgets);

  /** Map plugin_id to its PluginAdminEntry for quick lookup */
  let pluginMap = $derived(new Map(plugins.filter((p) => p.enabled).map((p) => [p.plugin_id, p])));

  /** Plugins from allPlugins not yet placed on the grid */
  let availablePlugins = $derived(
    allPlugins.filter((p) => !gridWidgets.some((w) => w.id === p.plugin_id))
  );

  function handleGridChange(updatedWidgets: GridWidget[]) {
    localWidgets = updatedWidgets;
  }

  function toggleEditMode() {
    editMode = !editMode;
    if (!editMode) {
      showPicker = false;
      activeContextWidget = null;
      activeResizeWidget = null;
    }
  }

  function handleAddWidget(plugin: PluginAdminEntry) {
    const preferred = getPreferredSize(plugin.plugin_id, plugin.manifest);
    const newWidget: GridWidget = {
      id: plugin.plugin_id,
      x: 0,
      y: 0,
      w: preferred.w,
      h: preferred.h,
    };
    localWidgets = [...localWidgets, newWidget];
    showPicker = false;
  }

  function handleDeleteWidget(widgetId: string) {
    localWidgets = localWidgets.filter((w) => w.id !== widgetId);
    activeContextWidget = null;
  }

  function handleResizeWidget(widget: GridWidget) {
    activeContextWidget = null;
    activeResizeWidget = widget;
  }

  function handleResizeConfirm(pos: WidgetPosition) {
    if (!activeResizeWidget) return;
    const id = activeResizeWidget.id;
    localWidgets = localWidgets.map((w) => (w.id === id ? { ...w, ...pos } : w));
    activeResizeWidget = null;
  }

  function handleSave() {
    onsave?.(gridWidgets);
  }
</script>

<div class="dashboard-grid" class:dashboard-edit-mode={editMode}>
  <GridStackAdapter
    items={gridWidgets}
    {editMode}
    options={DEFAULT_GRID_POLICY}
    onchange={handleGridChange}
  />

  {#if gridWidgets.length === 0}
    <div class="dashboard-empty">
      <p class="dashboard-empty__text">
        No plugins enabled. Visit the admin panel to configure your dashboard.
      </p>
    </div>
  {/if}

  <!-- Plugin content rendered for each widget -->
  {#each gridWidgets as widget (widget.id)}
    {@const plugin = pluginMap.get(widget.id)}
    {#if plugin}
      <div class="dashboard-widget-content" data-plugin-id={widget.id} style="display: none;">
        <ErrorBoundary name={plugin.manifest.name}>
          <PluginRenderer {plugin} />
        </ErrorBoundary>
      </div>
    {/if}
  {/each}

  <!-- Edit mode toolbar -->
  <div class="dashboard-toolbar">
    <button
      class="dashboard-edit-toggle"
      type="button"
      aria-pressed={editMode}
      onclick={toggleEditMode}
    >
      {editMode ? 'Done' : 'Edit Layout'}
    </button>

    {#if editMode}
      <button
        class="dashboard-add-btn"
        type="button"
        onclick={() => (showPicker = true)}
        aria-label="Add Widget"
      >
        Add Widget
      </button>

      <button
        class="dashboard-save-btn"
        type="button"
        onclick={handleSave}
        aria-label="Save layout"
      >
        Save
      </button>
    {/if}
  </div>

  <!-- Widget context menu (shown on widget action in edit mode) -->
  {#if editMode && activeContextWidget}
    {@const contextPlugin =
      pluginMap.get(activeContextWidget.id) ??
      allPlugins.find((p) => p.plugin_id === activeContextWidget!.id)}
    <WidgetContextMenu
      pluginId={activeContextWidget.id}
      pluginName={contextPlugin?.manifest.name ?? activeContextWidget.id}
      ondelete={() => handleDeleteWidget(activeContextWidget!.id)}
      onresize={() => handleResizeWidget(activeContextWidget!)}
      onclose={() => (activeContextWidget = null)}
    />
  {/if}

  <!-- Widget resize modal -->
  {#if activeResizeWidget}
    <WidgetResizeModal
      x={activeResizeWidget.x}
      y={activeResizeWidget.y}
      w={activeResizeWidget.w}
      h={activeResizeWidget.h}
      minW={activeResizeWidget.minW}
      minH={activeResizeWidget.minH}
      maxW={activeResizeWidget.maxW}
      maxH={activeResizeWidget.maxH}
      pluginName={pluginMap.get(activeResizeWidget.id)?.manifest.name ?? activeResizeWidget.id}
      onconfirm={handleResizeConfirm}
      oncancel={() => (activeResizeWidget = null)}
    />
  {/if}

  <!-- Widget picker (add new widgets) -->
  {#if editMode && showPicker}
    <WidgetPicker {availablePlugins} onadd={handleAddWidget} onclose={() => (showPicker = false)} />
  {/if}
</div>

<style>
  .dashboard-grid {
    width: 100vw;
    height: 100vh;
    overflow: auto;
    position: relative;
    background-color: var(--void);
  }

  .dashboard-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: var(--space-8);
  }

  .dashboard-empty__text {
    color: var(--dim-light);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    text-align: center;
    letter-spacing: var(--tracking-wide);
  }

  /* Widget content containers are used as portals by GridStack.js.
     In static/SSR mode they are hidden; GridStack moves their content
     into grid-stack-item-content elements at runtime. */
  .dashboard-widget-content {
    display: none;
  }

  .dashboard-toolbar {
    position: fixed;
    bottom: var(--space-4);
    right: var(--space-4);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    z-index: 100;
  }

  .dashboard-edit-toggle,
  .dashboard-add-btn,
  .dashboard-save-btn {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out);
  }

  .dashboard-edit-toggle {
    background: var(--event-horizon);
    border: 1px solid var(--edge);
    color: var(--dim-light);
  }

  .dashboard-edit-toggle:hover,
  .dashboard-edit-toggle[aria-pressed='true'] {
    border-color: var(--ember-dim);
    color: var(--ember);
  }

  .dashboard-add-btn {
    background: var(--ember-glow);
    border: 1px solid var(--ember-dim);
    color: var(--ember);
  }

  .dashboard-add-btn:hover {
    background: var(--ember-dim);
    color: var(--starlight);
  }

  .dashboard-save-btn {
    background: transparent;
    border: 1px solid var(--edge);
    color: var(--dim-light);
  }

  .dashboard-save-btn:hover {
    border-color: var(--edge-bright);
    color: var(--starlight);
  }
</style>
