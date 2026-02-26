<script lang="ts">
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import type { PluginAdminEntry } from '@lensing/types';
  import type {
    NewsData,
    SportsData,
    HomeAssistantData,
    CryptoData,
    WeatherData,
    CalendarData,
    PhotoSlideshowData,
    AllergyData,
  } from '@lensing/types';
  import PhotoSlideshow from './PhotoSlideshow.svelte';
  import NewsHeadlines from './NewsHeadlines.svelte';
  import SportsScores from './SportsScores.svelte';
  import HomeAssistantDevices from './HomeAssistantDevices.svelte';
  import CryptoWidget from './CryptoWidget.svelte';
  import WeatherWidget from './WeatherWidget.svelte';
  import CalendarWidget from './CalendarWidget.svelte';
  import AllergiesWidget from './AllergiesWidget.svelte';
  import Placeholder from './Placeholder.svelte';
  import { getChannelData } from './stores/dataBusStore';

  export let plugin: PluginAdminEntry;

  $: pluginId = plugin.plugin_id;
  $: integration_status = plugin.integration_status;

  function handleGoToSettings() {
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    return goto(`${base}/admin`);
  }

  // Subscribe to data bus channels — called once at component init, not in reactive blocks.
  // getChannelData() is memoized so repeated calls return the same Readable instance.
  const newsStore = getChannelData('news-server');
  const sportsStore = getChannelData('sports-server');
  const haStore = getChannelData('home-assistant-server');
  const cryptoStore = getChannelData('crypto-server');
  const weatherStore = getChannelData('weather-server');
  const calendarStore = getChannelData('calendar-server');
  const photoStore = getChannelData('photo-slideshow-server');
  const allergiesStore = getChannelData('allergies-server');

  $: newsData = $newsStore as NewsData | null;
  $: sportsData = $sportsStore as SportsData | null;
  $: haData = $haStore as HomeAssistantData | null;
  $: cryptoData = $cryptoStore as CryptoData | null;
  $: weatherData = $weatherStore as WeatherData | null;
  $: calendarData = $calendarStore as CalendarData | null;
  $: photoData = $photoStore as PhotoSlideshowData | null;
  $: allergiesData = $allergiesStore as AllergyData | null;
</script>

<div class="plugin-renderer-wrap">
  {#if integration_status === 'missing'}
    <div class="not-configured overlay" role="status" aria-label="Integration not configured">
      <div class="not-configured__icon" aria-hidden="true">⚙</div>
      <p class="not-configured__title">Not Configured</p>
      <p class="not-configured__desc">This widget needs integration credentials.</p>
      <button class="not-configured__link" onclick={handleGoToSettings}>Go to Settings</button>
    </div>
  {:else if pluginId === 'photo-slideshow'}
    <PhotoSlideshow photoPaths={photoData?.photoPaths ?? []} />
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
  {:else if pluginId === 'calendar'}
    <CalendarWidget events={calendarData?.events ?? []} />
  {:else if pluginId === 'allergies'}
    <AllergiesWidget index={allergiesData?.index ?? 0} allergens={allergiesData?.allergens ?? []} />
  {:else}
    <Placeholder title={plugin.manifest.name} index={0} />
  {/if}
</div>

<style>
  .plugin-renderer-wrap {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .not-configured {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    width: 100%;
    height: 100%;
    padding: var(--space-4);
    box-sizing: border-box;
    text-align: center;
  }

  .not-configured__icon {
    font-size: var(--text-xl);
    color: var(--faint-light);
    line-height: 1;
  }

  .not-configured__title {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    font-weight: var(--weight-semi);
    color: var(--dim-light);
    margin: 0;
    letter-spacing: var(--tracking-wide);
  }

  .not-configured__desc {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--faint-light);
    margin: 0;
    line-height: var(--leading-normal);
  }

  .not-configured__link {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--ember);
    background: none;
    border: none;
    text-decoration: none;
    letter-spacing: var(--tracking-wide);
    margin-top: var(--space-1);
    cursor: pointer;
    padding: 0;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .not-configured__link:hover {
    color: var(--starlight);
  }
</style>
