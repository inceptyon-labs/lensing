<script lang="ts">
  /** HTML content from the GrapesJS editor */
  export let html: string = '';
  /** CSS content from the GrapesJS editor */
  export let css: string = '';
  /** Sample data from a connector test result — null/undefined = no data yet */
  export let sampleData: Record<string, unknown> | null | undefined = undefined;

  type Size = 'small' | 'medium' | 'large';

  const SIZES: Record<Size, { width: number; height: number }> = {
    small: { width: 200, height: 150 },
    medium: { width: 300, height: 225 },
    large: { width: 400, height: 300 },
  };
  const SIZE_KEYS: Size[] = ['small', 'medium', 'large'];

  let currentSize: Size = 'medium';

  /** Resolve a dot-notation path (e.g. "source.name") against a data object */
  function resolvePath(data: Record<string, unknown>, path: string): unknown {
    const parts = path.split('.');
    let current: unknown = data;
    for (const part of parts) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return undefined;
      }
      current = (current as Record<string, unknown>)[part];
    }
    return current;
  }

  /** Replace {{placeholder}} expressions with real data values */
  function interpolate(template: string, data: Record<string, unknown>): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (_match, path: string) => {
      const value = resolvePath(data, path.trim());
      if (value === null || value === undefined) {
        return `{{${path}}}`;
      }
      return String(value);
    });
  }

  $: hasData = sampleData !== null && sampleData !== undefined;

  $: processedHtml = hasData
    ? interpolate(html, sampleData as Record<string, unknown>)
    : html;

  function buildSrcdoc(h: string, c: string): string {
    return (
      '<!DOCTYPE html><html><head><meta charset="utf-8"><' +
      'style>' +
      c +
      '</' +
      'style></head><body>' +
      h +
      '</body></html>'
    );
  }

  $: srcdoc = buildSrcdoc(processedHtml, css);

  $: frameSize = SIZES[currentSize];
</script>

<div
  data-testid="preview-container"
  style="background: var(--void, hsl(240, 8%, 4%)); border: 1px solid var(--edge, hsla(220, 10%, 50%, 0.12)); border-radius: var(--radius-md, 8px); padding: var(--space-4, 16px); display: flex; flex-direction: column; gap: var(--space-3, 12px);"
>
  <div style="display: flex; align-items: center; justify-content: space-between;">
    <span
      style="font-size: var(--text-sm, 0.875rem); color: var(--dim-light, hsl(220, 10%, 62%)); font-weight: var(--weight-medium, 500); letter-spacing: 0.04em; text-transform: uppercase;"
    >Preview</span>
    <div role="group" aria-label="Preview size" style="display: flex; gap: var(--space-1, 4px);">
      {#each SIZE_KEYS as size}
        <button
          type="button"
          aria-pressed={currentSize === size ? 'true' : 'false'}
          on:click={() => (currentSize = size)}
          style="padding: 4px 12px; background: transparent; border: 1px solid var(--edge, hsla(220, 10%, 50%, 0.12)); border-radius: var(--radius-sm, 4px); color: var(--dim-light, hsl(220, 10%, 62%)); font-size: var(--text-xs, 0.75rem); cursor: pointer;"
        >
          {size.charAt(0).toUpperCase() + size.slice(1)}
        </button>
      {/each}
    </div>
  </div>

  <div
    style="position: relative; display: flex; align-items: center; justify-content: center; min-height: 150px; background: hsl(0, 0%, 12%); border-radius: var(--radius-sm, 4px); padding: var(--space-4, 16px);"
  >
    {#if !hasData}
      <div
        style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: hsla(240, 8%, 4%, 0.85); border-radius: var(--radius-sm, 4px); z-index: 1;"
      >
        <span
          style="color: var(--ghost-light, hsl(220, 6%, 28%)); font-size: var(--text-sm, 0.875rem); text-align: center; padding: var(--space-4, 16px);"
        >No data — test a connector in Step 2 to see live data</span>
      </div>
    {/if}
    <iframe
      data-testid="preview-frame"
      title="Widget Preview"
      {srcdoc}
      style="width: {frameSize.width}px; height: {frameSize.height}px; border: none; display: block;"
      sandbox="allow-scripts"
    ></iframe>
  </div>
</div>
