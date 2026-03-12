const DEFAULT_TIMEOUT_MS = 30000;
/**
 * Create an LLM provider instance for AI-assisted connector setup.
 * Supports Anthropic, DeepSeek, and Gemini.
 */
export function createAiProvider(config) {
    if (!config.provider || !['anthropic', 'deepseek', 'gemini'].includes(config.provider)) {
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
    if (!config.apiKey || config.apiKey.trim() === '') {
        throw new Error('API key is required');
    }
    switch (config.provider) {
        case 'anthropic':
            return createAnthropicProvider(config.apiKey);
        case 'deepseek':
            return createDeepSeekProvider(config.apiKey);
        case 'gemini':
            return createGeminiProvider(config.apiKey);
        default:
            throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
}
/** Create an Anthropic provider using the Messages API */
function createAnthropicProvider(apiKey) {
    return {
        provider: 'anthropic',
        async listModels(options = {}) {
            const { fetchFn = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const response = await fetchFn('https://api.anthropic.com/v1/models?limit=100', {
                    method: 'GET',
                    headers: {
                        'x-api-key': apiKey,
                        'anthropic-version': '2023-06-01',
                    },
                    signal: controller.signal,
                });
                if (!response.ok)
                    return [];
                const data = (await response.json());
                return (data.data || []).map((m) => ({
                    id: m.id,
                    name: m.display_name || m.id,
                }));
            }
            catch {
                return [];
            }
            finally {
                clearTimeout(timeoutId);
            }
        },
        async generate(messages, model, options = {}) {
            const { fetchFn = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const response = await fetchFn('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey,
                        'anthropic-version': '2023-06-01',
                    },
                    body: JSON.stringify({
                        model,
                        max_tokens: 4096,
                        messages: messages.map((m) => ({
                            role: m.role === 'tool_result' ? 'user' : m.role,
                            content: m.content,
                        })),
                    }),
                    signal: controller.signal,
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    const message = error?.error?.message || `HTTP ${response.status}`;
                    throw new Error(message);
                }
                const data = (await response.json());
                const textBlocks = (data.content || []).filter((b) => b.type === 'text');
                return textBlocks.map((b) => b.text).join('');
            }
            catch (err) {
                // Re-throw abort errors as timeout
                if (err instanceof Error && err.name === 'AbortError') {
                    throw new Error(`Request timeout after ${timeoutMs}ms`);
                }
                throw err;
            }
            finally {
                clearTimeout(timeoutId);
            }
        },
    };
}
/** Create a DeepSeek provider using OpenAI-compatible API */
function createDeepSeekProvider(apiKey) {
    return {
        provider: 'deepseek',
        async listModels(options = {}) {
            const { fetchFn = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const response = await fetchFn('https://api.deepseek.com/models', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${apiKey}` },
                    signal: controller.signal,
                });
                if (!response.ok)
                    return [];
                const data = (await response.json());
                return (data.data || []).map((m) => ({
                    id: m.id,
                    name: m.id,
                }));
            }
            catch {
                return [];
            }
            finally {
                clearTimeout(timeoutId);
            }
        },
        async generate(messages, model, options = {}) {
            const { fetchFn = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const response = await fetchFn('https://api.deepseek.com/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model,
                        messages: messages.map((m) => ({
                            role: m.role === 'tool_result' ? 'user' : m.role,
                            content: m.content,
                        })),
                        temperature: 0.7,
                    }),
                    signal: controller.signal,
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    const message = error?.error?.message || `HTTP ${response.status}`;
                    throw new Error(message);
                }
                const data = (await response.json());
                return data.choices?.[0]?.message?.content || '';
            }
            catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    throw new Error(`Request timeout after ${timeoutMs}ms`);
                }
                throw err;
            }
            finally {
                clearTimeout(timeoutId);
            }
        },
    };
}
/** Create a Gemini provider using the Generative Language API */
function createGeminiProvider(apiKey) {
    return {
        provider: 'gemini',
        async listModels(options = {}) {
            const { fetchFn = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const response = await fetchFn(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}&pageSize=100`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                });
                if (!response.ok)
                    return [];
                const data = (await response.json());
                return (data.models || [])
                    .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
                    .map((m) => ({
                    id: m.name.replace(/^models\//, ''),
                    name: m.displayName || m.name,
                }));
            }
            catch {
                return [];
            }
            finally {
                clearTimeout(timeoutId);
            }
        },
        async generate(messages, model, options = {}) {
            const { fetchFn = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            try {
                // Convert lensing message format to Gemini format
                const contents = messages.map((m) => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }],
                }));
                const response = await fetchFn(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents,
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 4096,
                        },
                    }),
                    signal: controller.signal,
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    const message = error?.error?.message || `HTTP ${response.status}`;
                    throw new Error(message);
                }
                const data = (await response.json());
                const textParts = (data.candidates?.[0]?.content?.parts || []).filter((p) => p.text);
                return textParts.map((p) => p.text).join('');
            }
            catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    throw new Error(`Request timeout after ${timeoutMs}ms`);
                }
                throw err;
            }
            finally {
                clearTimeout(timeoutId);
            }
        },
    };
}
//# sourceMappingURL=ai-assist-providers.js.map