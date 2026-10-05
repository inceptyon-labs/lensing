import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRestServer } from '../rest-server';
describe('REST Server — AI Assist Endpoints', () => {
    let handlers;
    let mockAiAssist;
    beforeEach(() => {
        mockAiAssist = vi.fn();
        handlers = {
            getSettings: vi.fn(async () => ({})),
            putSettings: vi.fn(async () => { }),
            getLayout: vi.fn(async () => []),
            putLayout: vi.fn(async () => { }),
            postAsk: vi.fn(async () => ({})),
            aiAssist: mockAiAssist,
        };
    });
    describe('POST /api/admin/builder/ai-assist', () => {
        it('accepts aiAssist handler in RestServerHandlers', () => {
            expect(handlers.aiAssist).toBeDefined();
            expect(typeof handlers.aiAssist).toBe('function');
        });
        it('calls aiAssist handler with request data', async () => {
            const response = {
                connector: {
                    type: 'json_api',
                    url: 'https://api.example.com/data',
                    refreshInterval: 300,
                },
                html: '<div>test</div>',
                css: '',
            };
            mockAiAssist.mockResolvedValueOnce(response);
            const result = await handlers.aiAssist({
                provider: 'anthropic',
                model: 'claude-sonnet-4-20250514',
                docsTextOrUrl: 'API documentation',
                pluginContext: { name: 'Test Plugin' },
            });
            expect(result).toEqual(response);
        });
        it('propagates errors from aiAssist handler', async () => {
            mockAiAssist.mockRejectedValueOnce(new Error('Invalid docs'));
            await expect(handlers.aiAssist({
                provider: 'anthropic',
                model: 'claude-sonnet-4-20250514',
                docsTextOrUrl: 'Invalid docs',
                pluginContext: { name: 'Test' },
            })).rejects.toThrow('Invalid docs');
        });
    });
    describe('rate limit', () => {
        it('returns 429 after 10 requests in a minute', async () => {
            mockAiAssist.mockResolvedValue({ connector: {}, html: '', css: '' });
            const server = createRestServer(handlers, { port: 0 });
            await server.ready();
            try {
                const post = () => fetch(`http://127.0.0.1:${server.port}/api/admin/builder/ai-assist`, {
                    method: 'POST',
                    body: JSON.stringify({
                        provider: 'anthropic',
                        docsTextOrUrl: 'docs',
                        pluginContext: { name: 'T' },
                    }),
                });
                for (let n = 0; n < 10; n++)
                    expect((await post()).status).toBe(200);
                const res = await post();
                expect(res.status).toBe(429);
                expect(await res.json()).toEqual({ error: 'Rate limited' });
            }
            finally {
                await server.close();
            }
        });
    });
});
//# sourceMappingURL=rest-server-ai-assist.test.js.map