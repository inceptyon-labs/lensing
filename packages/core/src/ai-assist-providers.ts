import type { AiProviderId } from '@lensing/types';

/** Message role in conversation */
export type MessageRole = 'user' | 'assistant' | 'tool_result';

/** A single message in a conversation */
export interface Message {
  role: MessageRole;
  content: string;
}

/** Options for the generate call */
export interface GenerateOptions {
  fetchFn?: typeof fetch;
  timeoutMs?: number;
}

/** LLM provider interface */
export interface AiProvider {
  provider: AiProviderId;
  generate(messages: Message[], model: string, options?: GenerateOptions): Promise<string>;
}

/** Configuration for creating a provider */
export interface AiProviderConfig {
  provider: AiProviderId;
  apiKey: string;
}

const DEFAULT_TIMEOUT_MS = 30000;

/**
 * Create an LLM provider instance for AI-assisted connector setup.
 * Supports Anthropic, DeepSeek, and Gemini.
 */
export function createAiProvider(config: AiProviderConfig): AiProvider {
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
function createAnthropicProvider(apiKey: string): AiProvider {
  return {
    provider: 'anthropic',
    async generate(
      messages: Message[],
      model: string,
      options: GenerateOptions = {}
    ): Promise<string> {
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
          signal: controller.signal as any,
        } as any);

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          const message = (error as any)?.error?.message || `HTTP ${response.status}`;
          throw new Error(message);
        }

        const data = (await response.json()) as any;
        const textBlocks = (data.content || []).filter((b: any) => b.type === 'text');
        return textBlocks.map((b: any) => b.text).join('');
      } catch (err) {
        // Re-throw abort errors as timeout
        if (err instanceof Error && err.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeoutMs}ms`);
        }
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    },
  };
}

/** Create a DeepSeek provider using OpenAI-compatible API */
function createDeepSeekProvider(apiKey: string): AiProvider {
  return {
    provider: 'deepseek',
    async generate(
      messages: Message[],
      model: string,
      options: GenerateOptions = {}
    ): Promise<string> {
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
          signal: controller.signal as any,
        } as any);

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          const message = (error as any)?.error?.message || `HTTP ${response.status}`;
          throw new Error(message);
        }

        const data = (await response.json()) as any;
        return data.choices?.[0]?.message?.content || '';
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeoutMs}ms`);
        }
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    },
  };
}

/** Create a Gemini provider using the Generative Language API */
function createGeminiProvider(apiKey: string): AiProvider {
  return {
    provider: 'gemini',
    async generate(
      messages: Message[],
      model: string,
      options: GenerateOptions = {}
    ): Promise<string> {
      const { fetchFn = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        // Convert lensing message format to Gemini format
        const contents = messages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

        const response = await fetchFn(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
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
            signal: controller.signal as any,
          } as any
        );

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          const message = (error as any)?.error?.message || `HTTP ${response.status}`;
          throw new Error(message);
        }

        const data = (await response.json()) as any;
        const textParts = (data.candidates?.[0]?.content?.parts || []).filter((p: any) => p.text);
        return textParts.map((p: any) => p.text).join('');
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeoutMs}ms`);
        }
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    },
  };
}
