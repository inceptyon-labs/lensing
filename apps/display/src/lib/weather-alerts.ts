import type { WeatherAlert } from '@lensing/types';

const VISIBLE_SEVERITIES = new Set(['Extreme', 'Severe', 'Moderate']);

function endMs(a: WeatherAlert): number {
  return a.ends ?? a.expires;
}

/** Alerts worth showing on the kiosk: Moderate or worse and not yet ended. Order is preserved. */
export function visibleAlerts(alerts: WeatherAlert[], now: Date): WeatherAlert[] {
  return alerts.filter((a) => VISIBLE_SEVERITIES.has(a.severity) && endMs(a) > now.getTime());
}

/** "until 7:45 PM", with a weekday prefix when the end is not today. */
export function formatAlertUntil(alert: WeatherAlert, now: Date): string {
  const end = new Date(endMs(alert));
  const time = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const sameDay = end.toDateString() === now.toDateString();
  if (sameDay) return `until ${time}`;
  const day = end.toLocaleDateString('en-US', { weekday: 'short' });
  return `until ${day} ${time}`;
}
