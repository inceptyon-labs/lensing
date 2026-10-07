import { describe, it, expect } from 'vitest';
import { dayAheadDate } from '../lib/night-mode';

const at = (h: number, m = 0) => new Date(2026, 9, 6, h, m);

describe('dayAheadDate', () => {
  it('is tomorrow at 10pm', () => {
    expect(dayAheadDate(at(22))).toBe('2026-10-07');
  });
  it('is today at 2am', () => {
    expect(dayAheadDate(at(2))).toBe('2026-10-06');
  });
});
