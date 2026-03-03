/**
 * End-to-end integration tests for the plugin connector data flow:
 * plugin load → connector register → fetch → DataBus publish
 *
 * Uses real PluginLoader + ConnectorRunner + DataBus with a mock scheduler
 * to verify the full pipeline without timers.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPluginLoader } from '../plugin-loader';
import { createConnectorRunner } from '../connector-runner';
import type { ConnectorRunnerConfig } from '../connector-runner';
import type { PluginManifest, DataBusInstance } from '@lensing/types';
import type { PluginSchedulerInstance } from '../plugin-scheduler';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_PLUGINS_DIR = path.join(__dirname, 'temp-integration-plugins');

/** Stub scheduler that captures handlers so we can trigger them manually. */
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
    start: vi.fn((id: string) => { started.add(id); }),
    stop: vi.fn((id: string) => { started.delete(id); }),
    restart: vi.fn(),
    startAll: vi.fn(),
    stopAll: vi.fn(),
    getState: vi.fn(() => new Map()),
    getPluginState: vi.fn(),
    close: vi.fn(),
  };
}

/** Stub DataBus that records publishes. */
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

function createPlugin(id: string, connector: ConnectorRunnerConfig) {
  const dir = path.join(TEMP_PLUGINS_DIR, id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'plugin.json'),
    JSON.stringify({ id, name: `${id} Widget`, version: '1.0.0' })
  );
  fs.writeFileSync(path.join(dir, 'connector.json'), JSON.stringify(connector));
}

describe('Plugin Connector Integration (end-to-end)', () => {
  let scheduler: ReturnType<typeof stubScheduler>;
  let dataBus: ReturnType<typeof stubDataBus>;
  let mockFetchFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    if (!fs.existsSync(TEMP_PLUGINS_DIR)) {
      fs.mkdirSync(TEMP_PLUGINS_DIR, { recursive: true });
    }
    scheduler = stubScheduler();
    dataBus = stubDataBus();
    mockFetchFn = vi.fn();
  });

  afterEach(() => {
    if (fs.existsSync(TEMP_PLUGINS_DIR)) {
      fs.rmSync(TEMP_PLUGINS_DIR, { recursive: true, force: true });
    }
  });

  it('json_api: plugin load → fetch → DataBus publish', async () => {
    createPlugin('stock-ticker', {
      type: 'json_api',
      url: 'https://api.example.com/stocks',
      method: 'GET',
      refreshInterval: 60,
    });

    const runner = createConnectorRunner({
      dataBus,
      scheduler,
      fetchFn: mockFetchFn,
    });

    const loader = createPluginLoader({
      pluginsDir: TEMP_PLUGINS_DIR,
      connectorRunner: runner,
    });
    await loader.load();

    // Verify scheduler received the registration
    expect(scheduler.register).toHaveBeenCalledOnce();
    expect(scheduler._started.has('stock-ticker')).toBe(true);

    // Simulate a fetch by invoking the handler
    mockFetchFn.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ price: 150.50, symbol: 'AAPL' }),
    });

    const handler = scheduler._handlers.get('stock-ticker');
    expect(handler).toBeDefined();
    await handler!();

    // Verify data was published to the DataBus
    expect(dataBus.publish).toHaveBeenCalledWith(
      'plugin:stock-ticker',
      'stock-ticker',
      { price: 150.50, symbol: 'AAPL' }
    );
  });

  it('rss_feed: plugin load → fetch → DataBus publish with raw text', async () => {
    createPlugin('news-feed', {
      type: 'rss_feed',
      url: 'https://example.com/feed.xml',
      refreshInterval: 1800,
    });

    const runner = createConnectorRunner({
      dataBus,
      scheduler,
      fetchFn: mockFetchFn,
    });

    const loader = createPluginLoader({
      pluginsDir: TEMP_PLUGINS_DIR,
      connectorRunner: runner,
    });
    await loader.load();

    const rssXml = '<rss><channel><item><title>Hello</title></item></channel></rss>';
    mockFetchFn.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => rssXml,
    });

    const handler = scheduler._handlers.get('news-feed');
    expect(handler).toBeDefined();
    await handler!();

    expect(dataBus.publish).toHaveBeenCalledWith(
      'plugin:news-feed',
      'news-feed',
      { raw: rssXml }
    );
  });

  it('static connector: publishes data immediately on register (no scheduler)', async () => {
    createPlugin('static-info', {
      type: 'static',
      url: '',
      data: { message: 'Hello World', count: 42 },
    });

    const runner = createConnectorRunner({
      dataBus,
      scheduler,
      fetchFn: mockFetchFn,
    });

    const loader = createPluginLoader({
      pluginsDir: TEMP_PLUGINS_DIR,
      connectorRunner: runner,
    });
    await loader.load();

    // Static connectors publish immediately — no scheduler involvement
    expect(scheduler.register).not.toHaveBeenCalled();
    expect(dataBus.publish).toHaveBeenCalledWith(
      'plugin:static-info',
      'static-info',
      { message: 'Hello World', count: 42 }
    );
  });

  it('SSRF protection: blocks private IPs', async () => {
    createPlugin('bad-plugin', {
      type: 'json_api',
      url: 'http://192.168.1.1/admin',
      refreshInterval: 60,
    });

    const runner = createConnectorRunner({
      dataBus,
      scheduler,
      fetchFn: mockFetchFn,
      allowPrivate: false,
    });

    const loader = createPluginLoader({
      pluginsDir: TEMP_PLUGINS_DIR,
      connectorRunner: runner,
    });
    await loader.load();

    // The handler should throw when invoked due to SSRF block
    const handler = scheduler._handlers.get('bad-plugin');
    expect(handler).toBeDefined();

    await expect(handler!()).rejects.toThrow(/URL blocked/);
    expect(mockFetchFn).not.toHaveBeenCalled();
  });

  it('unload removes connector from scheduler', async () => {
    createPlugin('temp-widget', {
      type: 'json_api',
      url: 'https://api.example.com/data',
      refreshInterval: 60,
    });

    const runner = createConnectorRunner({
      dataBus,
      scheduler,
      fetchFn: mockFetchFn,
    });

    const loader = createPluginLoader({
      pluginsDir: TEMP_PLUGINS_DIR,
      connectorRunner: runner,
    });
    await loader.load();

    expect(scheduler._started.has('temp-widget')).toBe(true);

    await loader.unload('temp-widget');

    expect(scheduler.unregister).toHaveBeenCalledWith('temp-widget');
  });

  it('multiple plugins load and register independently', async () => {
    createPlugin('widget-a', {
      type: 'json_api',
      url: 'https://a.example.com/data',
      refreshInterval: 60,
    });
    createPlugin('widget-b', {
      type: 'rss_feed',
      url: 'https://b.example.com/feed.xml',
      refreshInterval: 1800,
    });

    const runner = createConnectorRunner({
      dataBus,
      scheduler,
      fetchFn: mockFetchFn,
    });

    const loader = createPluginLoader({
      pluginsDir: TEMP_PLUGINS_DIR,
      connectorRunner: runner,
    });
    await loader.load();

    expect(scheduler.register).toHaveBeenCalledTimes(2);
    expect(scheduler._started.has('widget-a')).toBe(true);
    expect(scheduler._started.has('widget-b')).toBe(true);
  });

  it('json_api passes custom headers to fetch', async () => {
    createPlugin('auth-widget', {
      type: 'json_api',
      url: 'https://api.example.com/data',
      method: 'POST',
      headers: { 'Authorization': 'Bearer test-token', 'X-Custom': 'value' },
      refreshInterval: 60,
    });

    const runner = createConnectorRunner({
      dataBus,
      scheduler,
      fetchFn: mockFetchFn,
    });

    const loader = createPluginLoader({
      pluginsDir: TEMP_PLUGINS_DIR,
      connectorRunner: runner,
    });
    await loader.load();

    mockFetchFn.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ data: 'secure' }),
    });

    const handler = scheduler._handlers.get('auth-widget');
    await handler!();

    expect(mockFetchFn).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Authorization': 'Bearer test-token', 'X-Custom': 'value' },
      })
    );
  });
});
