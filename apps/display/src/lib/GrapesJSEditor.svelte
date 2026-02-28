<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import grapesjs from 'grapesjs';

  export let width: number | string = '100%';
  export let height: number | string = '600px';
  export let initialProject: Record<string, any> | undefined = undefined;

  let container: HTMLDivElement;
  let editor: any = null;

  onMount(() => {
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
              components: []
            }
          }
        ]
      },
      storageManager: {
        type: null
      },
      blockManager: {
        appendTo: '#blocks',
        blocks: []
      },
      styleManager: {
        appendTo: '#styles'
      },
      layerManager: {
        appendTo: '#layers'
      },
      traitManager: {
        appendTo: '#traits'
      }
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  export function getHtml(): string {
    return editor?.getHtml() || '';
  }

  export function getCss(): string {
    return editor?.getCss() || '';
  }

  export function getProjectData(): Record<string, any> {
    return editor?.getProjectData() || {};
  }
</script>

<div
  bind:this={container}
  class="grapesjs-editor"
  style="width: {width}; height: {height};"
/>

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
