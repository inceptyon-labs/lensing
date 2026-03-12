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
    AiNewsData,
    WordOfDayData,
    FinanceData,
  } from '@lensing/types';
  import PhotoSlideshow from './PhotoSlideshow.svelte';
  import NewsHeadlines from './NewsHeadlines.svelte';
  import SportsScores from './SportsScores.svelte';
  import HomeAssistantDevices from './HomeAssistantDevices.svelte';
  import CryptoWidget from './CryptoWidget.svelte';
  import WeatherWidget from './WeatherWidget.svelte';
  import CalendarWidget from './CalendarWidget.svelte';
  import AllergiesWidget from './AllergiesWidget.svelte';
  import AiNewsWidget from './AiNewsWidget.svelte';
  import WordOfDayWidget from './WordOfDayWidget.svelte';
  import FinanceWidget from './FinanceWidget.svelte';
  import PluginWidget from './PluginWidget.svelte';
  import { getChannelData } from './stores/dataBusStore';

  export let plugin: PluginAdminEntry;

  $: pluginId = plugin.plugin_id;
  $: integration_status = plugin.integration_status;

  /** Parse a config value that may be boolean or string into a boolean */
  function cfgBool(val: unknown, fallback: boolean): boolean {
    if (val === true || val === 'true') return true;
    if (val === false || val === 'false') return false;
    return fallback;
  }

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
  const aiNewsStore = getChannelData('ai-news-server');
  const wotdStore = getChannelData('word-of-day-server');
  const financeStore = getChannelData('finance-server');

  $: newsData = $newsStore as NewsData | null;
  $: sportsData = $sportsStore as SportsData | null;
  $: haData = $haStore as HomeAssistantData | null;
  $: cryptoData = $cryptoStore as CryptoData | null;
  $: weatherData = $weatherStore as WeatherData | null;
  $: calendarData = $calendarStore as CalendarData | null;
  $: photoData = $photoStore as PhotoSlideshowData | null;
  $: allergiesData = $allergiesStore as AllergyData | null;
  $: aiNewsData = $aiNewsStore as AiNewsData | null;
  $: wotdData = $wotdStore as WordOfDayData | null;
  $: financeData = $financeStore as FinanceData | null;
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
    <PhotoSlideshow
      photoPaths={photoData?.photoPaths ?? []}
      cycleInterval={(Number(plugin.config['cycleSeconds']) || 30) * 1000}
    />
  {:else if pluginId === 'news'}
    <NewsHeadlines headlines={newsData?.articles ?? []} />
  {:else if pluginId === 'sports'}
    <SportsScores games={sportsData?.games ?? []} />
  {:else if pluginId === 'home-assistant'}
    <HomeAssistantDevices devices={haData?.devices ?? []} sensors={haData?.sensors ?? []} />
  {:else if pluginId === 'crypto'}
    <CryptoWidget
      coins={cryptoData?.coins ?? []}
      show1h={cfgBool(plugin.config['show1h'], false)}
      show24h={cfgBool(plugin.config['show24h'], true)}
      show7d={cfgBool(plugin.config['show7d'], false)}
      showSparkline={cfgBool(plugin.config['showSparkline'], true)}
    />
  {:else if pluginId === 'weather'}
    <WeatherWidget current={weatherData?.current ?? null} forecast={weatherData?.forecast ?? []} />
  {:else if pluginId === 'calendar'}
    <CalendarWidget events={calendarData?.events ?? []} />
  {:else if pluginId === 'allergies'}
    <AllergiesWidget
      index={allergiesData?.index ?? 0}
      level={allergiesData?.level ?? 'Low'}
      color={allergiesData?.color ?? '#4caf50'}
      location={allergiesData?.location ?? ''}
      triggers={allergiesData?.triggers ?? []}
      periods={allergiesData?.periods ?? []}
    />
  {:else if pluginId === 'word-of-day'}
    <WordOfDayWidget data={wotdData} />
  {:else if pluginId === 'finance'}
    <FinanceWidget
      stocks={financeData?.stocks ?? []}
      show1h={cfgBool(plugin.config['show1h'], false)}
      show24h={cfgBool(plugin.config['show24h'], true)}
      show7d={cfgBool(plugin.config['show7d'], false)}
      showSparkline={cfgBool(plugin.config['showSparkline'], true)}
    />
  {:else if pluginId === 'ai-news'}
    <AiNewsWidget
      summaries={aiNewsData?.summaries ?? []}
      pageSize={Number(plugin.config['pageSize']) || 5}
      rotateSeconds={Number(plugin.config['rotateSeconds']) ?? 30}
    />
  {:else}
    <PluginWidget {pluginId} />
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
