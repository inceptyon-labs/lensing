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
  import EditBar from './EditBar.svelte';
  import { createEditHistory } from './edit-history';
  import { onMount, tick } from 'svelte';
  import '../styles/grid-layout.css';

  const LAYOUT_KEY = 'lensing-dashboard-layout';

  interface Props {
    plugins: PluginAdminEntry[];
    allPlugins?: PluginAdminEntry[];
    onsave?: (widgets: GridWidget[]) => void;
  }

  let { plugins, allPlugins = [], onsave }: Props = $props();

  let dashboardRef: HTMLDivElement;
  let editMode = $state(false);
  let showPicker = $state(false);
  let activeContextWidget = $state<GridWidget | null>(null);
  let contextMenuPos = $state<{ x: number; y: number } | null>(null);
  let activeResizeWidget = $state<GridWidget | null>(null);
  let localWidgets = $state<GridWidget[]>([]);
  let savedLayout = $state<GridWidget[] | null>(null);
  let history = $state(createEditHistory([]));

  let initialWidgets = $derived(pluginsToGridWidgets(plugins));

  // Load saved layout from localStorage on mount
  onMount(() => {
    try {
      const stored = localStorage.getItem(LAYOUT_KEY);
      if (stored) savedLayout = JSON.parse(stored) as GridWidget[];
    } catch {
      // ignore corrupt storage
    }
  });

  $effect(() => {
    // Sync from plugins when they change, unless user is actively editing.
    // If user has a saved layout, merge it with current plugins instead of
    // resetting to defaults (preserves custom positions across reloads).
    if (editMode) return;

    const defaults = initialWidgets;
    let widgets: GridWidget[];
    if (savedLayout) {
      const savedIds = new Set(savedLayout.map((w) => w.id));
      // Keep all saved widgets (user explicitly placed them), plus any new
      // defaults that weren't in the saved layout yet.
      widgets = [
        ...savedLayout,
        ...defaults.filter((w) => !savedIds.has(w.id)),
      ];
    } else {
      widgets = [...defaults];
    }
    localWidgets = widgets;
    // Use the local variable (not localWidgets $state) to avoid read-after-write loop
    history = createEditHistory(widgets);
  });

  let gridWidgets = $derived(localWidgets);

  // Derive reactive history flags — reading `localWidgets` forces re-evaluation
  // since localWidgets is always updated alongside every history operation.
  let canUndo = $derived.by(() => {
    void localWidgets;
    return history.canUndo();
  });
  let canRedo = $derived.by(() => {
    void localWidgets;
    return history.canRedo();
  });
  let isDirty = $derived.by(() => {
    void localWidgets;
    return history.isDirty();
  });

  /** Map plugin_id to its PluginAdminEntry for quick lookup */
  let pluginMap = $derived(new Map(plugins.filter((p) => p.enabled).map((p) => [p.plugin_id, p])));

  /** Plugins from allPlugins not yet placed on the grid */
  let availablePlugins = $derived(
    allPlugins.filter((p) => !gridWidgets.some((w) => w.id === p.plugin_id))
  );

  function handleGridChange(updatedWidgets: GridWidget[]) {
    history.pushState(updatedWidgets);
    localWidgets = updatedWidgets;
  }

  function toggleEditMode() {
    if (editMode) {
      // Exiting edit mode — cancel unsaved changes
      handleCancel();
      return;
    }
    editMode = true;
    // Snapshot current state as edit-session baseline
    history = createEditHistory(localWidgets);
  }

  function handleUndo() {
    const restored = history.undo();
    localWidgets = restored;
  }

  function handleRedo() {
    const restored = history.redo();
    localWidgets = restored;
  }

  function handleCancel() {
    // Revert to saved layout (or defaults if none saved)
    const baseline = savedLayout ?? initialWidgets;
    history.reset(baseline);
    localWidgets = [...baseline];
    editMode = false;
    showPicker = false;
    activeContextWidget = null;
    activeResizeWidget = null;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!editMode) return;

    // Escape → Cancel
    if (event.key === 'Escape') {
      event.preventDefault();
      handleCancel();
      return;
    }

    const key = event.key.toLowerCase();

    // Ctrl+Shift+Z / Cmd+Shift+Z → Redo (check before undo)
    if ((event.ctrlKey || event.metaKey) && key === 'z' && event.shiftKey) {
      event.preventDefault();
      handleRedo();
      return;
    }

    // Ctrl+Z / Cmd+Z → Undo
    if ((event.ctrlKey || event.metaKey) && key === 'z' && !event.shiftKey) {
      event.preventDefault();
      handleUndo();
      return;
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
    const updated = [...localWidgets, newWidget];
    history.pushState(updated);
    localWidgets = updated;
    showPicker = false;
  }

  function handleDeleteWidget(widgetId: string) {
    const updated = localWidgets.filter((w) => w.id !== widgetId);
    history.pushState(updated);
    localWidgets = updated;
    activeContextWidget = null;
  }

  function handleResizeWidget(widget: GridWidget) {
    activeContextWidget = null;
    activeResizeWidget = widget;
  }

  function handleResizeConfirm(pos: WidgetPosition) {
    if (!activeResizeWidget) return;
    const id = activeResizeWidget.id;
    const updated = localWidgets.map((w) => (w.id === id ? { ...w, ...pos } : w));
    history.pushState(updated);
    localWidgets = updated;
    activeResizeWidget = null;
  }

  function handleSave() {
    // Persist layout to localStorage and update saved baseline
    savedLayout = [...gridWidgets];
    try {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(gridWidgets));
    } catch {
      // storage full or unavailable — layout still saved in memory
    }
    onsave?.(gridWidgets);
    history.reset(gridWidgets);
    editMode = false;
    showPicker = false;
    activeContextWidget = null;
    activeResizeWidget = null;
  }

  // Portal: move Svelte-rendered plugin content into GridStack item containers.
  // GridStack owns the grid layout DOM; Svelte owns the plugin component DOM.
  // This effect bridges them by moving content divs into their matching grid cells.
  $effect(() => {
    // Track widget IDs so effect re-runs when grid changes
    void gridWidgets.map((w) => w.id);
    tick().then(portalWidgetContent);
  });

  function portalWidgetContent() {
    if (!dashboardRef) return;
    for (const widget of gridWidgets) {
      const safeId = CSS.escape(widget.id);
      // Find the GridStack target container
      const target = dashboardRef.querySelector<HTMLElement>(
        `.gs-item-content[data-widget-id="${safeId}"]`
      );
      if (!target) continue;
      // Already portaled?
      if (target.querySelector('.dashboard-widget-content')) continue;
      // Find the hidden Svelte-rendered content (direct child of dashboard)
      const source = dashboardRef.querySelector<HTMLElement>(
        `:scope > .dashboard-widget-content[data-widget-id="${safeId}"]`
      );
      if (!source) continue;
      // Portal: move into GridStack container (CSS handles visibility)
      target.appendChild(source);
    }
  }

  function openWidgetMenu(widgetId: string, x: number, y: number) {
    const widget = gridWidgets.find((w) => w.id === widgetId);
    if (widget) {
      activeContextWidget = widget;
      contextMenuPos = { x, y };
    }
  }

  function handleGearClick(event: MouseEvent, widgetId: string) {
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    openWidgetMenu(widgetId, rect.left, rect.bottom + 4);
  }

  function handleGridContextMenu(event: MouseEvent) {
    if (!editMode) return;
    let target = event.target as HTMLElement;
    while (target && target !== event.currentTarget) {
      const widgetId = target.getAttribute('data-widget-id');
      if (widgetId) {
        event.preventDefault();
        openWidgetMenu(widgetId, event.clientX, event.clientY);
        break;
      }
      target = target.parentElement || (event.currentTarget as HTMLElement);
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="dashboard-grid"
  class:dashboard-edit-mode={editMode}
  oncontextmenu={handleGridContextMenu}
  bind:this={dashboardRef}
>
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

  <!-- Plugin content rendered for each widget (transferred to grid tiles at runtime) -->
  {#each gridWidgets as widget (widget.id)}
    {@const plugin = pluginMap.get(widget.id)}
    {#if plugin}
      <div class="dashboard-widget-content" data-widget-id={widget.id}>
        {#if editMode}
          <button
            type="button"
            class="widget-gear-btn"
            aria-label="Widget settings for {plugin.manifest.name}"
            onclick={(e) => handleGearClick(e, widget.id)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492ZM6.754 8a1.246 1.246 0 1 1 2.492 0 1.246 1.246 0 0 1-2.492 0Z"/>
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0a1.97 1.97 0 0 1-2.929 1.1c-1.541-.971-3.37.858-2.4 2.4a1.97 1.97 0 0 1-1.1 2.929c-1.79.527-1.79 3.065 0 3.592a1.97 1.97 0 0 1 1.1 2.929c-.971 1.541.858 3.37 2.4 2.4a1.97 1.97 0 0 1 2.929 1.1c.527 1.79 3.065 1.79 3.592 0a1.97 1.97 0 0 1 2.929-1.1c1.541.971 3.37-.858 2.4-2.4a1.97 1.97 0 0 1 1.1-2.929c1.79-.527 1.79-3.065 0-3.592a1.97 1.97 0 0 1-1.1-2.929c.971-1.541-.858-3.37-2.4-2.4a1.97 1.97 0 0 1-2.929-1.1ZM8 6.754a1.246 1.246 0 1 0 0 2.492 1.246 1.246 0 0 0 0-2.492ZM4.754 8a3.246 3.246 0 1 1 6.492 0 3.246 3.246 0 0 1-6.492 0Z"/>
            </svg>
          </button>
        {/if}
        <ErrorBoundary name={plugin.manifest.name}>
          <PluginRenderer {plugin} />
        </ErrorBoundary>
      </div>
    {/if}
  {/each}

  <!-- Edit mode toolbar -->
  <div class="dashboard-toolbar">
    {#if editMode}
      <button
        class="dashboard-add-btn"
        type="button"
        onclick={() => (showPicker = true)}
        aria-label="Add Widget"
      >
        Add Widget
      </button>

      <EditBar
        onsave={handleSave}
        oncancel={handleCancel}
        onundo={handleUndo}
        onredo={handleRedo}
        {canUndo}
        {canRedo}
        dirty={isDirty}
      />
    {:else}
      <button
        class="dashboard-edit-toggle"
        type="button"
        aria-pressed={editMode}
        onclick={toggleEditMode}
      >
        Edit Layout
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
      x={contextMenuPos?.x ?? 0}
      y={contextMenuPos?.y ?? 0}
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

  /* Widget content containers: hidden by default, visible when portaled
     into GridStack cells via the portalWidgetContent effect. */
  .dashboard-widget-content {
    display: none;
  }

  :global(.gs-item-content) .dashboard-widget-content {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
  }

  /* Gear settings button — top-right of each widget in edit mode */
  .widget-gear-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 20;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--event-horizon);
    border: 1px solid var(--edge-bright);
    border-radius: var(--radius-sm);
    color: var(--dim-light);
    cursor: pointer;
    pointer-events: auto;
    opacity: 0.7;
    transition:
      opacity var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out);
  }

  .widget-gear-btn:hover {
    opacity: 1;
    color: var(--ember);
    border-color: var(--ember-dim);
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
  .dashboard-add-btn {
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
</style>
