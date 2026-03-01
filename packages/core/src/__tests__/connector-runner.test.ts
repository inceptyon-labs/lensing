import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createConnectorRunner } from '../connector-runner';
import type { ConnectorRunnerConfig, ConnectorRunnerInstance } from '../connector-runner';
import type { PluginManifest, DataBusInstance } from '@lensing/types';
import type { PluginSchedulerInstance } from '../plugin-scheduler';

function stubManifest(overrides: Partial<PluginManifest> = {}): PluginManifest {
  return {
    id: 'test-plugin',
    name: 'Test Plugin',
    version: '1.0.0',
    permissions: { allowed_domains: ['api.example.com'], max_refresh_ms: 30_000 },
    ...overrides,
  };
}

function jsonApiConfig(overrides: Partial<ConnectorRunnerConfig> = {}): ConnectorRunnerConfig {
  return {
    type: 'json_api',
    url: 'https://api.example.com/data',
    method: 'GET',
    refreshInterval: 60,
    ...overrides,
  };
}

function stubScheduler(): PluginSchedulerInstance & {
  _handlers: Map<string, () => Promise<void>>;
  _started: Set<string>;
} {
  const handlers = new Map<string, () => Promise<void>>();
  const started = new Set<string>();
  return {
    _handlers: handlers,
    _started: started,
    register: vi.fn((id: string, _manifest: PluginManifest, handler: () => Promise<void>) => {
      handlers.set(id, handler);
    }),
    unregister: vi.fn((id: string) => {
      handlers.delete(id);
      started.delete(id);
    }),
    start: vi.fn((id: string) => {
      started.add(id);
    }),
    stop: vi.fn((id: string) => {
      started.delete(id);
    }),
    restart: vi.fn(),
    startAll: vi.fn(),
    stopAll: vi.fn(),
    getState: vi.fn(() => new Map()),
    getPluginState: vi.fn(),
    close: vi.fn(),
  };
}

function stubDataBus(): DataBusInstance & {
  _published: Array<{ channel: string; pluginId: string; data: unknown }>;
} {
  const published: Array<{ channel: string; pluginId: string; data: unknown }> = [];
  return {
    _published: published,
    publish: vi.fn((channel: string, pluginId: string, data: unknown) => {
      published.push({ channel, pluginId, data });
    }),
    subscribe: vi.fn(() => () => {}),
    getLatest: vi.fn(),
    getChannels: vi.fn(() => []),
    onMessage: vi.fn(() => () => {}),
    clear: vi.fn(),
    close: vi.fn(),
  };
}

function okJsonResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => data,
    text: async () => JSON.stringify(data),
  };
}

function okTextResponse(text: string) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => {
      throw new Error('Not JSON');
    },
    text: async () => text,
  };
}

describe('createConnectorRunner', () => {
  let scheduler: ReturnType<typeof stubScheduler>;
  let dataBus: ReturnType<typeof stubDataBus>;
  let fetchFn: ReturnType<typeof vi.fn>;
  let runner: ConnectorRunnerInstance;

  beforeEach(() => {
    scheduler = stubScheduler();
    dataBus = stubDataBus();
    fetchFn = vi.fn();
    runner = createConnectorRunner({ dataBus, scheduler, fetchFn });
  });

  describe('register', () => {
    it('registers plugin with scheduler using refreshInterval * 1000', () => {
      runner.register('weather', stubManifest(), jsonApiConfig({ refreshInterval: 30 }));

      expect(scheduler.register).toHaveBeenCalledWith(
        'weather',
        expect.any(Object),
        expect.any(Function),
        30_000
      );
    });

    it('auto-starts the plugin after registration', () => {
      runner.register('weather', stubManifest(), jsonApiConfig());

      expect(scheduler.start).toHaveBeenCalledWith('weather');
    });

    it('passes manifest to scheduler.register', () => {
      const manifest = stubManifest({ id: 'my-plugin' });
      runner.register('my-plugin', manifest, jsonApiConfig());

      expect(scheduler.register).toHaveBeenCalledWith(
        'my-plugin',
        manifest,
        expect.any(Function),
        expect.any(Number)
      );
    });
  });

  describe('json_api handler', () => {
    it('fetches URL and publishes JSON data to data bus', async () => {
      const apiData = { temperature: 72, humidity: 45 };
      fetchFn.mockResolvedValueOnce(okJsonResponse(apiData));

      runner.register('weather', stubManifest(), jsonApiConfig());

      const handler = scheduler._handlers.get('weather')!;
      await handler();

      expect(fetchFn).toHaveBeenCalledWith(
        'https://api.example.com/data',
        expect.objectContaining({ method: 'GET' })
      );
      expect(dataBus._published).toHaveLength(1);
      expect(dataBus._published[0].channel).toBe('plugin:weather');
      expect(dataBus._published[0].pluginId).toBe('weather');
      expect(dataBus._published[0].data).toEqual(apiData);
    });

    it('uses configured method and headers', async () => {
      fetchFn.mockResolvedValueOnce(okJsonResponse({}));

      runner.register(
        'test',
        stubManifest(),
        jsonApiConfig({
          method: 'POST',
          headers: { Authorization: 'Bearer token123' },
        })
      );

      const handler = scheduler._handlers.get('test')!;
      await handler();

      expect(fetchFn).toHaveBeenCalledWith(
        'https://api.example.com/data',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ Authorization: 'Bearer token123' }),
        })
      );
    });

    it('throws on HTTP error', async () => {
      fetchFn.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({}),
        text: async () => '',
      });

      runner.register('test', stubManifest(), jsonApiConfig());

      const handler = scheduler._handlers.get('test')!;
      await expect(handler()).rejects.toThrow(/500/);
    });
  });

  describe('rss_feed handler', () => {
    it('fetches URL and publishes text to data bus', async () => {
      const rssXml = '<rss><channel><title>News</title></channel></rss>';
      fetchFn.mockResolvedValueOnce(okTextResponse(rssXml));

      runner.register(
        'news',
        stubManifest(),
        jsonApiConfig({ type: 'rss_feed', url: 'https://feeds.example.com/rss' })
      );

      const handler = scheduler._handlers.get('news')!;
      await handler();

      expect(dataBus._published).toHaveLength(1);
      expect(dataBus._published[0].channel).toBe('plugin:news');
      expect(dataBus._published[0].data).toHaveProperty('raw');
    });
  });

  describe('static handler', () => {
    it('publishes static data immediately without scheduler', () => {
      runner.register('static-widget', stubManifest(), {
        type: 'static',
        url: '',
        data: { title: 'Hello', message: 'World' },
      } as ConnectorRunnerConfig & { data: Record<string, unknown> });

      expect(dataBus._published).toHaveLength(1);
      expect(dataBus._published[0].channel).toBe('plugin:static-widget');
      expect(dataBus._published[0].data).toEqual({ title: 'Hello', message: 'World' });
      // Should NOT register with scheduler
      expect(scheduler.register).not.toHaveBeenCalled();
    });
  });

  describe('SSRF protection', () => {
    it('blocks private URLs in handler', async () => {
      runner.register('evil', stubManifest(), jsonApiConfig({ url: 'http://192.168.1.1/admin' }));

      const handler = scheduler._handlers.get('evil')!;
      await expect(handler()).rejects.toThrow(/blocked|private/i);
      expect(dataBus._published).toHaveLength(0);
    });

    it('blocks localhost in handler', async () => {
      runner.register(
        'evil',
        stubManifest(),
        jsonApiConfig({ url: 'http://localhost:3000/secret' })
      );

      const handler = scheduler._handlers.get('evil')!;
      await expect(handler()).rejects.toThrow(/blocked|localhost/i);
    });

    it('allows private URLs when allowPrivate is true', async () => {
      const privateRunner = createConnectorRunner({
        dataBus,
        scheduler,
        fetchFn,
        allowPrivate: true,
      });

      fetchFn.mockResolvedValueOnce(okJsonResponse({ ok: true }));

      privateRunner.register(
        'homelab',
        stubManifest(),
        jsonApiConfig({ url: 'http://192.168.1.100/api' })
      );

      const handler = scheduler._handlers.get('homelab')!;
      await handler(); // Should not throw

      expect(dataBus._published).toHaveLength(1);
    });
  });

  describe('unregister', () => {
    it('stops and unregisters from scheduler', () => {
      runner.register('weather', stubManifest(), jsonApiConfig());
      runner.unregister('weather');

      expect(scheduler.stop).toHaveBeenCalledWith('weather');
      expect(scheduler.unregister).toHaveBeenCalledWith('weather');
    });

    it('is safe to call for non-registered plugin', () => {
      expect(() => runner.unregister('nonexistent')).not.toThrow();
    });
  });

  describe('close', () => {
    it('stops and unregisters all plugins', () => {
      runner.register('p1', stubManifest({ id: 'p1' }), jsonApiConfig());
      runner.register('p2', stubManifest({ id: 'p2' }), jsonApiConfig());

      runner.close();

      expect(scheduler.stop).toHaveBeenCalledWith('p1');
      expect(scheduler.stop).toHaveBeenCalledWith('p2');
      expect(scheduler.unregister).toHaveBeenCalledWith('p1');
      expect(scheduler.unregister).toHaveBeenCalledWith('p2');
    });

    it('handles close when no plugins registered', () => {
      expect(() => runner.close()).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('propagates network errors from fetch', async () => {
      fetchFn.mockRejectedValueOnce(new Error('ECONNREFUSED'));

      runner.register('test', stubManifest(), jsonApiConfig());

      const handler = scheduler._handlers.get('test')!;
      await expect(handler()).rejects.toThrow('ECONNREFUSED');
    });

    it('does not publish to data bus on error', async () => {
      fetchFn.mockRejectedValueOnce(new Error('Network failure'));

      runner.register('test', stubManifest(), jsonApiConfig());

      const handler = scheduler._handlers.get('test')!;
      try {
        await handler();
      } catch {
        // Expected
      }

      expect(dataBus._published).toHaveLength(0);
    });
  });
});
