const HHMM = /^(\d{1,2}):(\d{2})$/;

export interface NightConfig {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

function toMinutes(s: string): number | null {
  const m = HHMM.exec(String(s).trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** True when `now` falls in [start, end), where the window may cross midnight. */
export function isNightTime(now: Date, start: string, end: string): boolean {
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (s === null || e === null || s === e) return false;
  const cur = now.getHours() * 60 + now.getMinutes();
  return s < e ? cur >= s && cur < e : cur >= s || cur < e;
}

/** Local YYYY-MM-DD of now + 8 hours: the day the night view previews. */
export function dayAheadDate(now: Date): string {
  const d = new Date(now.getTime() + 8 * 60 * 60_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function cfgBool(val: unknown, fallback: boolean): boolean {
  if (val === true || val === 'true') return true;
  if (val === false || val === 'false') return false;
  return fallback;
}

function cfgTime(val: unknown, fallback: string): string {
  return typeof val === 'string' && val ? val : fallback;
}

/** Parse the night-mode module config, tolerating string booleans and missing values. */
export function parseNightConfig(config: Record<string, unknown> | undefined): NightConfig {
  return {
    enabled: cfgBool(config?.['enabled'], true),
    startTime: cfgTime(config?.['startTime'], '22:00'),
    endTime: cfgTime(config?.['endTime'], '06:00'),
  };
}
