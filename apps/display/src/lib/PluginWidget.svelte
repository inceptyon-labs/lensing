<script lang="ts">
  import { onMount } from 'svelte';
  import ShadowWidget from './ShadowWidget.svelte';
  import { getChannelData } from './stores/dataBusStore';

  export let pluginId: string;

  let html = '';
  let css = '';
  let loading = true;
  let error = false;

  const dataStore = getChannelData(pluginId);

  onMount(async () => {
    const res = await fetch(`/plugins/${pluginId}/template`);
    if (!res.ok) {
      error = true;
      loading = false;
      return;
    }
    const template = await res.json();
    html = template.html;
    css = template.css;
    loading = false;
  });
</script>

{#if loading}
  <div>Loading template...</div>
{:else if error}
  <div>Failed to load template</div>
{/if}
<ShadowWidget {html} {css} data={$dataStore as Record<string, unknown> | null} />
