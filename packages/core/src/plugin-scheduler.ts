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
    overrideInterval?: number
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

/** Internal plugin record tracking handler, timer, and generation token */
interface PluginRecord {
  manifest: PluginManifest;
  handler: () => Promise<void>;
  entry: SchedulerEntry;
  timerId: ReturnType<typeof setTimeout> | null;
  /** Generation token — incremented on every start/stop/restart/unregister */
  generation: number;
  /** Burst tracking: timestamps of recent runs within the burst window */
  burstWindow: number[];
}

const DEFAULT_INTERVAL = 60_000;
const MIN_INTERVAL = 100; // Minimum allowed interval to prevent CPU churn
const BURST_WINDOW_MS = 60_000; // 1 minute sliding window for burst tracking

/** Validate and clamp an interval to a safe positive finite value */
function clampInterval(value: number, floor: number): number {
  if (!Number.isFinite(value) || value <= 0) return floor;
  return Math.max(value, floor);
}

/** Create a centralized plugin scheduler */
export function createPluginScheduler(options: SchedulerOptions = {}): PluginSchedulerInstance {
  const rawDefault = options.defaultInterval ?? DEFAULT_INTERVAL;
  const defaultInterval = clampInterval(rawDefault, MIN_INTERVAL);
  const plugins = new Map<string, PluginRecord>();
  let closed = false;

  function clearTimer(record: PluginRecord): void {
    if (record.timerId !== null) {
      clearTimeout(record.timerId);
      record.timerId = null;
    }
    record.entry.nextRun = undefined;
  }

  function scheduleNext(record: PluginRecord, capturedGeneration: number): void {
    // Stale callback guard: skip if generation changed or scheduler closed
    if (closed || record.generation !== capturedGeneration || record.entry.status === 'stopped') {
      return;
    }

    const interval = record.entry.interval;
    record.entry.nextRun = Date.now() + interval;

    record.timerId = setTimeout(async () => {
      record.entry.nextRun = undefined;

      // Re-check identity: guard against stop/unregister/re-register while waiting
      if (closed || record.generation !== capturedGeneration || record.entry.status === 'stopped') {
        return;
      }

      const maxBurst = record.manifest.permissions?.max_request_burst;

      // Enforce burst limit if configured
      if (maxBurst !== undefined && maxBurst > 0 && Number.isFinite(maxBurst)) {
        const now = Date.now();
        // Evict timestamps outside the sliding window
        record.burstWindow = record.burstWindow.filter((t) => now - t < BURST_WINDOW_MS);

        if (record.burstWindow.length >= maxBurst) {
          // Burst exceeded — skip this tick, reschedule
          scheduleNext(record, capturedGeneration);
          return;
        }

        record.burstWindow.push(now);
      }

      try {
        await record.handler();
        // Re-check after async handler — stop/unregister may have happened during execution
        if (record.generation !== capturedGeneration || closed) return;
        record.entry.lastRun = Date.now();
        record.entry.runCount++;
        if (record.entry.status !== 'stopped') {
          record.entry.status = 'running';
          record.entry.error = undefined;
        }
      } catch (err) {
        // Re-check after async handler — stop/unregister may have happened during execution
        if (record.generation !== capturedGeneration || closed) return;
        record.entry.status = 'error';
        record.entry.error = err instanceof Error ? err.message : String(err);
        record.entry.lastRun = Date.now();
        record.entry.runCount++;
      }

      // Schedule next tick — only if still active (this also guards against stop-while-throwing)
      scheduleNext(record, capturedGeneration);
    }, interval);
  }

  return {
    register(pluginId, manifest, handler, overrideInterval) {
      // Clear existing entry if re-registering — bump generation to invalidate stale callbacks
      const existing = plugins.get(pluginId);
      if (existing) {
        existing.generation++;
        clearTimer(existing);
      }

      // Determine effective interval — clamp to safe minimum
      const manifestInterval = manifest.permissions?.max_refresh_ms;
      const floorInterval =
        manifestInterval !== undefined && Number.isFinite(manifestInterval) && manifestInterval > 0
          ? manifestInterval
          : defaultInterval;

      let interval: number;
      if (overrideInterval !== undefined) {
        // Admin override — but clamp to max_refresh_ms minimum (resource budget enforcement)
        interval = clampInterval(overrideInterval, floorInterval);
      } else {
        interval = floorInterval;
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
        generation: 0,
        burstWindow: [],
      });
    },

    unregister(pluginId) {
      const record = plugins.get(pluginId);
      if (!record) return;
      // Bump generation to invalidate any in-flight callback
      record.generation++;
      clearTimer(record);
      plugins.delete(pluginId);
    },

    start(pluginId) {
      const record = plugins.get(pluginId);
      if (!record) return;
      // Bump generation to invalidate any previous chain
      record.generation++;
      clearTimer(record);
      record.entry.status = 'running';
      record.entry.error = undefined;
      scheduleNext(record, record.generation);
    },

    stop(pluginId) {
      const record = plugins.get(pluginId);
      if (!record) return;
      // Bump generation — this is the definitive stop signal for any in-flight callback
      record.generation++;
      clearTimer(record);
      record.entry.status = 'stopped';
    },

    restart(pluginId) {
      const record = plugins.get(pluginId);
      if (!record) return;
      // Bump generation to invalidate any previous chain
      record.generation++;
      clearTimer(record);
      record.entry.status = 'running';
      record.entry.error = undefined;
      record.burstWindow = [];
      scheduleNext(record, record.generation);
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
        record.generation++;
        clearTimer(record);
        record.entry.status = 'stopped';
      }
    },
  };
}
