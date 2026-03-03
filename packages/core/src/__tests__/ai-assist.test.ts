import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAiAssist } from '../ai-assist';
import type { AiProvider, Message, GenerateOptions } from '../ai-assist-providers';
import type { AiAssistResponse, AiProviderId } from '@lensing/types';

/** Create a mock provider that returns a pre-set response */
function stubProvider(response: string): AiProvider {
  return {
    provider: 'anthropic' as AiProviderId,
    generate: vi.fn(async () => response),
  };
}

/** Valid JSON output as the LLM would produce it */
const VALID_LLM_OUTPUT = JSON.stringify({
  connector: {
    type: 'json_api',
    url: 'https://api.weather.com/v1/current',
    method: 'GET',
    headers: { 'X-Api-Key': '{{WEATHER_KEY}}' },
    refreshInterval: 300,
  },
  html: '<div class="weather"><h2>{{location}}</h2><span>{{temperature}}°F</span></div>',
  css: '.weather { padding: 16px; } .weather h2 { margin: 0; }',
  explanation: 'Fetches current weather from the Weather API.',
});

/** Valid output wrapped in a markdown code block (common LLM pattern) */
const FENCED_LLM_OUTPUT = `Here is the generated config:

\`\`\`json
${VALID_LLM_OUTPUT}
\`\`\`

This configuration fetches weather data every 5 minutes.`;

describe('createAiAssist', () => {
  describe('generate', () => {
    it('parses valid JSON output from provider', async () => {
      const provider = stubProvider(VALID_LLM_OUTPUT);
      const assist = createAiAssist({ provider });

      const result = await assist.generate({
        docsText: 'Weather API docs: GET /v1/current returns {location, temperature}',
        pluginContext: { name: 'Weather Widget' },
      });

      expect(result.connector.type).toBe('json_api');
      expect(result.connector.url).toBe('https://api.weather.com/v1/current');
      expect(result.html).toContain('{{location}}');
      expect(result.css).toContain('.weather');
      expect(result.explanation).toBeDefined();
    });

    it('extracts JSON from markdown fenced code blocks', async () => {
      const provider = stubProvider(FENCED_LLM_OUTPUT);
      const assist = createAiAssist({ provider });

      const result = await assist.generate({
        docsText: 'Weather API docs',
        pluginContext: { name: 'Weather Widget' },
      });

      expect(result.connector.type).toBe('json_api');
      expect(result.connector.url).toContain('weather');
    });

    it('passes plugin context into the prompt', async () => {
      const provider = stubProvider(VALID_LLM_OUTPUT);
      const assist = createAiAssist({ provider });

      await assist.generate({
        docsText: 'Some API docs',
        pluginContext: { name: 'My Plugin', description: 'Displays stock prices' },
      });

      const generateFn = provider.generate as ReturnType<typeof vi.fn>;
      expect(generateFn).toHaveBeenCalledOnce();

      const messages = generateFn.mock.calls[0][0] as Message[];
      const userMsg = messages.find((m) => m.role === 'user');
      expect(userMsg?.content).toContain('My Plugin');
      expect(userMsg?.content).toContain('Displays stock prices');
      expect(userMsg?.content).toContain('Some API docs');
    });

    it('includes system prompt with connector type instructions', async () => {
      const provider = stubProvider(VALID_LLM_OUTPUT);
      const assist = createAiAssist({ provider });

      await assist.generate({
        docsText: 'API docs',
        pluginContext: { name: 'Test' },
      });

      const generateFn = provider.generate as ReturnType<typeof vi.fn>;
      const messages = generateFn.mock.calls[0][0] as Message[];

      // First message should be a system-level instruction
      expect(messages[0].content).toContain('json_api');
      expect(messages[0].content).toContain('rss_feed');
      expect(messages[0].content).toContain('connector');
    });

    it('forwards model to provider generate call', async () => {
      const provider = stubProvider(VALID_LLM_OUTPUT);
      const assist = createAiAssist({ provider, model: 'claude-haiku-4-5-20251001' });

      await assist.generate({
        docsText: 'API docs',
        pluginContext: { name: 'Test' },
      });

      const generateFn = provider.generate as ReturnType<typeof vi.fn>;
      expect(generateFn.mock.calls[0][1]).toBe('claude-haiku-4-5-20251001');
    });

    it('uses default model when none specified', async () => {
      const provider = stubProvider(VALID_LLM_OUTPUT);
      const assist = createAiAssist({ provider });

      await assist.generate({
        docsText: 'API docs',
        pluginContext: { name: 'Test' },
      });

      const generateFn = provider.generate as ReturnType<typeof vi.fn>;
      // Should pass a non-empty model string
      expect(generateFn.mock.calls[0][1]).toBeTruthy();
    });
  });

  describe('output validation', () => {
    it('throws on invalid JSON from provider', async () => {
      const provider = stubProvider('This is not JSON at all');
      const assist = createAiAssist({ provider });

      await expect(
        assist.generate({
          docsText: 'API docs',
          pluginContext: { name: 'Test' },
        })
      ).rejects.toThrow(/parse|JSON/i);
    });

    it('throws when connector.type is missing', async () => {
      const provider = stubProvider(
        JSON.stringify({
          connector: { url: 'https://example.com', refreshInterval: 60 },
          html: '',
          css: '',
        })
      );
      const assist = createAiAssist({ provider });

      await expect(
        assist.generate({
          docsText: 'API docs',
          pluginContext: { name: 'Test' },
        })
      ).rejects.toThrow(/connector|type/i);
    });

    it('throws when html is missing', async () => {
      const provider = stubProvider(
        JSON.stringify({
          connector: { type: 'json_api', url: 'https://x.com', refreshInterval: 60 },
          css: '',
        })
      );
      const assist = createAiAssist({ provider });

      await expect(
        assist.generate({
          docsText: 'API docs',
          pluginContext: { name: 'Test' },
        })
      ).rejects.toThrow(/html/i);
    });

    it('defaults refreshInterval to 300 when missing', async () => {
      const provider = stubProvider(
        JSON.stringify({
          connector: { type: 'json_api', url: 'https://api.example.com/data', method: 'GET' },
          html: '<div>test</div>',
          css: '',
        })
      );
      const assist = createAiAssist({ provider });

      const result = await assist.generate({
        docsText: 'API docs',
        pluginContext: { name: 'Test' },
      });

      expect(result.connector.refreshInterval).toBe(300);
    });

    it('defaults css to empty string when missing', async () => {
      const provider = stubProvider(
        JSON.stringify({
          connector: {
            type: 'json_api',
            url: 'https://api.example.com/data',
            refreshInterval: 60,
          },
          html: '<div>test</div>',
        })
      );
      const assist = createAiAssist({ provider });

      const result = await assist.generate({
        docsText: 'API docs',
        pluginContext: { name: 'Test' },
      });

      expect(result.css).toBe('');
    });
  });

  describe('error handling', () => {
    it('propagates provider errors', async () => {
      const provider: AiProvider = {
        provider: 'anthropic',
        generate: vi.fn().mockRejectedValue(new Error('Rate limit exceeded')),
      };
      const assist = createAiAssist({ provider });

      await expect(
        assist.generate({
          docsText: 'API docs',
          pluginContext: { name: 'Test' },
        })
      ).rejects.toThrow('Rate limit exceeded');
    });

    it('rejects docs text exceeding max size', async () => {
      const provider = stubProvider(VALID_LLM_OUTPUT);
      const assist = createAiAssist({ provider, maxDocsSize: 100 });

      await expect(
        assist.generate({
          docsText: 'x'.repeat(200),
          pluginContext: { name: 'Test' },
        })
      ).rejects.toThrow(/too large|exceeds/i);
    });

    it('rejects empty docs text', async () => {
      const provider = stubProvider(VALID_LLM_OUTPUT);
      const assist = createAiAssist({ provider });

      await expect(
        assist.generate({
          docsText: '',
          pluginContext: { name: 'Test' },
        })
      ).rejects.toThrow(/empty|required/i);
    });
  });
});
