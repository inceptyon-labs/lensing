import { isNightTime } from '@lensing/types';
/**
 * Dims the monitor backlight during the night-mode window and restores the day
 * level afterwards. DDC/CI only works while the monitor is on, and a failed ddcutil
 * call blocks for seconds, so failures are retried shortly after motion wakes the
 * display and otherwise at most every retryBackoff_ms.
 */
export function createNightBrightness(options) {
    const { dataBus, getConfig, getDayBrightness, setBrightness, logger, checkInterval_ms = 60_000, wakeDelay_ms = 3_000, retryBackoff_ms = 10 * 60_000, } = options;
    let applied = null;
    let failedTarget = null;
    let lastFailureAt = 0;
    let closed = false;
    let wakeTimer;
    function check(fromWake = false) {
        if (closed)
            return;
        const config = getConfig();
        const night = config.enabled && isNightTime(new Date(), config.startTime, config.endTime);
        const target = night ? config.brightness : getDayBrightness();
        if (target === applied)
            return;
        if (!fromWake && target === failedTarget && Date.now() - lastFailureAt < retryBackoff_ms)
            return;
        try {
            setBrightness(target);
            applied = target;
            failedTarget = null;
            logger?.info(`Display brightness set to ${target}% (${night ? 'night' : 'day'})`);
        }
        catch (err) {
            // Log once per target; keep retrying quietly
            if (failedTarget !== target)
                logger?.error(`Display brightness ${target}% failed`, err);
            failedTarget = target;
            lastFailureAt = Date.now();
        }
    }
    const timer = setInterval(() => check(), checkInterval_ms);
    const unsubscribe = dataBus.onMessage((msg) => {
        if (msg.channel !== 'presence.pir' || !msg.data.detected)
            return;
        clearTimeout(wakeTimer);
        wakeTimer = setTimeout(() => check(true), wakeDelay_ms);
    });
    check();
    return {
        close() {
            closed = true;
            clearInterval(timer);
            clearTimeout(wakeTimer);
            unsubscribe();
        },
    };
}
//# sourceMappingURL=night-brightness.js.map