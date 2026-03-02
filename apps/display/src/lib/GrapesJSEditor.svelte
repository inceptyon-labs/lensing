<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import grapesjs from 'grapesjs';
  import { registerWidgetBlocks, registerDataBlocks } from './grapes-blocks';
  import { configureStyleManager } from './grapes-style-manager';
  import {
    CANVAS_SIZES,
    CANVAS_SIZE_KEYS,
    DEFAULT_CANVAS_SIZE,
    type CanvasSize,
  } from './canvas-sizes';

  export let width: number | string = '100%';
  export let height: number | string = '600px';
  export let initialProject: Record<string, unknown> | undefined = undefined;
  export let slots: Array<{ id: string; label: string }> = [];
  /** Called with (html, css) whenever editor content changes */
  export let onChange: ((html: string, css: string) => void) | undefined = undefined;
  /** Called with the new size key whenever the canvas size changes */
  export let onSizeChange: ((size: CanvasSize) => void) | undefined = undefined;

  // @ts-ignore - Svelte bind:this element typing
  let container: any;
  let editor: unknown | null = null;
  let activeSize: CanvasSize = DEFAULT_CANVAS_SIZE;

  function handleSizeChange(size: CanvasSize) {
    activeSize = size;
    const { width: w, height: h } = CANVAS_SIZES[size];
    (editor as any)?.Canvas?.setDimensions?.({ width: w, height: h });
    onSizeChange?.(size);
  }

  onMount(() => {
    // @ts-ignore - GrapesJS init typing
    editor = grapesjs.init({
      container,
      width: width.toString(),
      height: height.toString(),
      projectData: initialProject || {
        pages: [
          {
            id: 'page-1',
            name: 'Page 1',
            component: {
              type: 'wrapper',
              components: [],
            },
          },
        ],
      },
      storageManager: {
        type: '',
      },
      blockManager: {
        appendTo: '#blocks',
        blocks: [],
      },
      styleManager: {
        appendTo: '#styles',
      },
      layerManager: {
        appendTo: '#layers',
      },
      traitManager: {
        appendTo: '#traits',
      },
    });

    registerWidgetBlocks(editor);
    registerDataBlocks(editor, slots);
    configureStyleManager(editor);

    if (onChange) {
      const notify = () => {
        onChange!((editor as any)?.getHtml?.() ?? '', (editor as any)?.getCss?.() ?? '');
      };
      (editor as any).on('component:update', notify);
      (editor as any).on('style:property:update', notify);
    }
  });

  onDestroy(() => {
    if (editor) {
      (editor as any).destroy?.();
    }
  });

  export function getHtml(): string {
    return (editor as any)?.getHtml?.() || '';
  }

  export function getCss(): string {
    return (editor as any)?.getCss?.() || '';
  }

  export function getProjectData(): Record<string, unknown> {
    return ((editor as any)?.getProjectData?.() as Record<string, unknown>) || {};
  }
</script>

<div role="group" aria-label="Canvas size">
  {#each CANVAS_SIZE_KEYS as size}
    <button
      type="button"
      aria-pressed={activeSize === size}
      on:click={() => handleSizeChange(size)}
    >
      {size}
    </button>
  {/each}
</div>

<div
  bind:this={container}
  style="width: {width}; height: {height}; background: var(--event-horizon); border: 1px solid var(--edge); border-radius: var(--radius-md); padding: var(--space-4); color: var(--dim-light); overflow: hidden;"
></div>
