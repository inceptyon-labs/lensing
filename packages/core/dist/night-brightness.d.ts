import type { DataBusInstance, HostServiceLogger, NightConfig } from '@lensing/types';
export interface NightBrightnessOptions {
    dataBus: DataBusInstance;
    /** Read on every check so admin changes apply without a restart */
    getConfig: () => NightConfig;
    /** Brightness to restore outside the night window */
    getDayBrightness: () => number;
    /** Throws when the monitor can't be reached (e.g. DDC while it is asleep) */
    setBrightness: (value: number) => void;
    logger?: HostServiceLogger;
    checkInterval_ms?: number;
    /** Delay after motion before retrying, so a waking monitor answers DDC */
    wakeDelay_ms?: number;
    /** Minimum gap between timed retries after a failure (motion retries immediately) */
    retryBackoff_ms?: number;
}
/**
 * Dims the monitor backlight during the night-mode window and restores the day
 * level afterwards. DDC/CI only works while the monitor is on, and a failed ddcutil
 * call blocks for seconds, so failures are retried shortly after motion wakes the
 * display and otherwise at most every retryBackoff_ms.
 */
export declare function createNightBrightness(options: NightBrightnessOptions): {
    close(): void;
};
//# sourceMappingURL=night-brightness.d.ts.map