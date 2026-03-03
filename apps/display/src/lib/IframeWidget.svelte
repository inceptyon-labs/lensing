<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { buildSandboxSrcdoc, SANDBOX_MSG } from './iframe-sandbox';

  export let pluginId: string;
  export let html: string;
  export let css: string;
  export let js: string | undefined = undefined;
  export let data: Record<string, unknown> | null = null;

  const MAX_IFRAME_HEIGHT = 3000; // Prevent DOS via height bloat

  let iframeEl: HTMLIFrameElement;
  let iframeHeight: number | null = null;

  $: srcdoc = buildSandboxSrcdoc(html, css, js, pluginId);

  $: if (data !== null && iframeEl?.contentWindow) {
    try {
      iframeEl.contentWindow.postMessage({ type: SANDBOX_MSG.DATA, pluginId, data }, '*');
    } catch {
      // postMessage can fail in certain cross-origin contexts; gracefully ignore
    }
  }

  function onMessage(event: MessageEvent) {
    if (!event.data || event.data.type !== SANDBOX_MSG.RESIZE) return;
    if (event.data.pluginId !== pluginId) return;
    // Validate event source is the iframe to prevent spoofed messages
    if (event.source !== iframeEl?.contentWindow) return;
    // Validate height is a finite number before applying
    const height = event.data.height;
    if (!Number.isFinite(height)) return;
    iframeHeight = Math.min(Math.max(height as number, 0), MAX_IFRAME_HEIGHT);
  }

  // Register message listener on mount to avoid SSR issues
  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', onMessage);
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', onMessage);
    }
  });
</script>

<iframe
  bind:this={iframeEl}
  data-testid="iframe-widget"
  title="Plugin Widget"
  {srcdoc}
  sandbox="allow-scripts"
  style="border: none; display: block; width: 100%;{iframeHeight !== null
    ? ` height: ${iframeHeight}px;`
    : ''}"
></iframe>
