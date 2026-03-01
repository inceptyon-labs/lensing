<script lang="ts">
  import { renderTemplate } from './template-engine';

  export let html: string;
  export let css: string;
  export let data: Record<string, unknown> | null = null;

  let hostEl: HTMLDivElement;

  $: if (hostEl) {
    if (!hostEl.shadowRoot) {
      hostEl.attachShadow({ mode: 'open' });
    }
    const content = renderTemplate(html, data);
    hostEl.shadowRoot!.innerHTML = '<' + 'style>' + css + '</' + 'style>' + content;
  }
</script>

<div bind:this={hostEl} data-testid="shadow-widget"></div>
