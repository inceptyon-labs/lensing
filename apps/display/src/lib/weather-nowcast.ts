import type { WeatherNowcast } from '@lensing/types';

const STEP_MS = 15 * 60_000;
const HOUR_MS = 60 * 60_000;
const WET_MM = 0.1;
const RAIN_LOOKAHEAD_MS = 3 * HOUR_MS;
const UV_THRESHOLD = 6;
const UV_CUTOFF_HOUR = 17;
const MAX_HINTS = 2;

/** "4:15pm", or "1pm" on the hour */
export function formatHintTime(ms: number): string {
  const d = new Date(ms);
  const h = d.getHours();
  const m = d.getMinutes();
  const hour12 = h % 12 || 12;
  const suffix = h >= 12 ? 'pm' : 'am';
  return m === 0 ? `${hour12}${suffix}` : `${hour12}:${String(m).padStart(2, '0')}${suffix}`;
}

function rainHint(steps: WeatherNowcast['precipitation'], nowMs: number): string | null {
  const sorted = [...steps].sort((a, b) => a.time - b.time);
  const wet = (s: { mm: number }) => s.mm >= WET_MM;
  const currentIdx = sorted.findIndex((s) => s.time <= nowMs && nowMs < s.time + STEP_MS);

  if (currentIdx >= 0 && wet(sorted[currentIdx])) {
    const dry = sorted.slice(currentIdx + 1).find((s) => !wet(s));
    return dry ? `Rain until ~${formatHintTime(dry.time)}` : 'Rain for the next few hours';
  }

  const next = sorted.find((s) => s.time > nowMs && s.time <= nowMs + RAIN_LOOKAHEAD_MS && wet(s));
  return next ? `Rain around ${formatHintTime(next.time)} — grab an umbrella` : null;
}

function uvHint(hours: WeatherNowcast['uv'], now: Date): string | null {
  if (now.getHours() >= UV_CUTOFF_HOUR) return null;
  const nowMs = now.getTime();
  const cutoff = new Date(now);
  cutoff.setHours(UV_CUTOFF_HOUR, 0, 0, 0);

  const window = hours.filter((h) => h.time + HOUR_MS > nowMs && h.time < cutoff.getTime());
  if (window.length === 0) return null;
  const peak = window.reduce((best, h) => (h.index > best.index ? h : best));
  if (peak.index < UV_THRESHOLD) return null;

  const current = window.find((h) => h.time <= nowMs);
  if (current && current.index >= UV_THRESHOLD) {
    return `UV ${Math.round(current.index)} now — sunscreen`;
  }
  return `UV ${Math.round(peak.index)} around ${formatHintTime(peak.time)} — sunscreen`;
}

/** Short "leaving soon" hints: rain first, then UV. At most two. */
export function nowcastHints(nowcast: WeatherNowcast | undefined, now: Date): string[] {
  if (!nowcast) return [];
  const hints: string[] = [];
  const rain = rainHint(nowcast.precipitation ?? [], now.getTime());
  if (rain) hints.push(rain);
  const uv = uvHint(nowcast.uv ?? [], now);
  if (uv) hints.push(uv);
  return hints.slice(0, MAX_HINTS);
}
