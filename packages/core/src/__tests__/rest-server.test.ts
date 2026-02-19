import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createRestServer, type RestServerInstance, type RestServerHandlers } from '../rest-server';
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

/** Create stub handlers for testing */
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

describe('RestServer', () => {
  let server: RestServerInstance;
  let port: number;

  afterEach(async () => {
    if (server) {
      await server.close();
    }
  });

  describe('createRestServer', () => {
    it('should create a server and be ready', async () => {
      server = createRestServer(createStubHandlers());
      await server.ready();
      expect(server.port).toBeGreaterThan(0);
    });

    it('should listen on specified port', async () => {
      server = createRestServer(createStubHandlers(), { port: 0 });
      await server.ready();
      expect(server.port).toBeGreaterThan(0);
    });

    it('should close cleanly', async () => {
      server = createRestServer(createStubHandlers());
      await server.ready();
      await server.close();
      // Should not throw when closing again
      await server.close();
    });
  });

  describe('GET /health', () => {
    beforeEach(async () => {
      server = createRestServer(createStubHandlers(), { port: 0 });
      await server.ready();
      port = server.port;
    });

    it('should return 200 with status ok', async () => {
      const res = await request(port, 'GET', '/health');
      expect(res.status).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.status).toBe('ok');
    });

    it('should include uptime in response', async () => {
      const res = await request(port, 'GET', '/health');
      const body = JSON.parse(res.body);
      expect(typeof body.uptime).toBe('number');
      expect(body.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should return JSON content-type', async () => {
      const res = await request(port, 'GET', '/health');
      expect(res.headers['content-type']).toContain('application/json');
    });
  });

  describe('CORS', () => {
    beforeEach(async () => {
      server = createRestServer(createStubHandlers(), {
        port: 0,
        corsOrigins: ['http://localhost:3000'],
      });
      await server.ready();
      port = server.port;
    });

    it('should include CORS headers in responses', async () => {
      const res = await request(port, 'GET', '/health');
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });

    it('should handle OPTIONS preflight requests', async () => {
      const res = await request(port, 'OPTIONS', '/health');
      expect(res.status).toBe(204);
      expect(res.headers['access-control-allow-methods']).toContain('GET');
      expect(res.headers['access-control-allow-methods']).toContain('PUT');
      expect(res.headers['access-control-allow-headers']).toContain('Content-Type');
    });

    it('should use wildcard when no origins specified', async () => {
      await server.close();
      server = createRestServer(createStubHandlers(), { port: 0 });
      await server.ready();
      port = server.port;
      const res = await request(port, 'GET', '/health');
      expect(res.headers['access-control-allow-origin']).toBe('*');
    });
  });

  describe('structured logging', () => {
    it('should accept a custom logger', async () => {
      const logs: string[] = [];
      server = createRestServer(createStubHandlers(), {
        port: 0,
        logger: (entry) => logs.push(JSON.stringify(entry)),
      });
      await server.ready();
      port = server.port;
      await request(port, 'GET', '/health');
      expect(logs.length).toBeGreaterThan(0);
      const logEntry = JSON.parse(logs[0]);
      expect(logEntry.method).toBe('GET');
      expect(logEntry.path).toBe('/health');
      expect(logEntry.status).toBe(200);
      expect(typeof logEntry.duration_ms).toBe('number');
    });
  });

  describe('404 handling', () => {
    beforeEach(async () => {
      server = createRestServer(createStubHandlers(), { port: 0 });
      await server.ready();
      port = server.port;
    });

    it('should return 404 for unknown paths', async () => {
      const res = await request(port, 'GET', '/unknown');
      expect(res.status).toBe(404);
      const body = JSON.parse(res.body);
      expect(body.error).toBe('Not Found');
    });

    it('should return 405 for wrong method on known path', async () => {
      const res = await request(port, 'DELETE', '/health');
      expect(res.status).toBe(405);
      const body = JSON.parse(res.body);
      expect(body.error).toBe('Method Not Allowed');
    });
  });
});
