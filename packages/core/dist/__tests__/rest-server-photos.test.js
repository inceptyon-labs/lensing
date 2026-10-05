import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createRestServer } from '../rest-server';
import http from 'node:http';
import fs from 'fs';
import path from 'path';
import os from 'os';
function createStubHandlers() {
    return {
        getSettings: async () => ({}),
        putSettings: async () => { },
        getLayout: async () => [],
        putLayout: async () => { },
        postAsk: async (question) => ({
            id: 'stub',
            question,
            response: 'Stub',
            timestamp: new Date().toISOString(),
            tool_calls_made: 0,
        }),
    };
}
function request(port, method, reqPath) {
    return new Promise((resolve, reject) => {
        const req = http.request({ hostname: '127.0.0.1', port, method, path: reqPath }, (res) => {
            let body = '';
            res.on('data', (chunk) => {
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
    let server;
    let port;
    let tmpDir;
    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'photos-'));
        fs.writeFileSync(path.join(tmpDir, 'sunset.jpg'), 'fake-jpg-data');
        fs.writeFileSync(path.join(tmpDir, 'beach.png'), 'fake-png-data');
    });
    afterEach(async () => {
        if (server)
            await server.close();
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
    it('should return 400 for a malformed percent-encoding', async () => {
        server = createRestServer(createStubHandlers(), { port: 0, photoDir: tmpDir });
        await server.ready();
        const res = await request(server.port, 'GET', '/photos/%E0%A4%A');
        expect(res.status).toBe(400);
    });
    it('should not serve sibling directories that share the photoDir prefix', async () => {
        const sibling = `${tmpDir}-secret`;
        fs.mkdirSync(sibling);
        fs.writeFileSync(path.join(sibling, 'leak.jpg'), 'leak');
        try {
            server = createRestServer(createStubHandlers(), { port: 0, photoDir: tmpDir });
            await server.ready();
            const res = await request(server.port, 'GET', `/photos/..%2F${path.basename(sibling)}%2Fleak.jpg`);
            expect(res.status).toBe(403);
        }
        finally {
            fs.rmSync(sibling, { recursive: true, force: true });
        }
    });
    it('should only serve image extensions', async () => {
        fs.writeFileSync(path.join(tmpDir, '.env'), 'SECRET=1');
        fs.writeFileSync(path.join(tmpDir, 'notes.txt'), 'hi');
        server = createRestServer(createStubHandlers(), { port: 0, photoDir: tmpDir });
        await server.ready();
        expect((await request(server.port, 'GET', '/photos/.env')).status).toBe(404);
        expect((await request(server.port, 'GET', '/photos/notes.txt')).status).toBe(404);
    });
});
//# sourceMappingURL=rest-server-photos.test.js.map