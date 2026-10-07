import { describe, it, expect } from 'vitest';
import { isNightTime, parseNightConfig } from '../night-mode';
const at = (h, m = 0) => new Date(2026, 9, 6, h, m);
describe('isNightTime', () => {
    it('handles a window that crosses midnight', () => {
        expect(isNightTime(at(23), '22:00', '06:00')).toBe(true);
        expect(isNightTime(at(5, 59), '22:00', '06:00')).toBe(true);
        expect(isNightTime(at(6), '22:00', '06:00')).toBe(false);
        expect(isNightTime(at(21, 59), '22:00', '06:00')).toBe(false);
    });
    it('is never night for an empty or invalid window', () => {
        expect(isNightTime(at(23), '22:00', '22:00')).toBe(false);
        expect(isNightTime(at(23), '25:00', '06:00')).toBe(false);
    });
});
describe('parseNightConfig', () => {
    it('fills defaults and tolerates string values', () => {
        expect(parseNightConfig(undefined)).toEqual({
            enabled: true,
            startTime: '22:00',
            endTime: '06:00',
            brightness: 10,
        });
        expect(parseNightConfig({ enabled: 'false', brightness: '25' })).toMatchObject({
            enabled: false,
            brightness: 25,
        });
    });
});
//# sourceMappingURL=night-mode.test.js.map