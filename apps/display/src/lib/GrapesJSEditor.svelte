<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import grapesjs from 'grapesjs';

  export let width: number | string = '100%';
  export let height: number | string = '600px';
  export let initialProject: Record<string, unknown> | undefined = undefined;

  // @ts-ignore - Svelte bind:this element typing
  let container: any;
  let editor: unknown | null = null;

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
  });

  onDestroy(() => {
    if (editor) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      (editor as any).destroy?.();
    }
  });

  export function getHtml(): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return (editor as any)?.getHtml?.() || '';
  }

  export function getCss(): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return (editor as any)?.getCss?.() || '';
  }

  export function getProjectData(): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return ((editor as any)?.getProjectData?.() as Record<string, unknown>) || {};
  }
</script>

<div bind:this={container} class="grapesjs-editor" style="width: {width}; height: {height};"></div>

<style>
  .grapesjs-editor {
    background: var(--event-horizon);
    border: 1px solid var(--edge);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    color: var(--dim-light);
    overflow: hidden;
  }

  :global(.grapesjs-editor) {
    --gjs-base-bg: var(--event-horizon);
    --gjs-base-border-color: var(--edge);
    --gjs-primary-color: var(--ember);
    --gjs-text-color: var(--starlight);
    --gjs-text-color-secondary: var(--dim-light);
  }
</style>
