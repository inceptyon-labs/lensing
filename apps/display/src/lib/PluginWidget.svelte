<script lang="ts">
  import ShadowWidget from './ShadowWidget.svelte';
  import { getChannelData } from './stores/dataBusStore';

  let { pluginId }: { pluginId: string } = $props();

  let html = $state('');
  let css = $state('');
  let loading = $state(true);
  let error = $state(false);

  // pluginId is stable for this widget's lifetime (keyed by id in the parent #each)
  const id = pluginId;
  const dataStore = getChannelData(id);

  $effect(() => {
    void (async () => {
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
    })();
  });
</script>

{#if loading}
  <div>Loading template...</div>
{:else if error}
  <div>Failed to load template</div>
{/if}
<ShadowWidget {html} {css} data={$dataStore as Record<string, unknown> | null} />
