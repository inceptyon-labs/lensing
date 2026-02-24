import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRestServer, type RestServerInstance, type RestServerHandlers } from '../rest-server';
import http from 'node:http';
import type { PluginAdminEntry, ZoneName } from '@lensing/types';

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

const MOCK_PLUGINS: PluginAdminEntry[] = [
  {
    plugin_id: 'weather',
    manifest: { id: 'weather', name: 'Weather', version: '1.0.0' },
    status: 'active',
    enabled: true,
    zone: 'center',
    config: { location: 'NYC', units: 'imperial' },
  },
  {
    plugin_id: 'clock',
    manifest: { id: 'clock', name: 'Clock', version: '1.0.0' },
    status: 'active',
    enabled: true,
    zone: 'top-bar',
    config: {},
  },
];

/** Create handlers with plugin callbacks for testing */
function createPluginHandlers(): RestServerHandlers {
  const plugins = structuredClone(MOCK_PLUGINS);

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
    getPlugins: async () => plugins,
    getPlugin: async (id: string) => plugins.find((p) => p.plugin_id === id),
    setPluginEnabled: vi.fn(async () => {}),
    updatePluginConfig: vi.fn(async () => {}),
    assignPluginZone: vi.fn(async () => {}),
    reloadPlugins: vi.fn(async () => {}),
  };
}

describe('RestServer Plugin Endpoints', () => {
  let server: RestServerInstance;
  let port: number;
  let handlers: RestServerHandlers;

  beforeEach(async () => {
    handlers = createPluginHandlers();
    server = createRestServer(handlers, { port: 0 });
    await server.ready();
    port = server.port;
  });

  afterEach(async () => {
    if (server) {
      await server.close();
    }
  });

  describe('GET /plugins', () => {
    it('should return all plugins', async () => {
      const res = await request(port, 'GET', '/plugins');
      expect(res.status).toBe(200);
      const body = JSON.parse(res.body) as PluginAdminEntry[];
      expect(body).toHaveLength(2);
      expect(body[0].plugin_id).toBe('weather');
      expect(body[1].plugin_id).toBe('clock');
    });
  });

  describe('GET /plugins/:id', () => {
    it('should return a single plugin by ID', async () => {
      const res = await request(port, 'GET', '/plugins/weather');
      expect(res.status).toBe(200);
      const body = JSON.parse(res.body) as PluginAdminEntry;
      expect(body.plugin_id).toBe('weather');
      expect(body.manifest.name).toBe('Weather');
    });

    it('should return 404 for unknown plugin ID', async () => {
      const res = await request(port, 'GET', '/plugins/nonexistent');
      expect(res.status).toBe(404);
      const body = JSON.parse(res.body) as { error: string };
      expect(body.error).toContain('not found');
    });
  });

  describe('PUT /plugins/:id/enabled', () => {
    it('should toggle plugin enabled state', async () => {
      const res = await request(port, 'PUT', '/plugins/weather/enabled', { enabled: false });
      expect(res.status).toBe(200);
      const body = JSON.parse(res.body) as { ok: boolean };
      expect(body.ok).toBe(true);
      expect(handlers.setPluginEnabled).toHaveBeenCalledWith('weather', false);
    });

    it('should return 400 for missing enabled field', async () => {
      const res = await request(port, 'PUT', '/plugins/weather/enabled', {});
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid JSON', async () => {
      const res = await request(port, 'PUT', '/plugins/weather/enabled', undefined);
      // Send raw invalid data
      const rawRes = await new Promise<{ status: number; body: string }>((resolve, reject) => {
        const req = http.request(
          {
            hostname: '127.0.0.1',
            port,
            method: 'PUT',
            path: '/plugins/weather/enabled',
            headers: { 'Content-Type': 'application/json', 'Content-Length': 7 },
          },
          (r) => {
            let body = '';
            r.on('data', (c: Buffer) => (body += c.toString()));
            r.on('end', () => resolve({ status: r.statusCode ?? 0, body }));
          }
        );
        req.on('error', reject);
        req.write('invalid');
        req.end();
      });
      expect(rawRes.status).toBe(400);
    });
  });

  describe('PUT /plugins/:id/config', () => {
    it('should update plugin config', async () => {
      const newConfig = { location: 'SF', units: 'metric' };
      const res = await request(port, 'PUT', '/plugins/weather/config', { config: newConfig });
      expect(res.status).toBe(200);
      expect(handlers.updatePluginConfig).toHaveBeenCalledWith('weather', newConfig);
    });

    it('should return 400 for missing config field', async () => {
      const res = await request(port, 'PUT', '/plugins/weather/config', {});
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /plugins/:id/zone', () => {
    it('should assign a zone to a plugin', async () => {
      const res = await request(port, 'PUT', '/plugins/weather/zone', { zone: 'left-col' });
      expect(res.status).toBe(200);
      expect(handlers.assignPluginZone).toHaveBeenCalledWith('weather', 'left-col');
    });

    it('should allow null to unassign zone', async () => {
      const res = await request(port, 'PUT', '/plugins/weather/zone', { zone: null });
      expect(res.status).toBe(200);
      expect(handlers.assignPluginZone).toHaveBeenCalledWith('weather', undefined);
    });
  });

  describe('POST /plugins/reload', () => {
    it('should trigger plugin reload', async () => {
      const res = await request(port, 'POST', '/plugins/reload');
      expect(res.status).toBe(200);
      const body = JSON.parse(res.body) as { ok: boolean };
      expect(body.ok).toBe(true);
      expect(handlers.reloadPlugins).toHaveBeenCalled();
    });
  });

  describe('backward compatibility', () => {
    it('should work without plugin handlers', async () => {
      await server.close();
      // Create a server with only the base handlers (no plugin callbacks)
      const baseHandlers: RestServerHandlers = {
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
      };
      server = createRestServer(baseHandlers, { port: 0 });
      await server.ready();
      port = server.port;

      // Plugin endpoints should return 404 when handlers are not provided
      const res = await request(port, 'GET', '/plugins');
      expect(res.status).toBe(404);
    });
  });
});
