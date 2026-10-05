import { describe, it, expect, afterEach } from 'vitest';
import { createRestServer, type RestServerInstance, type RestServerHandlers } from '../rest-server';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const AUTH_TOKEN = 'test-secret-token-abc123';

/** Helper to make HTTP requests with optional auth token */
function request(
  port: number,
  method: string,
  path: string,
  body?: unknown,
  token?: string,
  extraHeaders: Record<string, string> = {}
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
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...extraHeaders,
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

function createStubHandlers(): RestServerHandlers {
  return {
    getSettings: async () => ({ theme: 'dark', brightness: 80 }),
    putSettings: async () => {},
    getLayout: async () => [{ zone: 'center', columns: 2, rows: 1, plugins: ['clock'] }],
    putLayout: async () => {},
    postAsk: async (question: string) => ({
      id: 'conv-stub',
      question,
      response: 'Stub response',
      timestamp: new Date().toISOString(),
      tool_calls_made: 0,
    }),
  };
}

describe('RestServer auth integration', () => {
  let server: RestServerInstance;
  let port: number;

  afterEach(async () => {
    if (server) {
      await server.close();
    }
  });

  describe('when authToken is configured', () => {
    it('should return 401 for GET /settings without token', async () => {
      server = createRestServer(createStubHandlers(), {
        port: 0,
        authToken: AUTH_TOKEN,
        trustLoopback: false,
      });
      await server.ready();
      port = server.port;

      const res = await request(port, 'GET', '/settings');
      expect(res.status).toBe(401);
      expect(JSON.parse(res.body)).toEqual({ error: 'Unauthorized' });
    });

    it('should serve the app shell to non-loopback clients without a token', async () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lensing-static-'));
      fs.writeFileSync(path.join(dir, 'index.html'), '<html></html>');
      fs.mkdirSync(path.join(dir, '_app'));
      fs.writeFileSync(path.join(dir, '_app', 'app.js'), 'export {}');
      server = createRestServer(createStubHandlers(), {
        port: 0,
        authToken: AUTH_TOKEN,
        trustLoopback: false,
        staticDir: dir,
      });
      await server.ready();
      port = server.port;

      for (const p of ['/', '/admin', '/_app/app.js']) {
        expect((await request(port, 'GET', p)).status, p).toBe(200);
      }
    });

    it('should return 401 for PUT /settings without token', async () => {
      server = createRestServer(createStubHandlers(), {
        port: 0,
        authToken: AUTH_TOKEN,
        trustLoopback: false,
      });
      await server.ready();
      port = server.port;

      const res = await request(port, 'PUT', '/settings', { theme: 'light' });
      expect(res.status).toBe(401);
    });

    it('should return 401 for wrong token', async () => {
      server = createRestServer(createStubHandlers(), {
        port: 0,
        authToken: AUTH_TOKEN,
        trustLoopback: false,
      });
      await server.ready();
      port = server.port;

      const res = await request(port, 'GET', '/settings', undefined, 'wrong-token');
      expect(res.status).toBe(401);
    });

    it('should return 200 for GET /settings with valid token', async () => {
      server = createRestServer(createStubHandlers(), {
        port: 0,
        authToken: AUTH_TOKEN,
        trustLoopback: false,
      });
      await server.ready();
      port = server.port;

      const res = await request(port, 'GET', '/settings', undefined, AUTH_TOKEN);
      expect(res.status).toBe(200);
      expect(JSON.parse(res.body)).toEqual({ theme: 'dark', brightness: 80 });
    });

    it('should allow /health without token', async () => {
      server = createRestServer(createStubHandlers(), {
        port: 0,
        authToken: AUTH_TOKEN,
        trustLoopback: false,
      });
      await server.ready();
      port = server.port;

      const res = await request(port, 'GET', '/health');
      expect(res.status).toBe(200);
    });

    it('should allow OPTIONS without token (CORS preflight)', async () => {
      server = createRestServer(createStubHandlers(), {
        port: 0,
        authToken: AUTH_TOKEN,
        trustLoopback: false,
      });
      await server.ready();
      port = server.port;

      const res = await request(port, 'OPTIONS', '/settings');
      expect(res.status).toBe(204);
    });

    it('should allow OPTIONS on protected routes without token', async () => {
      server = createRestServer(createStubHandlers(), {
        port: 0,
        authToken: AUTH_TOKEN,
        trustLoopback: false,
      });
      await server.ready();
      port = server.port;

      // OPTIONS should work on /settings even though GET /settings requires auth
      const res = await request(port, 'OPTIONS', '/settings');
      expect(res.status).toBe(204);
    });

    it('should return 401 for POST /ask without token', async () => {
      server = createRestServer(createStubHandlers(), {
        port: 0,
        authToken: AUTH_TOKEN,
        trustLoopback: false,
      });
      await server.ready();
      port = server.port;

      const res = await request(port, 'POST', '/ask', { question: 'hello' });
      expect(res.status).toBe(401);
    });

    it('should return 200 for POST /ask with valid token', async () => {
      server = createRestServer(createStubHandlers(), {
        port: 0,
        authToken: AUTH_TOKEN,
        trustLoopback: false,
      });
      await server.ready();
      port = server.port;

      const res = await request(port, 'POST', '/ask', { question: 'hello' }, AUTH_TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('loopback, Host and Origin checks', () => {
    it('should skip auth for loopback clients by default', async () => {
      server = createRestServer(createStubHandlers(), { port: 0, authToken: AUTH_TOKEN });
      await server.ready();

      const res = await request(server.port, 'PUT', '/settings', { theme: 'light' });
      expect(res.status).toBe(200);
    });

    it('should keep GET /data-bus public for non-loopback clients', async () => {
      server = createRestServer(
        { ...createStubHandlers(), getDataBusSnapshot: async () => [] },
        { port: 0, authToken: AUTH_TOKEN, trustLoopback: false }
      );
      await server.ready();

      const res = await request(server.port, 'GET', '/data-bus');
      expect(res.status).toBe(200);
    });

    it('should reject a public Host header with 403 (DNS rebinding)', async () => {
      server = createRestServer(createStubHandlers(), { port: 0 });
      await server.ready();

      const res = await request(server.port, 'GET', '/health', undefined, undefined, {
        Host: 'evil.example.com',
      });
      expect(res.status).toBe(403);
      expect(JSON.parse(res.body)).toEqual({ error: 'Host not allowed' });
    });

    it('should allow a public Host header listed in allowedHosts', async () => {
      server = createRestServer(createStubHandlers(), {
        port: 0,
        allowedHosts: ['dash.example.com'],
      });
      await server.ready();

      const res = await request(server.port, 'GET', '/health', undefined, undefined, {
        Host: 'dash.example.com',
      });
      expect(res.status).toBe(200);
    });

    it('should reject a cross-origin write with 403', async () => {
      server = createRestServer(createStubHandlers(), { port: 0 });
      await server.ready();

      const res = await request(server.port, 'PUT', '/settings', { a: 1 }, undefined, {
        Origin: 'http://evil.example.com',
      });
      expect(res.status).toBe(403);
    });

    it('should allow a same-origin write and cross-origin GET', async () => {
      server = createRestServer(createStubHandlers(), { port: 0 });
      await server.ready();
      const host = `127.0.0.1:${server.port}`;

      const put = await request(server.port, 'PUT', '/settings', { a: 1 }, undefined, {
        Origin: `http://${host}`,
      });
      expect(put.status).toBe(200);
      const get = await request(server.port, 'GET', '/health', undefined, undefined, {
        Origin: 'http://evil.example.com',
      });
      expect(get.status).toBe(200);
    });
  });

  describe('when authToken is not configured', () => {
    it('should allow all requests without auth', async () => {
      server = createRestServer(createStubHandlers(), { port: 0 });
      await server.ready();
      port = server.port;

      const res = await request(port, 'GET', '/settings');
      expect(res.status).toBe(200);
    });
  });

  describe('bind address', () => {
    it('should accept bindAddress option', async () => {
      server = createRestServer(createStubHandlers(), {
        port: 0,
        bindAddress: '127.0.0.1',
      });
      await server.ready();
      port = server.port;

      const res = await request(port, 'GET', '/health');
      expect(res.status).toBe(200);
    });

    it('should default bind to 127.0.0.1', async () => {
      server = createRestServer(createStubHandlers(), { port: 0 });
      await server.ready();

      const addr = server.server.address();
      expect(typeof addr).toBe('object');
      if (typeof addr === 'object' && addr) {
        expect(addr.address).toBe('127.0.0.1');
      }
    });
  });
});
