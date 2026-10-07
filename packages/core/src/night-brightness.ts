import { isNightTime } from '@lensing/types';
import type { DataBusInstance, HostServiceLogger, NightConfig, PresenceData } from '@lensing/types';

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
export function createNightBrightness(options: NightBrightnessOptions): { close(): void } {
  const {
    dataBus,
    getConfig,
    getDayBrightness,
    setBrightness,
    logger,
    checkInterval_ms = 60_000,
    wakeDelay_ms = 3_000,
    retryBackoff_ms = 10 * 60_000,
  } = options;

  let applied: number | null = null;
  let failedTarget: number | null = null;
  let lastFailureAt = 0;
  let closed = false;
  let wakeTimer: ReturnType<typeof setTimeout> | undefined;

  function check(fromWake = false): void {
    if (closed) return;
    const config = getConfig();
    const night = config.enabled && isNightTime(new Date(), config.startTime, config.endTime);
    const target = night ? config.brightness : getDayBrightness();
    if (target === applied) return;
    if (!fromWake && target === failedTarget && Date.now() - lastFailureAt < retryBackoff_ms)
      return;
    try {
      setBrightness(target);
      applied = target;
      failedTarget = null;
      logger?.info(`Display brightness set to ${target}% (${night ? 'night' : 'day'})`);
    } catch (err) {
      // Log once per target; keep retrying quietly
      if (failedTarget !== target) logger?.error(`Display brightness ${target}% failed`, err);
      failedTarget = target;
      lastFailureAt = Date.now();
    }
  }

  const timer = setInterval(() => check(), checkInterval_ms);
  const unsubscribe = dataBus.onMessage((msg) => {
    if (msg.channel !== 'presence.pir' || !(msg.data as PresenceData).detected) return;
    clearTimeout(wakeTimer);
    wakeTimer = setTimeout(() => check(true), wakeDelay_ms);
  });
  check();

  return {
    close(): void {
      closed = true;
      clearInterval(timer);
      clearTimeout(wakeTimer);
      unsubscribe();
    },
  };
}
