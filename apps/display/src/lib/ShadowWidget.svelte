<script lang="ts">
  export let html: string;
  export let css: string;
  export let data: Record<string, unknown> | null = null;

  let hostEl: HTMLDivElement;

  function resolvePath(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce(
      (acc, key) =>
        acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined,
      obj as unknown
    );
  }

  function interpolate(template: string, values: Record<string, unknown>): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (_match, path) => {
      const value = resolvePath(values, path.trim());
      return value == null ? '' : String(value);
    });
  }

  $: if (hostEl) {
    if (!hostEl.shadowRoot) {
      hostEl.attachShadow({ mode: 'open' });
    }
    const content = data ? interpolate(html, data) : html;
    hostEl.shadowRoot!.innerHTML = '<' + 'style>' + css + '</' + 'style>' + content;
  }
</script>

<div bind:this={hostEl} data-testid="shadow-widget"></div>
