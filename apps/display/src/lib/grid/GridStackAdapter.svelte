<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { GridWidget, GridPolicy } from './types';
  import { DEFAULT_GRID_POLICY } from './types';
  import { isMobileViewport, MOBILE_COLUMNS, getMobileGridPolicy } from './mobile-config';

  interface Props {
    items: GridWidget[];
    editMode?: boolean;
    options?: GridPolicy;
    onchange?: (widgets: GridWidget[]) => void;
    onadd?: (widget: GridWidget) => void;
    onremove?: (widget: GridWidget) => void;
    widget?: Snippet<[{ widget: GridWidget }]>;
  }

  let {
    items = [],
    editMode = false,
    options = DEFAULT_GRID_POLICY,
    onchange,
    onadd,
    onremove,
    widget: widgetSnippet,
  }: Props = $props();

  let gridEl: HTMLDivElement | undefined = $state(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let gridInstance: any = $state(undefined);
  let syncing = false;

  onMount(() => {
    // GridStack.js is loaded via CDN <script> tag at runtime.
    // Access it from the window global — never imported as a module.
    void initGrid();

    return () => {
      if (gridInstance) {
        gridInstance.destroy(false);
        gridInstance = undefined;
      }
    };
  });

  function initGrid() {
    if (!gridEl) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const GridStack = (globalThis as any).GridStack;
    if (!GridStack) {
      // GridStack.js not loaded — static fallback will render
      return;
    }

    try {
      // Use mobile policy when viewport is small (responsive column count)
      const mobile = isMobileViewport();
      const activeOptions = mobile ? getMobileGridPolicy() : options;
      const responsiveColumns = mobile ? MOBILE_COLUMNS : options.columns;
      const touchDelay = activeOptions.touchDelay ?? 0;
      const moveTolerance = activeOptions.moveTolerance ?? 0;

      gridInstance = GridStack.init(
        {
          column: responsiveColumns,
          cellHeight: activeOptions.rowHeight,
          margin: `${activeOptions.margin[0]}px`,
          float: activeOptions.float ?? false,
          animate: (activeOptions.animate ?? 150) > 0,
          resizable: { handles: activeOptions.resizeHandles.join(',') },
          staticGrid: !editMode,
          minRow: activeOptions.minRow ?? 1,
          // Touch support: hold delay and movement tolerance
          draggable: {
            touchDelay,
          },
          ...(moveTolerance > 0 ? { moveTolerance } : {}),
        },
        gridEl
      );

      // Sync initial items
      syncItems(items);

      // Listen for changes (skip events triggered by our own syncItems)
      gridInstance.on('change', () => {
        if (syncing) return;
        if (onchange) {
          const updated = extractWidgets();
          onchange(updated);
        }
      });

      gridInstance.on('added', (_event: unknown, addedItems: { id?: string }[]) => {
        if (syncing) return;
        if (onadd && addedItems.length > 0) {
          for (const item of addedItems) {
            const w = widgetFromNode(item);
            if (w) onadd(w);
          }
        }
      });

      gridInstance.on('removed', (_event: unknown, removedItems: { id?: string }[]) => {
        if (syncing) return;
        if (onremove && removedItems.length > 0) {
          for (const item of removedItems) {
            const w = widgetFromNode(item);
            if (w) onremove(w);
          }
        }
      });
    } catch {
      // GridStack init failed — static fallback will render
    }
  }

  function syncItems(widgets: GridWidget[]) {
    if (!gridInstance) return;
    syncing = true;
    gridInstance.batchUpdate();

    // Build map of currently rendered grid items by ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, svelte/prefer-svelte-reactivity
    const currentEls = new Map<string, any>();
    for (const el of gridInstance.getGridItems()) {
      const id = el.gridstackNode?.id;
      if (id) currentEls.set(id, el);
    }

    const targetIds = new Set(widgets.map((w) => w.id));

    // Remove items no longer needed
    for (const [id, el] of currentEls) {
      if (!targetIds.has(id)) {
        gridInstance.removeWidget(el);
      }
    }

    // Add new items or update existing ones (preserves DOM for portaled content)
    for (const w of widgets) {
      const safeId = /^[a-zA-Z0-9_-]+$/.test(w.id) ? w.id : 'invalid-widget';
      const existing = currentEls.get(safeId);

      if (existing) {
        // Update position/size — preserves DOM and any portaled content
        gridInstance.update(existing, {
          x: w.x,
          y: w.y,
          w: w.w,
          h: w.h,
          minW: w.minW,
          minH: w.minH,
          maxW: w.maxW,
          maxH: w.maxH,
        });
      } else {
        // Add new widget with empty content placeholder
        gridInstance.addWidget({
          id: safeId,
          x: w.x,
          y: w.y,
          w: w.w,
          h: w.h,
          minW: w.minW,
          minH: w.minH,
          maxW: w.maxW,
          maxH: w.maxH,
          locked: w.locked,
          // Use DOM creation instead of string interpolation to avoid XSS
          content: (() => {
            const div = document.createElement('div');
            div.className = 'gs-item-content';
            div.setAttribute('data-widget-id', safeId);
            return div.outerHTML;
          })(),
        });
      }
    }

    gridInstance.batchUpdate(false);
    syncing = false;
  }

  function extractWidgets(): GridWidget[] {
    if (!gridInstance) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return gridInstance.getGridItems().map((el: any) => {
      const node = el.gridstackNode;
      return {
        id: node?.id ?? '',
        x: node?.x ?? 0,
        y: node?.y ?? 0,
        w: node?.w ?? 1,
        h: node?.h ?? 1,
      } satisfies GridWidget;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function widgetFromNode(node: any): GridWidget | null {
    if (!node) return null;
    return {
      id: node.id ?? '',
      x: node.x ?? 0,
      y: node.y ?? 0,
      w: node.w ?? 1,
      h: node.h ?? 1,
    };
  }

  $effect(() => {
    if (gridInstance) {
      gridInstance.setStatic(!editMode);
    }
  });

  $effect(() => {
    if (!gridInstance) return;
    // Build a snapshot to ensure effect tracks each widget's identity and position.
    // Without this, Svelte 5 may not detect array content changes.
    const snapshot: GridWidget[] = items.map((i) => ({
      id: i.id,
      x: i.x,
      y: i.y,
      w: i.w,
      h: i.h,
      minW: i.minW,
      minH: i.minH,
      maxW: i.maxW,
      maxH: i.maxH,
      locked: i.locked,
    }));
    syncItems(snapshot);
  });
</script>

<div class="grid-stack" bind:this={gridEl}>
  {#if !gridInstance}
    <!-- Static fallback when GridStack.js is not loaded (SSR / test) -->
    {#each items as item (item.id)}
      <div
        class="grid-stack-item"
        data-gs-id={item.id}
        data-gs-x={item.x}
        data-gs-y={item.y}
        data-gs-w={item.w}
        data-gs-h={item.h}
      >
        <div class="grid-stack-item-content gs-item-content" data-widget-id={item.id}>
          {#if widgetSnippet}
            {@render widgetSnippet({ widget: item })}
          {/if}
        </div>
      </div>
    {/each}
  {/if}
</div>
