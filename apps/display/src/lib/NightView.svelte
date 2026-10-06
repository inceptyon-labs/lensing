<script lang="ts">
  import { onMount } from 'svelte';
  import type { CalendarData, WeatherData } from '@lensing/types';
  import { getChannelData } from './stores/dataBusStore';
  import { eventsOnDate, localDateStr } from './calendar-dates';
  import { dayAheadDate } from './night-mode';

  const calendarStore = getChannelData('calendar-server');
  const weatherStore = getChannelData('weather-server');

  let now = $state(new Date());
  onMount(() => {
    const timer = setInterval(() => {
      now = new Date();
    }, 10_000);
    return () => clearInterval(timer);
  });

  const targetDate = $derived(dayAheadDate(now));
  const isToday = $derived(targetDate === localDateStr(now));
  const events = $derived(
    eventsOnDate(($calendarStore as CalendarData | null)?.events ?? [], targetDate).slice(0, 3)
  );
  const day = $derived(
    (($weatherStore as WeatherData | null)?.forecast ?? []).find((d) => d.date === targetDate)
  );

  const clock = $derived(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
  const dateLine = $derived(
    now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  );

  function eventTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
</script>

<div class="night">
  <div class="night__clock">{clock}</div>
  <div class="night__date">{dateLine}</div>

  <section class="night__section">
    <h2 class="night__label">{isToday ? 'Today' : 'Tomorrow'}</h2>
    {#if events.length === 0}
      <p class="night__none">Nothing scheduled</p>
    {:else}
      <ul class="night__events">
        {#each events as e (e.id)}
          <li class="night__event">
            <span class="night__event-time">{e.allDay ? 'All day' : eventTime(e.start)}</span>
            <span class="night__event-title">{e.title}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  {#if day}
    <section class="night__section night__forecast">
      <span class="night__conditions">{day.conditions}</span>
      <span class="night__temps">{Math.round(day.high)}° / {Math.round(day.low)}°</span>
      {#if day.precipChance != null}
        <span class="night__rain">{day.precipChance}% rain</span>
      {/if}
    </section>
  {/if}
</div>

<style>
  .night {
    position: fixed;
    inset: 0;
    z-index: 9000;
    box-sizing: border-box;
    padding: 120px var(--space-7, 48px) var(--space-7, 48px);
    background: #000;
    color: #6b6b6b;
    display: flex;
    flex-direction: column;
    gap: var(--space-6, 32px);
    font-variant-numeric: tabular-nums;
  }

  .night__clock {
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 10rem;
    line-height: 1;
    color: #6b6b6b;
    letter-spacing: -0.04em;
  }

  .night__date {
    font-size: var(--text-2xl, 2rem);
    color: #5c5c5c;
  }

  .night__section {
    margin-top: var(--space-6, 32px);
    padding-top: var(--space-5, 24px);
    border-top: 1px solid #1c1c1c;
  }

  .night__label {
    margin: 0 0 var(--space-4, 16px);
    font-size: var(--text-xl, 1.5rem);
    font-weight: var(--weight-medium, 500);
    letter-spacing: var(--tracking-wide, 0.04em);
    text-transform: uppercase;
    color: #5c5c5c;
  }

  .night__events {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-4, 16px);
  }

  .night__event {
    display: flex;
    gap: var(--space-5, 24px);
    align-items: baseline;
    font-size: 2.5rem;
    color: #8a8a8a;
  }

  .night__event-time {
    flex: 0 0 11rem;
    color: #6b6b6b;
  }

  .night__event-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .night__none {
    margin: 0;
    font-size: 2rem;
    color: #5c5c5c;
  }

  .night__forecast {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--space-3, 12px) var(--space-6, 32px);
    font-size: 2.5rem;
    color: #8a8a8a;
  }

  .night__conditions {
    text-transform: capitalize;
  }

  .night__rain {
    color: #6b6b6b;
  }
</style>
