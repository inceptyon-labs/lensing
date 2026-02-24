<script lang="ts">
  import type { PluginAdminEntry } from '@lensing/types';
  import PhotoSlideshow from './PhotoSlideshow.svelte';
  import NewsHeadlines from './NewsHeadlines.svelte';
  import SportsScores from './SportsScores.svelte';
  import HomeAssistantDevices from './HomeAssistantDevices.svelte';
  import Placeholder from './Placeholder.svelte';

  export let plugin: PluginAdminEntry;

  $: pluginId = plugin.plugin_id;
</script>

{#if pluginId === 'photo-slideshow'}
  <PhotoSlideshow photoPaths={[]} />
{:else if pluginId === 'news'}
  <NewsHeadlines headlines={[]} />
{:else if pluginId === 'sports'}
  <SportsScores games={[]} />
{:else if pluginId === 'home-assistant'}
  <HomeAssistantDevices devices={[]} sensors={[]} />
{:else}
  <Placeholder title={plugin.manifest.name} index={0} />
{/if}
