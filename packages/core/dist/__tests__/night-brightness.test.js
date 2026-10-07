import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createNightBrightness } from '../night-brightness';
import { createDataBus } from '../data-bus';
const NIGHT = { enabled: true, startTime: '22:00', endTime: '06:00', brightness: 10 };
describe('createNightBrightness', () => {
    let bus;
    let setBrightness;
    beforeEach(() => {
        vi.useFakeTimers();
        bus = createDataBus();
        setBrightness = vi.fn();
    });
    afterEach(() => vi.useRealTimers());
    function start(config = NIGHT, dayLevel = 80) {
        return createNightBrightness({
            dataBus: bus,
            getConfig: () => config,
            getDayBrightness: () => dayLevel,
            setBrightness,
        });
    }
    it('dims at the start of the window and restores the day level at the end', () => {
        vi.setSystemTime(new Date(2026, 9, 6, 21, 59));
        const ctl = start();
        expect(setBrightness).toHaveBeenLastCalledWith(80);
        vi.advanceTimersByTime(60_000); // 22:00
        expect(setBrightness).toHaveBeenLastCalledWith(10);
        vi.setSystemTime(new Date(2026, 9, 7, 5, 59));
        vi.advanceTimersByTime(60_000); // 06:00
        expect(setBrightness).toHaveBeenLastCalledWith(80);
        expect(setBrightness).toHaveBeenCalledTimes(3);
        ctl.close();
    });
    it('retries when the monitor rejects the change, and right after motion wakes it', () => {
        vi.setSystemTime(new Date(2026, 9, 6, 23, 0));
        setBrightness.mockImplementation(() => {
            throw new Error('Display not found');
        });
        const ctl = start();
        expect(setBrightness).toHaveBeenCalledTimes(1);
        // ddcutil blocks for seconds while the monitor sleeps, so don't retry every minute
        vi.advanceTimersByTime(5 * 60_000);
        expect(setBrightness).toHaveBeenCalledTimes(1);
        setBrightness.mockReset();
        bus.publish('presence.pir', 'pir-server', {
            detected: true,
            lastMotionAt: Date.now(),
            available: true,
        });
        vi.advanceTimersByTime(3_000);
        expect(setBrightness).toHaveBeenCalledWith(10);
        vi.advanceTimersByTime(60_000);
        expect(setBrightness).toHaveBeenCalledTimes(1); // applied, no repeat
        ctl.close();
    });
    it('keeps the day level when night mode is disabled', () => {
        vi.setSystemTime(new Date(2026, 9, 6, 23, 0));
        const ctl = start({ ...NIGHT, enabled: false });
        expect(setBrightness).toHaveBeenCalledWith(80);
        expect(setBrightness).not.toHaveBeenCalledWith(10);
        ctl.close();
    });
    it('stops checking after close', () => {
        vi.setSystemTime(new Date(2026, 9, 6, 21, 59));
        const ctl = start();
        ctl.close();
        setBrightness.mockClear();
        vi.advanceTimersByTime(120_000);
        bus.publish('presence.pir', 'pir-server', {
            detected: true,
            lastMotionAt: Date.now(),
            available: true,
        });
        vi.advanceTimersByTime(3_000);
        expect(setBrightness).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=night-brightness.test.js.map