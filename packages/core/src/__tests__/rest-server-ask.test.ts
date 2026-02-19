import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRestServer, type RestServerInstance, type RestServerHandlers } from '../rest-server';
import http from 'node:http';
import type { AgentTaskResult } from '@lensing/types';

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

function createStubHandlers(): RestServerHandlers {
  return {
    getSettings: async () => ({ theme: 'dark' }),
    putSettings: async () => {},
    getLayout: async () => [],
    putLayout: async () => {},
    postAsk: async (question: string) => ({
      id: 'conv-1',
      question,
      response: `Answer to: ${question}`,
      timestamp: '2026-02-19T12:00:00Z',
      tool_calls_made: 0,
    }),
  };
}

describe('REST POST /ask', () => {
  let server: RestServerInstance;
  let port: number;

  afterEach(async () => {
    if (server) {
      await server.close();
    }
  });

  describe('POST /ask', () => {
    beforeEach(async () => {
      server = createRestServer(createStubHandlers(), { port: 0 });
      await server.ready();
      port = server.port;
    });

    it('should accept a question and return a response', async () => {
      const res = await request(port, 'POST', '/ask', { question: 'What is the weather?' });
      expect(res.status).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.question).toBe('What is the weather?');
      expect(body.response).toContain('Answer to');
      expect(body.id).toBeDefined();
      expect(body.timestamp).toBeDefined();
    });

    it('should return 400 for missing question', async () => {
      const res = await request(port, 'POST', '/ask', {});
      expect(res.status).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.error).toBeDefined();
    });

    it('should return 400 for empty question', async () => {
      const res = await request(port, 'POST', '/ask', { question: '' });
      expect(res.status).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.error).toBeDefined();
    });

    it('should return 400 for invalid JSON', async () => {
      const res = await request(port, 'POST', '/ask', undefined);
      // Send raw string instead of JSON
      const rawRes = await new Promise<{ status: number; body: string }>((resolve, reject) => {
        const req = http.request(
          {
            hostname: '127.0.0.1',
            port,
            method: 'POST',
            path: '/ask',
            headers: { 'Content-Type': 'application/json', 'Content-Length': 7 },
          },
          (res) => {
            let body = '';
            res.on('data', (chunk: Buffer) => {
              body += chunk.toString();
            });
            res.on('end', () => resolve({ status: res.statusCode ?? 0, body }));
          }
        );
        req.on('error', reject);
        req.write('invalid');
        req.end();
      });
      expect(rawRes.status).toBe(400);
    });

    it('should include tool_calls_made in response', async () => {
      const res = await request(port, 'POST', '/ask', { question: 'Test' });
      const body = JSON.parse(res.body);
      expect(typeof body.tool_calls_made).toBe('number');
    });

    it('should return 500 when handler throws', async () => {
      const handlers = createStubHandlers();
      handlers.postAsk = async () => {
        throw new Error('LLM unavailable');
      };
      await server.close();
      server = createRestServer(handlers, { port: 0 });
      await server.ready();
      port = server.port;

      const res = await request(port, 'POST', '/ask', { question: 'Test' });
      expect(res.status).toBe(500);
    });
  });

  describe('CORS for POST', () => {
    it('should include POST in allowed methods', async () => {
      server = createRestServer(createStubHandlers(), { port: 0 });
      await server.ready();
      port = server.port;

      const res = await request(port, 'OPTIONS', '/ask');
      expect(res.headers['access-control-allow-methods']).toContain('POST');
    });
  });
});
