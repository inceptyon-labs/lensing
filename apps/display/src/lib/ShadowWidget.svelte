<script lang="ts">
  import DOMPurify from 'dompurify';
  import { renderTemplate } from './template-engine';

  export let html: string;
  export let css: string;
  export let data: Record<string, unknown> | null = null;

  let hostEl: HTMLDivElement;
  let lastKey: string | null = null;

  $: if (hostEl) {
    if (!hostEl.shadowRoot) {
      hostEl.attachShadow({ mode: 'open' });
    }
    const content = renderTemplate(html, data);
    // Data bus messages re-run this often; skip the DOM write when nothing changed
    const key = content + '\u0000' + css;
    if (key !== lastKey) {
      lastKey = key;
      const style = document.createElement('style');
      style.textContent = css;
      const fragment = DOMPurify.sanitize(content, { RETURN_DOM_FRAGMENT: true });
      hostEl.shadowRoot!.replaceChildren(style, fragment);
    }
  }
</script>

<div bind:this={hostEl} data-testid="shadow-widget"></div>
