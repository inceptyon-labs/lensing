import type { PluginManifest } from '@lensing/types';

/** Options for createPluginScheduler */
export interface SchedulerOptions {
  /** Default interval in ms when manifest has no max_refresh_ms */
  defaultInterval?: number;
}

/** Status of a scheduled plugin */
export type SchedulerStatus = 'stopped' | 'running' | 'error';

/** State entry for a single scheduled plugin */
export interface SchedulerEntry {
  pluginId: string;
  interval: number;
  status: SchedulerStatus;
  lastRun?: number;
  nextRun?: number;
  runCount: number;
  error?: string;
}

/** Public interface for the plugin scheduler */
export interface PluginSchedulerInstance {
  register(
    pluginId: string,
    manifest: PluginManifest,
    handler: () => Promise<void>,
    overrideInterval?: number,
  ): void;
  unregister(pluginId: string): void;
  start(pluginId: string): void;
  stop(pluginId: string): void;
  restart(pluginId: string): void;
  startAll(): void;
  stopAll(): void;
  getState(): Map<string, SchedulerEntry>;
  getPluginState(pluginId: string): SchedulerEntry | undefined;
  close(): void;
}

/** Internal plugin record tracking handler and timer */
interface PluginRecord {
  manifest: PluginManifest;
  handler: () => Promise<void>;
  entry: SchedulerEntry;
  timerId: ReturnType<typeof setTimeout> | null;
  /** Burst tracking: timestamps of recent runs within the burst window */
  burstWindow: number[];
}

const DEFAULT_INTERVAL = 60_000;
const BURST_WINDOW_MS = 60_000; // 1 minute sliding window for burst tracking

/** Create a centralized plugin scheduler */
export function createPluginScheduler(
  options: SchedulerOptions = {},
): PluginSchedulerInstance {
  const { defaultInterval = DEFAULT_INTERVAL } = options;
  const plugins = new Map<string, PluginRecord>();
  let closed = false;

  function clearTimer(record: PluginRecord): void {
    if (record.timerId !== null) {
      clearTimeout(record.timerId);
      record.timerId = null;
    }
  }

  function scheduleNext(record: PluginRecord): void {
    if (closed || record.entry.status === 'stopped') return;

    const interval = record.entry.interval;

    record.timerId = setTimeout(async () => {
      if (closed || record.entry.status === 'stopped') return;

      const maxBurst = record.manifest.permissions?.max_request_burst;

      // Enforce burst limit if configured
      if (maxBurst !== undefined && maxBurst > 0) {
        const now = Date.now();
        // Evict timestamps outside the sliding window
        record.burstWindow = record.burstWindow.filter(
          (t) => now - t < BURST_WINDOW_MS,
        );

        if (record.burstWindow.length >= maxBurst) {
          // Burst exceeded — skip this tick, reschedule
          scheduleNext(record);
          return;
        }

        record.burstWindow.push(now);
      }

      try {
        await record.handler();
        record.entry.lastRun = Date.now();
        record.entry.runCount++;
        if (record.entry.status !== 'stopped') {
          record.entry.status = 'running';
          record.entry.error = undefined;
        }
      } catch (err) {
        record.entry.status = 'error';
        record.entry.error =
          err instanceof Error ? err.message : String(err);
        record.entry.lastRun = Date.now();
        record.entry.runCount++;
      }

      // Schedule next tick even after error
      scheduleNext(record);
    }, interval);
  }

  return {
    register(pluginId, manifest, handler, overrideInterval) {
      // Determine effective interval
      const manifestInterval = manifest.permissions?.max_refresh_ms;

      let interval: number;
      if (overrideInterval !== undefined) {
        // Admin override — but clamp to max_refresh_ms minimum
        if (manifestInterval !== undefined && manifestInterval > 0) {
          interval = Math.max(overrideInterval, manifestInterval);
        } else {
          interval = overrideInterval;
        }
      } else if (manifestInterval !== undefined && manifestInterval > 0) {
        interval = manifestInterval;
      } else {
        interval = defaultInterval;
      }

      const entry: SchedulerEntry = {
        pluginId,
        interval,
        status: 'stopped',
        runCount: 0,
      };

      plugins.set(pluginId, {
        manifest,
        handler,
        entry,
        timerId: null,
        burstWindow: [],
      });
    },

    unregister(pluginId) {
      const record = plugins.get(pluginId);
      if (!record) return;
      clearTimer(record);
      plugins.delete(pluginId);
    },

    start(pluginId) {
      const record = plugins.get(pluginId);
      if (!record) return;
      clearTimer(record);
      record.entry.status = 'running';
      record.entry.error = undefined;
      scheduleNext(record);
    },

    stop(pluginId) {
      const record = plugins.get(pluginId);
      if (!record) return;
      clearTimer(record);
      record.entry.status = 'stopped';
    },

    restart(pluginId) {
      const record = plugins.get(pluginId);
      if (!record) return;
      clearTimer(record);
      record.entry.status = 'running';
      record.entry.error = undefined;
      record.burstWindow = [];
      scheduleNext(record);
    },

    startAll() {
      for (const pluginId of plugins.keys()) {
        this.start(pluginId);
      }
    },

    stopAll() {
      for (const pluginId of plugins.keys()) {
        this.stop(pluginId);
      }
    },

    getState() {
      const result = new Map<string, SchedulerEntry>();
      for (const [pluginId, record] of plugins) {
        result.set(pluginId, { ...record.entry });
      }
      return result;
    },

    getPluginState(pluginId) {
      const record = plugins.get(pluginId);
      if (!record) return undefined;
      return { ...record.entry };
    },

    close() {
      if (closed) return;
      closed = true;
      for (const record of plugins.values()) {
        clearTimer(record);
        record.entry.status = 'stopped';
      }
    },
  };
}
