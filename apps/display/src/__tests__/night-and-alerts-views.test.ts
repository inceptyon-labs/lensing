import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { WEATHER_ALERTS_PLUGIN_ID } from '@lensing/types';
import type { WeatherAlert } from '@lensing/types';
import NightView from '../lib/NightView.svelte';
import WeatherAlertBanner from '../lib/WeatherAlertBanner.svelte';
import { handlePluginData, resetStore } from '../lib/stores/dataBusStore';

const feed = (plugin_id: string, data: unknown) =>
  handlePluginData({ channel: plugin_id, plugin_id, data, timestamp: new Date().toISOString() });

describe('NightView', () => {
  beforeEach(() => {
    resetStore();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 6, 22, 42));
  });
  afterEach(() => vi.useRealTimers());

  it('shows the clock, tomorrow events and forecast', () => {
    feed('calendar-server', {
      lastUpdated: 0,
      events: [
        {
          id: '1',
          title: 'Dentist',
          start: new Date(2026, 9, 7, 9, 30).toISOString(),
          end: new Date(2026, 9, 7, 10, 30).toISOString(),
          calendar: 'c',
        },
        {
          id: '2',
          title: 'Trash day',
          start: '2026-10-07',
          end: '2026-10-08',
          calendar: 'c',
          allDay: true,
        },
        {
          id: '3',
          title: 'Today only',
          start: new Date(2026, 9, 6, 9).toISOString(),
          end: new Date(2026, 9, 6, 10).toISOString(),
          calendar: 'c',
        },
      ],
    });
    feed('weather-server', {
      lastUpdated: 0,
      current: {},
      forecast: [
        {
          date: '2026-10-07',
          high: 88.4,
          low: 71,
          conditions: 'thunderstorms',
          icon: 'x',
          precipChance: 60,
        },
      ],
    });
    const { container } = render(NightView);
    const text = container.textContent ?? '';
    expect(text).toContain('10:42 PM');
    expect(text).toContain('Tomorrow');
    expect(text).toContain('All day');
    expect(text).toContain('Trash day');
    expect(text).toContain('9:30 AM');
    expect(text).toContain('Dentist');
    expect(text).not.toContain('Today only');
    expect(text).toContain('thunderstorms');
    expect(text).toContain('88° / 71°');
    expect(text).toContain('60% rain');
  });
});

describe('WeatherAlertBanner', () => {
  const now = new Date(2026, 9, 6, 15, 0);
  const alert = (over: Partial<WeatherAlert>): WeatherAlert => ({
    id: 'a',
    event: 'Tornado Warning',
    headline: '',
    severity: 'Extreme',
    urgency: 'Immediate',
    onset: null,
    ends: new Date(2026, 9, 6, 19, 45).getTime(),
    expires: new Date(2026, 9, 6, 19, 45).getTime(),
    ...over,
  });

  beforeEach(() => {
    resetStore();
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });
  afterEach(() => vi.useRealTimers());

  it('shows the top alert with +N more and hides Minor and expired alerts', () => {
    feed(WEATHER_ALERTS_PLUGIN_ID, {
      lastUpdated: 0,
      alerts: [
        alert({ id: '1' }),
        alert({ id: '2', event: 'Flood Watch', severity: 'Moderate' }),
        alert({ id: '3', event: 'Wind Advisory', severity: 'Minor' }),
        alert({ id: '4', event: 'Old Warning', ends: now.getTime() - 1000 }),
      ],
    });
    const { container } = render(WeatherAlertBanner);
    const text = container.textContent ?? '';
    expect(text).toContain('Tornado Warning');
    expect(text).toContain('until 7:45 PM');
    expect(text).toContain('+1 more');
    expect(text).not.toContain('Wind Advisory');
    expect(text).not.toContain('Old Warning');
  });

  it('dims during night mode, except for Extreme alerts', () => {
    feed(WEATHER_ALERTS_PLUGIN_ID, { lastUpdated: 0, alerts: [alert({ severity: 'Severe' })] });
    const severe = render(WeatherAlertBanner, { props: { dim: true } });
    expect(severe.container.querySelector('.alert-banner--dim')).not.toBeNull();
    severe.unmount();

    feed(WEATHER_ALERTS_PLUGIN_ID, { lastUpdated: 1, alerts: [alert({ severity: 'Extreme' })] });
    const extreme = render(WeatherAlertBanner, { props: { dim: true } });
    expect(extreme.container.querySelector('.alert-banner')).not.toBeNull();
    expect(extreme.container.querySelector('.alert-banner--dim')).toBeNull();
  });

  it('renders nothing without visible alerts', () => {
    feed(WEATHER_ALERTS_PLUGIN_ID, { lastUpdated: 0, alerts: [alert({ severity: 'Minor' })] });
    const { container } = render(WeatherAlertBanner);
    expect(container.querySelector('.alert-banner')).toBeNull();
  });
});
