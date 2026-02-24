<script lang="ts">
  import type { WeatherCurrent, WeatherForecastDay } from '@lensing/types';

  export let current: WeatherCurrent | null = null;
  export let forecast: WeatherForecastDay[] = [];
  export let compact: boolean = false;

  function formatTemp(temp: number): string {
    return `${Math.round(temp)}°`;
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
</script>

<div class="weather-widget" class:weather-widget--compact={compact}>
  {#if !current}
    <div class="weather-widget__empty">
      <span>No weather data available</span>
    </div>
  {:else if compact}
    <div class="weather-widget__compact-row">
      <span class="weather-widget__compact-temp">{formatTemp(current.temp)}</span>
      <span class="weather-widget__compact-conditions">{current.conditions}</span>
    </div>
  {:else}
    <div class="weather-widget__current">
      <div class="weather-widget__hero">
        <span class="weather-widget__temp">{formatTemp(current.temp)}</span>
        <div class="weather-widget__conditions-block">
          <span class="weather-widget__conditions">{current.conditions}</span>
          <span class="weather-widget__feels-like">Feels like {formatTemp(current.feelsLike)}</span>
        </div>
      </div>
      <div class="weather-widget__details">
        <span class="weather-widget__detail">
          <span class="weather-widget__detail-label">Humidity</span>
          <span class="weather-widget__detail-value">{current.humidity}%</span>
        </span>
      </div>
    </div>

    {#if forecast.length > 0}
      <div class="weather-widget__forecast">
        {#each forecast.slice(0, 5) as day (day.date)}
          <div class="weather-widget__forecast-row">
            <span class="weather-widget__forecast-day">{formatDate(day.date)}</span>
            <span class="weather-widget__forecast-conditions">{day.conditions}</span>
            <span class="weather-widget__forecast-temps">
              <span class="weather-widget__forecast-high">{formatTemp(day.high)}</span>
              <span class="weather-widget__forecast-sep">/</span>
              <span class="weather-widget__forecast-low">{formatTemp(day.low)}</span>
            </span>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .weather-widget {
    background: var(--event-horizon, hsl(240, 6%, 7%));
    border: 1px solid var(--edge, hsla(220, 10%, 50%, 0.12));
    border-radius: var(--radius-md, 8px);
    padding: var(--space-4, 16px);
    box-shadow: 0 0 0 1px var(--edge, hsla(220, 10%, 50%, 0.12));
    color: var(--starlight, hsl(220, 15%, 90%));
    font-variant-numeric: tabular-nums;
  }

  /* ── Current conditions ───────────────────────────────────────────────── */

  .weather-widget__current {
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 12px);
  }

  .weather-widget__hero {
    display: flex;
    align-items: center;
    gap: var(--space-4, 16px);
  }

  .weather-widget__temp {
    font-size: var(--text-3xl, 3rem);
    font-weight: var(--weight-bold, 700);
    color: var(--starlight, hsl(220, 15%, 90%));
    letter-spacing: var(--tracking-tight, -0.02em);
    line-height: 1;
  }

  .weather-widget__conditions-block {
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 4px);
  }

  .weather-widget__conditions {
    font-size: var(--text-base, 1rem);
    font-weight: var(--weight-medium, 500);
    color: var(--starlight, hsl(220, 15%, 90%));
    text-transform: capitalize;
  }

  .weather-widget__feels-like {
    font-size: var(--text-sm, 0.875rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
  }

  .weather-widget__details {
    display: flex;
    gap: var(--space-4, 16px);
    flex-wrap: wrap;
  }

  .weather-widget__detail {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .weather-widget__detail-label {
    font-size: var(--text-sm, 0.875rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
    letter-spacing: var(--tracking-wide, 0.04em);
    text-transform: uppercase;
  }

  .weather-widget__detail-value {
    font-size: var(--text-base, 1rem);
    font-weight: var(--weight-semi, 600);
    color: var(--starlight, hsl(220, 15%, 90%));
  }

  /* ── Forecast ─────────────────────────────────────────────────────────── */

  .weather-widget__forecast {
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 4px);
    margin-top: var(--space-3, 12px);
    padding-top: var(--space-3, 12px);
    border-top: 1px solid var(--edge-soft, hsla(220, 10%, 50%, 0.07));
  }

  .weather-widget__forecast-row {
    display: flex;
    align-items: center;
    gap: var(--space-3, 12px);
    padding: var(--space-1, 4px) 0;
  }

  .weather-widget__forecast-day {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    color: var(--starlight, hsl(220, 15%, 90%));
    width: 2.5rem;
    flex-shrink: 0;
  }

  .weather-widget__forecast-conditions {
    font-size: var(--text-sm, 0.875rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
    flex: 1;
    text-transform: capitalize;
  }

  .weather-widget__forecast-temps {
    font-size: var(--text-sm, 0.875rem);
    display: flex;
    gap: var(--space-1, 4px);
    flex-shrink: 0;
  }

  .weather-widget__forecast-high {
    font-weight: var(--weight-semi, 600);
    color: var(--starlight, hsl(220, 15%, 90%));
  }

  .weather-widget__forecast-sep {
    color: var(--dim-light, hsl(220, 10%, 62%));
  }

  .weather-widget__forecast-low {
    color: var(--dim-light, hsl(220, 10%, 62%));
  }

  /* ── Compact mode ─────────────────────────────────────────────────────── */

  .weather-widget__compact-row {
    display: flex;
    align-items: baseline;
    gap: var(--space-3, 12px);
  }

  .weather-widget__compact-temp {
    font-size: var(--text-2xl, 2rem);
    font-weight: var(--weight-bold, 700);
    color: var(--starlight, hsl(220, 15%, 90%));
    letter-spacing: var(--tracking-tight, -0.02em);
  }

  .weather-widget__compact-conditions {
    font-size: var(--text-sm, 0.875rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
    text-transform: capitalize;
  }

  /* ── Empty state ──────────────────────────────────────────────────────── */

  .weather-widget__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-5, 24px);
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-size: var(--text-sm, 0.875rem);
  }
</style>
