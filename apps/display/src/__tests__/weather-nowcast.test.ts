import { describe, it, expect } from 'vitest';
import type { WeatherNowcast } from '@lensing/types';
import { nowcastHints } from '../lib/weather-nowcast';

const MIN = 60_000;

function at(h: number, m = 0): Date {
  return new Date(2026, 9, 6, h, m, 0, 0);
}

/** 15-min precipitation steps starting at `start`, one mm value per step */
function precip(start: Date, mms: number[]): WeatherNowcast['precipitation'] {
  return mms.map((mm, i) => ({ time: start.getTime() + i * 15 * MIN, mm }));
}

/** hourly UV values starting at the given local hour */
function uv(startHour: number, values: number[]): WeatherNowcast['uv'] {
  return values.map((index, i) => ({ time: at(startHour + i).getTime(), index }));
}

function nc(p: WeatherNowcast['precipitation'] = [], u: WeatherNowcast['uv'] = []): WeatherNowcast {
  return { precipitation: p, uv: u };
}

describe('nowcastHints', () => {
  it('returns [] when nowcast is undefined', () => {
    expect(nowcastHints(undefined, at(12))).toEqual([]);
  });

  it('reports when current rain ends', () => {
    // 16:00 now; wet at 16:00, 16:15, 16:30; dry from 16:45
    const p = precip(at(16), [1, 1, 0.5, 0, 0, 0]);
    expect(nowcastHints(nc(p), at(16, 5))).toEqual(['Rain until ~4:45pm']);
  });

  it('reports rain through the whole horizon', () => {
    const p = precip(at(16), [1, 1, 1, 1]);
    expect(nowcastHints(nc(p), at(16, 20))).toEqual(['Rain for the next few hours']);
  });

  it('reports rain starting later within 3 hours', () => {
    const p = precip(at(16), [0, 0, 0, 0, 0.3, 0.3]);
    expect(nowcastHints(nc(p), at(16, 5))).toEqual(['Rain around 5pm — grab an umbrella']);
  });

  it('ignores rain further than 3 hours out and drizzle below 0.1mm', () => {
    const p = precip(at(12), new Array(24).fill(0.05));
    p[14] = { time: p[14].time, mm: 2 }; // 3.5h out
    expect(nowcastHints(nc(p), at(12, 5))).toEqual([]);
  });

  it('reports UV now when the current hour is high', () => {
    const u = uv(10, [5, 7, 8, 9]);
    expect(nowcastHints(nc([], u), at(11, 30))).toEqual(['UV 7 now — sunscreen']);
  });

  it('reports the UV peak time when it is later today', () => {
    const u = uv(10, [3, 5, 7, 9, 8.6, 6]);
    expect(nowcastHints(nc([], u), at(10, 10))).toEqual(['UV 9 around 1pm — sunscreen']);
  });

  it('gives no UV hint after 5pm', () => {
    const u = uv(17, [8, 8]);
    expect(nowcastHints(nc([], u), at(17, 5))).toEqual([]);
  });

  it('lists rain first and caps at two hints', () => {
    const p = precip(at(12), [1, 0, 0]);
    const u = uv(12, [9, 9]);
    const hints = nowcastHints(nc(p, u), at(12, 1));
    expect(hints).toEqual(['Rain until ~12:15pm', 'UV 9 now — sunscreen']);
  });
});
