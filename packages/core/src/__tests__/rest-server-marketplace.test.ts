import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createRestServer, type RestServerInstance, type RestServerHandlers } from '../rest-server';
import type { MarketplacePlugin, MarketplaceCategory, MarketplaceListResponse } from '@lensing/types';
import http from 'node:http';

/** Helper to make HTTP requests to the test server */
function request(
  port: number,
  method: string,
  path: string,
  body?: unknown
): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const data = body !== undefined ? JSON.stringify(body) : undefined;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        method,
        path,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk: Buffer) => {
          responseBody += chunk.toString();
        });
        res.on('end', () => {
          resolve({
            status: res.statusCode ?? 0,
            headers: res.headers,
            body: responseBody,
          });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

/** Sample marketplace plugins for testing */
const SAMPLE_PLUGINS: MarketplacePlugin[] = [
  {
    id: 'weather-pro',
    name: 'Weather Pro',
    description: 'Advanced weather display with radar',
    version: '2.1.0',
    author: 'lensing-community',
    category: 'weather',
    tags: ['weather', 'radar', 'forecast'],
    downloadUrl: 'https://marketplace.example.com/weather-pro-2.1.0.zip',
    installed: false,
    updateAvailable: false,
  },
  {
    id: 'crypto-ticker',
    name: 'Crypto Ticker',
    description: 'Real-time cryptocurrency prices',
    version: '1.0.3',
    author: 'crypto-dev',
    category: 'finance',
    tags: ['crypto', 'bitcoin', 'finance'],
    downloadUrl: 'https://marketplace.example.com/crypto-ticker-1.0.3.zip',
    installed: true,
    updateAvailable: false,
  },
  {
    id: 'news-feed',
    name: 'News Feed',
    description: 'RSS news aggregator widget',
    version: '1.2.0',
    author: 'lensing-community',
    category: 'news',
    tags: ['news', 'rss', 'feed'],
    downloadUrl: 'https://marketplace.example.com/news-feed-1.2.0.zip',
    installed: true,
    updateAvailable: true,
  },
];

const SAMPLE_CATEGORIES: MarketplaceCategory[] = [
  { name: 'weather', count: 1 },
  { name: 'finance', count: 1 },
  { name: 'news', count: 1 },
];

/** Create stub handlers with marketplace support */
function createStubHandlers(
  overrides?: Partial<RestServerHandlers>
): RestServerHandlers {
  return {
    getSettings: async () => ({}),
    putSettings: async () => {},
    getLayout: async () => [],
    putLayout: async () => {},
    postAsk: async (q: string) => ({
      id: 'stub',
      question: q,
      response: 'stub',
      timestamp: new Date().toISOString(),
      tool_calls_made: 0,
    }),
    ...overrides,
  };
}

describe('Marketplace REST Endpoints', () => {
  let server: RestServerInstance;
  let port: number;

  afterEach(async () => {
    if (server) {
      await server.close();
    }
  });

  describe('GET /marketplace', () => {
    beforeEach(async () => {
      server = createRestServer(
        createStubHandlers({
          getMarketplacePlugins: async () => ({
            plugins: SAMPLE_PLUGINS,
            total: SAMPLE_PLUGINS.length,
            page: 1,
            pageSize: 20,
            offline: false,
          }),
        })
      );
      await server.ready();
      port = server.port;
    });

    it('should return plugin list with pagination metadata', async () => {
      const res = await request(port, 'GET', '/marketplace');
      expect(res.status).toBe(200);
      const body = JSON.parse(res.body) as MarketplaceListResponse;
      expect(body.plugins).toHaveLength(3);
      expect(body.total).toBe(3);
      expect(body.page).toBe(1);
      expect(body.pageSize).toBe(20);
      expect(body.offline).toBe(false);
    });

    it('should return 404 when handler not configured', async () => {
      await server.close();
      server = createRestServer(createStubHandlers());
      await server.ready();
      port = server.port;

      const res = await request(port, 'GET', '/marketplace');
      expect(res.status).toBe(404);
    });

    it('should pass query params to handler', async () => {
      let receivedParams: Record<string, string> = {};
      await server.close();
      server = createRestServer(
        createStubHandlers({
          getMarketplacePlugins: async (params) => {
            receivedParams = params ?? {};
            return {
              plugins: [],
              total: 0,
              page: 1,
              pageSize: 20,
              offline: false,
            };
          },
        })
      );
      await server.ready();
      port = server.port;

      await request(port, 'GET', '/marketplace?category=weather&search=pro&page=2');
      expect(receivedParams).toEqual({
        category: 'weather',
        search: 'pro',
        page: '2',
      });
    });
  });

  describe('GET /marketplace/categories', () => {
    beforeEach(async () => {
      server = createRestServer(
        createStubHandlers({
          getMarketplaceCategories: async () => SAMPLE_CATEGORIES,
        })
      );
      await server.ready();
      port = server.port;
    });

    it('should return category list with counts', async () => {
      const res = await request(port, 'GET', '/marketplace/categories');
      expect(res.status).toBe(200);
      const body = JSON.parse(res.body) as MarketplaceCategory[];
      expect(body).toHaveLength(3);
      expect(body[0]).toEqual({ name: 'weather', count: 1 });
    });

    it('should return 404 when handler not configured', async () => {
      await server.close();
      server = createRestServer(createStubHandlers());
      await server.ready();
      port = server.port;

      const res = await request(port, 'GET', '/marketplace/categories');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /marketplace/:id', () => {
    beforeEach(async () => {
      server = createRestServer(
        createStubHandlers({
          getMarketplacePlugin: async (id) =>
            SAMPLE_PLUGINS.find((p) => p.id === id),
        })
      );
      await server.ready();
      port = server.port;
    });

    it('should return a single plugin by ID', async () => {
      const res = await request(port, 'GET', '/marketplace/weather-pro');
      expect(res.status).toBe(200);
      const body = JSON.parse(res.body) as MarketplacePlugin;
      expect(body.id).toBe('weather-pro');
      expect(body.name).toBe('Weather Pro');
      expect(body.installed).toBe(false);
      expect(body.updateAvailable).toBe(false);
    });

    it('should return 404 for unknown plugin ID', async () => {
      const res = await request(port, 'GET', '/marketplace/nonexistent');
      expect(res.status).toBe(404);
    });

    it('should return 404 when handler not configured', async () => {
      await server.close();
      server = createRestServer(createStubHandlers());
      await server.ready();
      port = server.port;

      const res = await request(port, 'GET', '/marketplace/weather-pro');
      expect(res.status).toBe(404);
    });

    it('should include installed and updateAvailable flags', async () => {
      const res = await request(port, 'GET', '/marketplace/news-feed');
      expect(res.status).toBe(200);
      const body = JSON.parse(res.body) as MarketplacePlugin;
      expect(body.installed).toBe(true);
      expect(body.updateAvailable).toBe(true);
    });
  });
});

describe('MarketplacePlugin type', () => {
  it('should have all required fields', () => {
    const plugin: MarketplacePlugin = {
      id: 'test',
      name: 'Test',
      description: 'A test plugin',
      version: '1.0.0',
      author: 'author',
      category: 'general',
      tags: ['test'],
      downloadUrl: 'https://example.com/test.zip',
      installed: false,
      updateAvailable: false,
    };
    expect(plugin.id).toBe('test');
    expect(plugin.installed).toBe(false);
    expect(plugin.updateAvailable).toBe(false);
  });
});

describe('MarketplaceCategory type', () => {
  it('should have name and count', () => {
    const cat: MarketplaceCategory = { name: 'weather', count: 5 };
    expect(cat.name).toBe('weather');
    expect(cat.count).toBe(5);
  });
});

describe('MarketplaceListResponse type', () => {
  it('should have plugins array, pagination, and offline flag', () => {
    const resp: MarketplaceListResponse = {
      plugins: [],
      total: 0,
      page: 1,
      pageSize: 20,
      offline: false,
    };
    expect(resp.plugins).toEqual([]);
    expect(resp.offline).toBe(false);
    expect(resp.total).toBe(0);
    expect(resp.page).toBe(1);
    expect(resp.pageSize).toBe(20);
  });
});
