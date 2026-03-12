import { describe, it, expect, afterEach } from 'vitest';
import { createRestServer } from '../rest-server';
import http from 'node:http';
/** Helper to make HTTP requests to the test server */
function request(port, method, path, body) {
    return new Promise((resolve, reject) => {
        const data = body !== undefined ? JSON.stringify(body) : undefined;
        const req = http.request({
            hostname: '127.0.0.1',
            port,
            method,
            path,
            headers: {
                'Content-Type': 'application/json',
                ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
            },
        }, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk.toString();
            });
            res.on('end', () => {
                resolve({ status: res.statusCode ?? 0, body: responseBody });
            });
        });
        req.on('error', reject);
        if (data)
            req.write(data);
        req.end();
    });
}
function createStubHandlers() {
    return {
        getSettings: async () => ({}),
        putSettings: async () => { },
        getLayout: async () => [],
        putLayout: async () => { },
        postAsk: async (q) => ({
            id: 'stub',
            question: q,
            response: '',
            timestamp: new Date().toISOString(),
            tool_calls_made: 0,
        }),
    };
}
describe('POST /api/admin/builder/test-connector', () => {
    let server;
    let port;
    afterEach(async () => {
        if (server)
            await server.close();
    });
    it('should return 404 when testConnector handler is not provided', async () => {
        server = createRestServer(createStubHandlers());
        await server.ready();
        port = server.port;
        const res = await request(port, 'POST', '/api/admin/builder/test-connector', {
            type: 'json_api',
            url: 'https://example.com',
        });
        expect(res.status).toBe(404);
    });
    it('should return 400 when body is invalid JSON', async () => {
        const handlers = {
            ...createStubHandlers(),
            testConnector: async () => ({ success: true, sample: {}, fields: [] }),
        };
        server = createRestServer(handlers);
        await server.ready();
        port = server.port;
        // Send invalid JSON body
        const res = await new Promise((resolve, reject) => {
            const req = http.request({
                hostname: '127.0.0.1',
                port,
                method: 'POST',
                path: '/api/admin/builder/test-connector',
                headers: { 'Content-Type': 'application/json', 'Content-Length': 10 },
            }, (httpRes) => {
                let body = '';
                httpRes.on('data', (c) => {
                    body += c.toString();
                });
                httpRes.on('end', () => resolve({ status: httpRes.statusCode ?? 0, body }));
            });
            req.on('error', reject);
            req.write('not-json!!');
            req.end();
        });
        expect(res.status).toBe(400);
        const json = JSON.parse(res.body);
        expect(json.error).toMatch(/json/i);
    });
    it('should call testConnector handler and return result', async () => {
        const sampleResult = {
            success: true,
            sample: { temperature: 22 },
            fields: ['temperature'],
        };
        const handlers = {
            ...createStubHandlers(),
            testConnector: async (_config) => sampleResult,
        };
        server = createRestServer(handlers);
        await server.ready();
        port = server.port;
        const res = await request(port, 'POST', '/api/admin/builder/test-connector', {
            type: 'json_api',
            url: 'https://api.example.com/weather',
        });
        expect(res.status).toBe(200);
        const json = JSON.parse(res.body);
        expect(json.success).toBe(true);
        expect(json.fields).toContain('temperature');
    });
    it('should pass connector config to handler', async () => {
        let receivedConfig;
        const handlers = {
            ...createStubHandlers(),
            testConnector: async (config) => {
                receivedConfig = config;
                return { success: true, sample: {}, fields: [] };
            },
        };
        server = createRestServer(handlers);
        await server.ready();
        port = server.port;
        const sentConfig = { type: 'json_api', url: 'https://api.example.com/data', method: 'GET' };
        await request(port, 'POST', '/api/admin/builder/test-connector', sentConfig);
        expect(receivedConfig?.type).toBe('json_api');
        expect(receivedConfig?.url).toBe('https://api.example.com/data');
    });
    it('should return 200 with error info when handler returns success: false', async () => {
        const handlers = {
            ...createStubHandlers(),
            testConnector: async () => ({ success: false, error: 'URL blocked: localhost' }),
        };
        server = createRestServer(handlers);
        await server.ready();
        port = server.port;
        const res = await request(port, 'POST', '/api/admin/builder/test-connector', {
            type: 'json_api',
            url: 'http://localhost/api',
        });
        expect(res.status).toBe(200);
        const json = JSON.parse(res.body);
        expect(json.success).toBe(false);
        expect(json.error).toBeDefined();
    });
    it('should return 500 when handler throws', async () => {
        const handlers = {
            ...createStubHandlers(),
            testConnector: async () => {
                throw new Error('Unexpected handler error');
            },
        };
        server = createRestServer(handlers);
        await server.ready();
        port = server.port;
        const res = await request(port, 'POST', '/api/admin/builder/test-connector', {
            type: 'json_api',
            url: 'https://api.example.com/data',
        });
        expect(res.status).toBe(500);
        const json = JSON.parse(res.body);
        expect(json.error).toBeDefined();
    });
});
//# sourceMappingURL=rest-server-builder.test.js.map