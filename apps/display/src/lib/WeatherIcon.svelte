<script lang="ts">
  import Sun from '@lucide/svelte/icons/sun';
  import SunDim from '@lucide/svelte/icons/sun-dim';
  import CloudSun from '@lucide/svelte/icons/cloud-sun';
  import Cloud from '@lucide/svelte/icons/cloud';
  import Cloudy from '@lucide/svelte/icons/cloudy';
  import CloudFog from '@lucide/svelte/icons/cloud-fog';
  import Haze from '@lucide/svelte/icons/haze';
  import CloudDrizzle from '@lucide/svelte/icons/cloud-drizzle';
  import CloudRain from '@lucide/svelte/icons/cloud-rain';
  import CloudSunRain from '@lucide/svelte/icons/cloud-sun-rain';
  import CloudHail from '@lucide/svelte/icons/cloud-hail';
  import CloudSnow from '@lucide/svelte/icons/cloud-snow';
  import Snowflake from '@lucide/svelte/icons/snowflake';
  import CloudLightning from '@lucide/svelte/icons/cloud-lightning';
  import Thermometer from '@lucide/svelte/icons/thermometer';

  interface Props {
    conditions: string;
    size?: number;
  }

  let { conditions, size = 24 }: Props = $props();

  type IconType = 'sun' | 'sun-dim' | 'cloud-sun' | 'cloud' | 'cloudy' | 'cloud-fog' | 'haze' | 'cloud-drizzle' | 'cloud-rain' | 'cloud-sun-rain' | 'cloud-hail' | 'cloud-snow' | 'snowflake' | 'cloud-lightning' | 'thermometer';

  function mapCondition(cond: string): IconType {
    const c = cond.toLowerCase();
    if (c.includes('thunderstorm')) return 'cloud-lightning';
    if (c.includes('freezing rain') || c.includes('freezing drizzle')) return 'cloud-hail';
    if (c.includes('snow shower')) return 'cloud-snow';
    if (c.includes('snow') || c.includes('snow grains')) return 'snowflake';
    if (c.includes('rain shower')) return 'cloud-sun-rain';
    if (c.includes('rain') || c.includes('drizzle')) return 'cloud-rain';
    if (c.includes('drizzle')) return 'cloud-drizzle';
    if (c.includes('fog') || c.includes('mist')) return 'cloud-fog';
    if (c.includes('haze')) return 'haze';
    if (c.includes('overcast') || c.includes('broken clouds')) return 'cloudy';
    if (c.includes('partly cloudy') || c.includes('scattered clouds') || c.includes('few clouds')) return 'cloud-sun';
    if (c.includes('mostly clear')) return 'sun-dim';
    if (c.includes('clear')) return 'sun';
    return 'thermometer';
  }

  let icon = $derived(mapCondition(conditions));
</script>

<span class="weather-icon" aria-hidden="true">
  {#if icon === 'sun'}
    <Sun {size} />
  {:else if icon === 'sun-dim'}
    <SunDim {size} />
  {:else if icon === 'cloud-sun'}
    <CloudSun {size} />
  {:else if icon === 'cloud'}
    <Cloud {size} />
  {:else if icon === 'cloudy'}
    <Cloudy {size} />
  {:else if icon === 'cloud-fog'}
    <CloudFog {size} />
  {:else if icon === 'haze'}
    <Haze {size} />
  {:else if icon === 'cloud-drizzle'}
    <CloudDrizzle {size} />
  {:else if icon === 'cloud-rain'}
    <CloudRain {size} />
  {:else if icon === 'cloud-sun-rain'}
    <CloudSunRain {size} />
  {:else if icon === 'cloud-hail'}
    <CloudHail {size} />
  {:else if icon === 'cloud-snow'}
    <CloudSnow {size} />
  {:else if icon === 'snowflake'}
    <Snowflake {size} />
  {:else if icon === 'cloud-lightning'}
    <CloudLightning {size} />
  {:else}
    <Thermometer {size} />
  {/if}
</span>

<style>
  .weather-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: inherit;
  }
</style>
