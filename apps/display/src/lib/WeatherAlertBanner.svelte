<script lang="ts">
  import { onMount } from 'svelte';
  import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
  import { WEATHER_ALERTS_PLUGIN_ID } from '@lensing/types';
  import type { WeatherAlertsData } from '@lensing/types';
  import { getChannelData } from './stores/dataBusStore';
  import { visibleAlerts, formatAlertUntil } from './weather-alerts';

  /** Night mode: tone the banner down unless the top alert is Extreme */
  let { dim = false }: { dim?: boolean } = $props();

  const alertsStore = getChannelData(WEATHER_ALERTS_PLUGIN_ID);

  // Tick so the banner clears itself once the alert ends
  let now = $state(new Date());
  onMount(() => {
    const timer = setInterval(() => {
      now = new Date();
    }, 60_000);
    return () => clearInterval(timer);
  });

  const alerts = $derived(
    visibleAlerts(($alertsStore as WeatherAlertsData | null)?.alerts ?? [], now)
  );
  const top = $derived(alerts[0]);
  const more = $derived(alerts.length - 1);
  const urgent = $derived(top?.severity === 'Extreme' || top?.severity === 'Severe');
  const dimmed = $derived(dim && top?.severity !== 'Extreme');
</script>

{#if top}
  <div
    class="alert-banner"
    class:alert-banner--urgent={urgent}
    class:alert-banner--dim={dimmed}
    role="alert"
  >
    <TriangleAlert size={44} aria-hidden="true" />
    <span class="alert-banner__text">
      <strong class="alert-banner__event">{top.event}</strong>
      <span class="alert-banner__until">{formatAlertUntil(top, now)}</span>
    </span>
    {#if more > 0}
      <span class="alert-banner__more">+{more} more</span>
    {/if}
  </div>
{/if}

<style>
  .alert-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10000;
    height: 88px;
    display: flex;
    align-items: center;
    gap: var(--space-3, 12px);
    padding: 0 var(--space-5, 24px);
    box-sizing: border-box;
    background: var(--ember, hsl(28, 90%, 60%));
    color: var(--void, hsl(240, 8%, 4%));
    /* Read from across the room */
    font-size: 2.25rem;
    line-height: 1;
  }

  .alert-banner--urgent {
    background: hsl(0, 78%, 40%);
    color: hsl(0, 0%, 98%);
  }

  .alert-banner--dim {
    filter: brightness(0.4);
  }

  .alert-banner :global(svg) {
    flex-shrink: 0;
  }

  .alert-banner__text {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .alert-banner__event {
    font-weight: var(--weight-bold, 700);
    margin-right: var(--space-2, 8px);
  }

  .alert-banner__until {
    font-weight: var(--weight-medium, 500);
  }

  .alert-banner__more {
    flex-shrink: 0;
    font-weight: var(--weight-semi, 600);
    font-size: 1.75rem;
  }
</style>
