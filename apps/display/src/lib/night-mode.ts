// Night window and config parsing are shared with the host (it dims the backlight)
export { isNightTime, parseNightConfig } from '@lensing/types';
export type { NightConfig } from '@lensing/types';

/** Local YYYY-MM-DD of now + 8 hours: the day the night view previews. */
export function dayAheadDate(now: Date): string {
  const d = new Date(now.getTime() + 8 * 60 * 60_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
