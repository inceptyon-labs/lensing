<script lang="ts">
  import { onDestroy } from 'svelte';
  import { buildSandboxSrcdoc, SANDBOX_MSG } from './iframe-sandbox';

  export let pluginId: string;
  export let html: string;
  export let css: string;
  export let js: string | undefined = undefined;
  export let data: Record<string, unknown> | null = null;

  let iframeEl: HTMLIFrameElement;
  let iframeHeight: number | null = null;

  $: srcdoc = buildSandboxSrcdoc(html, css, js);

  $: if (data !== null && iframeEl?.contentWindow) {
    iframeEl.contentWindow.postMessage({ type: SANDBOX_MSG.DATA, pluginId, data }, '*');
  }

  function onMessage(event: MessageEvent) {
    if (!event.data || event.data.type !== SANDBOX_MSG.RESIZE) return;
    if (event.data.pluginId !== pluginId) return;
    iframeHeight = event.data.height as number;
  }

  window.addEventListener('message', onMessage);

  onDestroy(() => {
    window.removeEventListener('message', onMessage);
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
