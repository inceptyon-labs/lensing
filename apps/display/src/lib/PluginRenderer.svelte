<script lang="ts">
  import type { PluginAdminEntry } from '@lensing/types';
  import type { NewsData, SportsData, HomeAssistantData, CryptoData, WeatherData } from '@lensing/types';
  import PhotoSlideshow from './PhotoSlideshow.svelte';
  import NewsHeadlines from './NewsHeadlines.svelte';
  import SportsScores from './SportsScores.svelte';
  import HomeAssistantDevices from './HomeAssistantDevices.svelte';
  import CryptoWidget from './CryptoWidget.svelte';
  import WeatherWidget from './WeatherWidget.svelte';
  import Placeholder from './Placeholder.svelte';
  import { getChannelData } from './stores/dataBusStore';

  export let plugin: PluginAdminEntry;

  $: pluginId = plugin.plugin_id;

  // Subscribe to data bus channels — called once at component init, not in reactive blocks.
  // getChannelData() is memoized so repeated calls return the same Readable instance.
  const newsStore = getChannelData('news-server');
  const sportsStore = getChannelData('sports-server');
  const haStore = getChannelData('home-assistant-server');
  const cryptoStore = getChannelData('crypto-server');
  const weatherStore = getChannelData('weather-server');

  $: newsData = $newsStore as NewsData | null;
  $: sportsData = $sportsStore as SportsData | null;
  $: haData = $haStore as HomeAssistantData | null;
  $: cryptoData = $cryptoStore as CryptoData | null;
  $: weatherData = $weatherStore as WeatherData | null;
</script>

{#if pluginId === 'photo-slideshow'}
  <PhotoSlideshow photoPaths={[]} />
{:else if pluginId === 'news'}
  <NewsHeadlines headlines={newsData?.articles ?? []} />
{:else if pluginId === 'sports'}
  <SportsScores games={sportsData?.games ?? []} />
{:else if pluginId === 'home-assistant'}
  <HomeAssistantDevices devices={haData?.devices ?? []} sensors={haData?.sensors ?? []} />
{:else if pluginId === 'crypto'}
  <CryptoWidget coins={cryptoData?.coins ?? []} />
{:else if pluginId === 'weather'}
  <WeatherWidget current={weatherData?.current ?? null} forecast={weatherData?.forecast ?? []} />
{:else}
  <Placeholder title={plugin.manifest.name} index={0} />
{/if}
