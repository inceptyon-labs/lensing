import { describe, it, expect } from 'vitest';
import type { WeatherAlert } from '@lensing/types';
import { visibleAlerts, formatAlertUntil } from '../lib/weather-alerts';

const now = new Date(2026, 9, 6, 15, 0);
const alert = (over: Partial<WeatherAlert>): WeatherAlert => ({
  id: 'a',
  event: 'Flood Watch',
  headline: '',
  severity: 'Severe',
  urgency: 'Expected',
  onset: null,
  ends: null,
  expires: new Date(2026, 9, 6, 19, 45).getTime(),
  ...over,
});

describe('visibleAlerts', () => {
  it('keeps Extreme/Severe/Moderate and drops Minor, Unknown and expired', () => {
    const list = [
      alert({ id: 'x', severity: 'Extreme' }),
      alert({ id: 'm', severity: 'Minor' }),
      alert({ id: 'u', severity: 'Unknown' }),
      alert({ id: 'mod', severity: 'Moderate' }),
      alert({ id: 'old', ends: now.getTime() - 1 }),
    ];
    expect(visibleAlerts(list, now).map((a) => a.id)).toEqual(['x', 'mod']);
  });
  it('uses ends over expires', () => {
    const a = alert({ ends: now.getTime() - 1000, expires: now.getTime() + 1000 });
    expect(visibleAlerts([a], now)).toEqual([]);
  });
});

describe('formatAlertUntil', () => {
  it('formats a same-day time', () => {
    expect(formatAlertUntil(alert({}), now)).toBe('until 7:45 PM');
  });
  it('prefixes a weekday when not today', () => {
    const a = alert({ ends: new Date(2026, 9, 7, 7, 0).getTime() });
    expect(formatAlertUntil(a, now)).toBe('until Wed 7:00 AM');
  });
});
