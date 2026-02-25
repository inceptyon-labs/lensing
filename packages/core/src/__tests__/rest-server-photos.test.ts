import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createRestServer, type RestServerInstance, type RestServerHandlers } from '../rest-server';
import http from 'node:http';
import fs from 'fs';
import path from 'path';
import os from 'os';

function createStubHandlers(): RestServerHandlers {
  return {
    getSettings: async () => ({}),
    putSettings: async () => {},
    getLayout: async () => [],
    putLayout: async () => {},
    postAsk: async (question: string) => ({
      id: 'stub',
      question,
      response: 'Stub',
      timestamp: new Date().toISOString(),
      tool_calls_made: 0,
    }),
  };
}

function request(
  port: number,
  method: string,
  reqPath: string
): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, method, path: reqPath }, (res) => {
      let body = '';
      res.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });
      res.on('end', () => {
        resolve({ status: res.statusCode ?? 0, headers: res.headers, body });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

describe('REST Server Photo Static Serving', () => {
  let server: RestServerInstance;
  let port: number;
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'photos-'));
    fs.writeFileSync(path.join(tmpDir, 'sunset.jpg'), 'fake-jpg-data');
    fs.writeFileSync(path.join(tmpDir, 'beach.png'), 'fake-png-data');
  });

  afterEach(async () => {
    if (server) await server.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should serve image files at /photos/:filename', async () => {
    server = createRestServer(createStubHandlers(), { port: 0, photoDir: tmpDir });
    await server.ready();
    port = server.port;

    const res = await request(port, 'GET', '/photos/sunset.jpg');
    expect(res.status).toBe(200);
    expect(res.body).toBe('fake-jpg-data');
  });

  it('should set correct Content-Type for jpg', async () => {
    server = createRestServer(createStubHandlers(), { port: 0, photoDir: tmpDir });
    await server.ready();
    port = server.port;

    const res = await request(port, 'GET', '/photos/sunset.jpg');
    expect(res.headers['content-type']).toBe('image/jpeg');
  });

  it('should set correct Content-Type for png', async () => {
    server = createRestServer(createStubHandlers(), { port: 0, photoDir: tmpDir });
    await server.ready();
    port = server.port;

    const res = await request(port, 'GET', '/photos/beach.png');
    expect(res.headers['content-type']).toBe('image/png');
  });

  it('should return 404 for non-existent photo', async () => {
    server = createRestServer(createStubHandlers(), { port: 0, photoDir: tmpDir });
    await server.ready();
    port = server.port;

    const res = await request(port, 'GET', '/photos/missing.jpg');
    expect(res.status).toBe(404);
  });

  it('should reject path traversal attempts', async () => {
    server = createRestServer(createStubHandlers(), { port: 0, photoDir: tmpDir });
    await server.ready();
    port = server.port;

    const res = await request(port, 'GET', '/photos/../../../etc/passwd');
    expect(res.status).toBe(403);
  });

  it('should return 404 for /photos/* when photoDir not configured', async () => {
    server = createRestServer(createStubHandlers(), { port: 0 });
    await server.ready();
    port = server.port;

    const res = await request(port, 'GET', '/photos/sunset.jpg');
    expect(res.status).toBe(404);
  });
});
