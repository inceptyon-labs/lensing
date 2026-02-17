import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPluginScheduler, type PluginSchedulerInstance } from '../plugin-scheduler';
import type { PluginManifest } from '@lensing/types';

/** Create a basic test manifest */
function createManifest(id: string, overrides: Partial<PluginManifest> = {}): PluginManifest {
  return {
    id,
    name: id,
    version: '1.0.0',
    permissions: {
      max_refresh_ms: 5000,
      max_request_burst: 10,
    },
    ...overrides,
  };
}

describe('PluginScheduler', () => {
  let scheduler: PluginSchedulerInstance;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    if (scheduler) {
      scheduler.close();
    }
    vi.useRealTimers();
  });

  describe('createPluginScheduler', () => {
    it('should create a scheduler instance', () => {
      scheduler = createPluginScheduler();
      expect(scheduler).toBeDefined();
      expect(typeof scheduler.register).toBe('function');
      expect(typeof scheduler.start).toBe('function');
      expect(typeof scheduler.stop).toBe('function');
      expect(typeof scheduler.close).toBe('function');
    });

    it('should accept default interval option', () => {
      scheduler = createPluginScheduler({ defaultInterval: 30000 });
      expect(scheduler).toBeDefined();
    });
  });

  describe('register', () => {
    it('should register a plugin with manifest interval', () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockResolvedValue(undefined);
      const manifest = createManifest('clock', {
        permissions: { max_refresh_ms: 10000 },
      });

      scheduler.register('clock', manifest, handler);

      const state = scheduler.getPluginState('clock');
      expect(state).toBeDefined();
      expect(state!.pluginId).toBe('clock');
      expect(state!.interval).toBe(10000);
      expect(state!.status).toBe('stopped');
    });

    it('should use admin override interval when provided', () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockResolvedValue(undefined);
      const manifest = createManifest('clock', {
        permissions: { max_refresh_ms: 10000 },
      });

      scheduler.register('clock', manifest, handler, 30000);

      const state = scheduler.getPluginState('clock');
      expect(state!.interval).toBe(30000);
    });

    it('should use default interval when manifest has no max_refresh_ms', () => {
      scheduler = createPluginScheduler({ defaultInterval: 60000 });
      const handler = vi.fn().mockResolvedValue(undefined);
      const manifest = createManifest('clock', { permissions: {} });

      scheduler.register('clock', manifest, handler);

      const state = scheduler.getPluginState('clock');
      expect(state!.interval).toBe(60000);
    });

    it('should unregister a plugin', () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockResolvedValue(undefined);
      scheduler.register('clock', createManifest('clock'), handler);

      scheduler.unregister('clock');

      expect(scheduler.getPluginState('clock')).toBeUndefined();
    });

    it('should stop timer when unregistering a running plugin', () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockResolvedValue(undefined);
      scheduler.register('clock', createManifest('clock'), handler);
      scheduler.start('clock');

      scheduler.unregister('clock');

      // Advance time past interval — handler should not be called after unregister
      vi.advanceTimersByTime(10000);
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('start / stop / restart', () => {
    it('should start a plugin timer and execute handler', async () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockResolvedValue(undefined);
      const manifest = createManifest('clock', {
        permissions: { max_refresh_ms: 1000 },
      });
      scheduler.register('clock', manifest, handler);

      scheduler.start('clock');

      expect(scheduler.getPluginState('clock')!.status).toBe('running');

      // Advance past interval
      await vi.advanceTimersByTimeAsync(1000);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should repeatedly execute handler at interval', async () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockResolvedValue(undefined);
      const manifest = createManifest('clock', {
        permissions: { max_refresh_ms: 1000 },
      });
      scheduler.register('clock', manifest, handler);
      scheduler.start('clock');

      await vi.advanceTimersByTimeAsync(3500);

      expect(handler).toHaveBeenCalledTimes(3);
    });

    it('should stop a running plugin', async () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockResolvedValue(undefined);
      const manifest = createManifest('clock', {
        permissions: { max_refresh_ms: 1000 },
      });
      scheduler.register('clock', manifest, handler);
      scheduler.start('clock');

      await vi.advanceTimersByTimeAsync(1500);
      expect(handler).toHaveBeenCalledTimes(1);

      scheduler.stop('clock');
      expect(scheduler.getPluginState('clock')!.status).toBe('stopped');

      await vi.advanceTimersByTimeAsync(2000);
      // Should not have been called again after stop
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should restart a plugin (stop + start)', async () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockResolvedValue(undefined);
      const manifest = createManifest('clock', {
        permissions: { max_refresh_ms: 1000 },
      });
      scheduler.register('clock', manifest, handler);
      scheduler.start('clock');

      await vi.advanceTimersByTimeAsync(1500);
      expect(handler).toHaveBeenCalledTimes(1);

      scheduler.restart('clock');
      expect(scheduler.getPluginState('clock')!.status).toBe('running');

      await vi.advanceTimersByTimeAsync(1000);
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should startAll registered plugins', async () => {
      scheduler = createPluginScheduler();
      const handler1 = vi.fn().mockResolvedValue(undefined);
      const handler2 = vi.fn().mockResolvedValue(undefined);
      scheduler.register(
        'clock',
        createManifest('clock', {
          permissions: { max_refresh_ms: 1000 },
        }),
        handler1
      );
      scheduler.register(
        'weather',
        createManifest('weather', {
          permissions: { max_refresh_ms: 2000 },
        }),
        handler2
      );

      scheduler.startAll();

      await vi.advanceTimersByTimeAsync(2000);
      expect(handler1).toHaveBeenCalledTimes(2);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should stopAll running plugins', async () => {
      scheduler = createPluginScheduler();
      const handler1 = vi.fn().mockResolvedValue(undefined);
      const handler2 = vi.fn().mockResolvedValue(undefined);
      scheduler.register(
        'clock',
        createManifest('clock', {
          permissions: { max_refresh_ms: 1000 },
        }),
        handler1
      );
      scheduler.register(
        'weather',
        createManifest('weather', {
          permissions: { max_refresh_ms: 1000 },
        }),
        handler2
      );

      scheduler.startAll();
      await vi.advanceTimersByTimeAsync(1000);

      scheduler.stopAll();

      await vi.advanceTimersByTimeAsync(5000);
      // Both should have only 1 call (before stopAll)
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should not throw for start on unknown plugin', () => {
      scheduler = createPluginScheduler();
      expect(() => scheduler.start('nonexistent')).not.toThrow();
    });

    it('should not throw for stop on unknown plugin', () => {
      scheduler = createPluginScheduler();
      expect(() => scheduler.stop('nonexistent')).not.toThrow();
    });
  });

  describe('resource budget enforcement', () => {
    it('should enforce max_refresh_ms minimum interval', async () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockResolvedValue(undefined);
      const manifest = createManifest('clock', {
        permissions: { max_refresh_ms: 5000 },
      });

      // Register with override trying to go faster than max_refresh_ms allows
      scheduler.register('clock', manifest, handler, 1000);

      // Effective interval should be clamped to max_refresh_ms
      const state = scheduler.getPluginState('clock');
      expect(state!.interval).toBeGreaterThanOrEqual(5000);
    });

    it('should track and enforce max_request_burst', async () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockResolvedValue(undefined);
      const manifest = createManifest('clock', {
        permissions: { max_refresh_ms: 100, max_request_burst: 3 },
      });
      scheduler.register('clock', manifest, handler);
      scheduler.start('clock');

      // Let 5 intervals pass — only 3 should execute due to burst limit
      await vi.advanceTimersByTimeAsync(550);

      expect(handler.mock.calls.length).toBeLessThanOrEqual(3);
    });
  });

  describe('error isolation', () => {
    it('should catch handler errors and record them', async () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockRejectedValue(new Error('Plugin crashed'));
      const manifest = createManifest('bad-plugin', {
        permissions: { max_refresh_ms: 1000 },
      });
      scheduler.register('bad-plugin', manifest, handler);
      scheduler.start('bad-plugin');

      await vi.advanceTimersByTimeAsync(1000);

      const state = scheduler.getPluginState('bad-plugin');
      expect(state!.status).toBe('error');
      expect(state!.error).toContain('Plugin crashed');
    });

    it('should continue scheduling after handler error', async () => {
      scheduler = createPluginScheduler();
      let callCount = 0;
      const handler = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) throw new Error('First call fails');
      });
      const manifest = createManifest('flaky', {
        permissions: { max_refresh_ms: 1000 },
      });
      scheduler.register('flaky', manifest, handler);
      scheduler.start('flaky');

      // First call fails
      await vi.advanceTimersByTimeAsync(1000);
      expect(scheduler.getPluginState('flaky')!.status).toBe('error');

      // Second call succeeds
      await vi.advanceTimersByTimeAsync(1000);
      expect(handler).toHaveBeenCalledTimes(2);
      expect(scheduler.getPluginState('flaky')!.status).toBe('running');
    });

    it('should not let one plugin error affect others', async () => {
      scheduler = createPluginScheduler();
      const badHandler = vi.fn().mockRejectedValue(new Error('Crash'));
      const goodHandler = vi.fn().mockResolvedValue(undefined);
      scheduler.register(
        'bad',
        createManifest('bad', {
          permissions: { max_refresh_ms: 1000 },
        }),
        badHandler
      );
      scheduler.register(
        'good',
        createManifest('good', {
          permissions: { max_refresh_ms: 1000 },
        }),
        goodHandler
      );

      scheduler.startAll();
      await vi.advanceTimersByTimeAsync(1000);

      expect(badHandler).toHaveBeenCalledTimes(1);
      expect(goodHandler).toHaveBeenCalledTimes(1);
      expect(scheduler.getPluginState('bad')!.status).toBe('error');
      expect(scheduler.getPluginState('good')!.status).toBe('running');
    });
  });

  describe('state visibility', () => {
    it('should return state for a single plugin', () => {
      scheduler = createPluginScheduler();
      scheduler.register('clock', createManifest('clock'), vi.fn().mockResolvedValue(undefined));

      const state = scheduler.getPluginState('clock');
      expect(state).toMatchObject({
        pluginId: 'clock',
        status: 'stopped',
        runCount: 0,
      });
    });

    it('should return undefined for unknown plugin', () => {
      scheduler = createPluginScheduler();
      expect(scheduler.getPluginState('nonexistent')).toBeUndefined();
    });

    it('should return state for all plugins', () => {
      scheduler = createPluginScheduler();
      scheduler.register('clock', createManifest('clock'), vi.fn().mockResolvedValue(undefined));
      scheduler.register(
        'weather',
        createManifest('weather'),
        vi.fn().mockResolvedValue(undefined)
      );

      const state = scheduler.getState();
      expect(state.size).toBe(2);
      expect(state.has('clock')).toBe(true);
      expect(state.has('weather')).toBe(true);
    });

    it('should track lastRun timestamp after execution', async () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockResolvedValue(undefined);
      scheduler.register(
        'clock',
        createManifest('clock', {
          permissions: { max_refresh_ms: 1000 },
        }),
        handler
      );
      scheduler.start('clock');

      const beforeRun = Date.now();
      await vi.advanceTimersByTimeAsync(1000);

      const state = scheduler.getPluginState('clock');
      expect(state!.lastRun).toBeGreaterThanOrEqual(beforeRun);
    });

    it('should track runCount', async () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockResolvedValue(undefined);
      scheduler.register(
        'clock',
        createManifest('clock', {
          permissions: { max_refresh_ms: 1000 },
        }),
        handler
      );
      scheduler.start('clock');

      await vi.advanceTimersByTimeAsync(3000);

      const state = scheduler.getPluginState('clock');
      expect(state!.runCount).toBe(3);
    });
  });

  describe('close', () => {
    it('should stop all plugins and prevent further scheduling', async () => {
      scheduler = createPluginScheduler();
      const handler = vi.fn().mockResolvedValue(undefined);
      scheduler.register(
        'clock',
        createManifest('clock', {
          permissions: { max_refresh_ms: 1000 },
        }),
        handler
      );
      scheduler.start('clock');

      scheduler.close();

      await vi.advanceTimersByTimeAsync(5000);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should be safe to call close multiple times', () => {
      scheduler = createPluginScheduler();
      scheduler.close();
      expect(() => scheduler.close()).not.toThrow();
    });
  });
});
