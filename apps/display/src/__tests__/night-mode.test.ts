import { describe, it, expect } from 'vitest';
import { isNightTime, dayAheadDate, parseNightConfig } from '../lib/night-mode';

const at = (h: number, m = 0) => new Date(2026, 9, 6, h, m);

describe('isNightTime', () => {
  it('handles a window crossing midnight', () => {
    expect(isNightTime(at(23), '22:00', '06:00')).toBe(true);
    expect(isNightTime(at(2), '22:00', '06:00')).toBe(true);
    expect(isNightTime(at(22, 0), '22:00', '06:00')).toBe(true);
    expect(isNightTime(at(6, 0), '22:00', '06:00')).toBe(false);
    expect(isNightTime(at(12), '22:00', '06:00')).toBe(false);
  });
  it('handles a same-day window', () => {
    expect(isNightTime(at(13), '12:00', '14:00')).toBe(true);
    expect(isNightTime(at(15), '12:00', '14:00')).toBe(false);
  });
  it('returns false for equal or invalid times', () => {
    expect(isNightTime(at(23), '22:00', '22:00')).toBe(false);
    expect(isNightTime(at(23), 'nope', '06:00')).toBe(false);
    expect(isNightTime(at(23), '22:00', '25:00')).toBe(false);
  });
});

describe('dayAheadDate', () => {
  it('is tomorrow at 10pm', () => {
    expect(dayAheadDate(at(22))).toBe('2026-10-07');
  });
  it('is today at 2am', () => {
    expect(dayAheadDate(at(2))).toBe('2026-10-06');
  });
});

describe('parseNightConfig', () => {
  it('applies defaults and parses string booleans', () => {
    expect(parseNightConfig(undefined)).toEqual({
      enabled: true,
      startTime: '22:00',
      endTime: '06:00',
    });
    expect(parseNightConfig({ enabled: 'false', startTime: '23:00', endTime: '05:30' })).toEqual({
      enabled: false,
      startTime: '23:00',
      endTime: '05:30',
    });
  });
});
