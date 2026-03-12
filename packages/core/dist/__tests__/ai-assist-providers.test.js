import { describe, it, expect, vi } from 'vitest';
import { createAiProvider } from '../ai-assist-providers';
describe('AI Assist Providers', () => {
    describe('createAiProvider', () => {
        it('creates an Anthropic provider with valid config', () => {
            const provider = createAiProvider({
                provider: 'anthropic',
                apiKey: 'sk-ant-test',
            });
            expect(provider).toBeDefined();
            expect(provider.provider).toBe('anthropic');
        });
        it('creates a DeepSeek provider with valid config', () => {
            const provider = createAiProvider({
                provider: 'deepseek',
                apiKey: 'sk-deepseek-test',
            });
            expect(provider).toBeDefined();
            expect(provider.provider).toBe('deepseek');
        });
        it('creates a Gemini provider with valid config', () => {
            const provider = createAiProvider({
                provider: 'gemini',
                apiKey: 'AIzaSy-test',
            });
            expect(provider).toBeDefined();
            expect(provider.provider).toBe('gemini');
        });
        it('throws on unsupported provider', () => {
            expect(() => {
                createAiProvider({
                    provider: 'unknown',
                    apiKey: 'test',
                });
            }).toThrow();
        });
        it('throws on missing API key', () => {
            expect(() => {
                createAiProvider({
                    provider: 'anthropic',
                    apiKey: '',
                });
            }).toThrow();
        });
    });
    describe('AiProvider interface', () => {
        it('has generate method that accepts messages and model', async () => {
            const mockFetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'text', text: 'Generated response' }],
                }),
            });
            const provider = createAiProvider({
                provider: 'anthropic',
                apiKey: 'sk-ant-test',
            });
            const result = await provider.generate([{ role: 'user', content: 'Test prompt' }], 'claude-sonnet-4-20250514', { fetchFn: mockFetch });
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
        it('supports optional model override per call', async () => {
            const mockFetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'text', text: 'Response' }],
                }),
            });
            const provider = createAiProvider({
                provider: 'anthropic',
                apiKey: 'sk-ant-test',
            });
            await provider.generate([{ role: 'user', content: 'Prompt' }], 'claude-haiku-4-5-20251001', // Different model
            { fetchFn: mockFetch });
            expect(mockFetch).toHaveBeenCalled();
        });
        it('throws on network error', async () => {
            const mockFetch = vi.fn().mockRejectedValueOnce(new Error('Network timeout'));
            const provider = createAiProvider({
                provider: 'anthropic',
                apiKey: 'sk-ant-test',
            });
            await expect(provider.generate([{ role: 'user', content: 'Test' }], 'claude-sonnet-4-20250514', {
                fetchFn: mockFetch,
            })).rejects.toThrow();
        });
        it('throws on HTTP error response', async () => {
            const mockFetch = vi.fn().mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: async () => ({ error: { message: 'Unauthorized' } }),
            });
            const provider = createAiProvider({
                provider: 'anthropic',
                apiKey: 'sk-ant-invalid',
            });
            await expect(provider.generate([{ role: 'user', content: 'Test' }], 'claude-sonnet-4-20250514', {
                fetchFn: mockFetch,
            })).rejects.toThrow('Unauthorized');
        });
        it('enforces request timeout', async () => {
            const mockFetch = vi.fn((url, options) => new Promise((resolve, reject) => {
                // Simulate abort signal handling
                if (options?.signal) {
                    options.signal.addEventListener('abort', () => {
                        reject(new DOMException('Aborted', 'AbortError'));
                    });
                }
                // Never resolve - timeout should abort
                setTimeout(() => resolve({ ok: true, json: async () => ({ content: [] }) }), 5000);
            }));
            const provider = createAiProvider({
                provider: 'anthropic',
                apiKey: 'sk-ant-test',
            });
            await expect(provider.generate([{ role: 'user', content: 'Test' }], 'claude-sonnet-4-20250514', {
                fetchFn: mockFetch,
                timeoutMs: 100,
            })).rejects.toThrow(/timeout|Timeout/i);
        });
        it('handles streaming responses (Anthropic format)', async () => {
            const mockFetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [
                        { type: 'text', text: 'Hello ' },
                        { type: 'text', text: 'World' },
                    ],
                }),
            });
            const provider = createAiProvider({
                provider: 'anthropic',
                apiKey: 'sk-ant-test',
            });
            const result = await provider.generate([{ role: 'user', content: 'Test' }], 'claude-sonnet-4-20250514', { fetchFn: mockFetch });
            expect(result).toContain('Hello');
            expect(result).toContain('World');
        });
    });
});
//# sourceMappingURL=ai-assist-providers.test.js.map