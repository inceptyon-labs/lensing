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

      // Listen for changes
      gridInstance.on('change', () => {
        if (onchange) {
          const updated = extractWidgets();
          onchange(updated);
        }
      });

      gridInstance.on('added', (_event: unknown, addedItems: { id?: string }[]) => {
        if (onadd && addedItems.length > 0) {
          for (const item of addedItems) {
            const w = widgetFromNode(item);
            if (w) onadd(w);
          }
        }
      });

      gridInstance.on('removed', (_event: unknown, removedItems: { id?: string }[]) => {
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
    gridInstance.removeAll(false);
    for (const w of widgets) {
      // Validate widget ID is safe (alphanumeric + dash/underscore only)
      const safeId = /^[a-zA-Z0-9_-]+$/.test(w.id) ? w.id : 'invalid-widget';
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
    if (gridInstance && items) {
      syncItems(items);
    }
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
