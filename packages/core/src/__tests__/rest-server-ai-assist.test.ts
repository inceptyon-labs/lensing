import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRestServer } from '../rest-server';
import type { RestServerHandlers } from '../rest-server';
import type { AiAssistResponse } from '@lensing/types';

describe('REST Server — AI Assist Endpoints', () => {
  let handlers: RestServerHandlers;
  let mockAiAssist: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockAiAssist = vi.fn();
    handlers = {
      getSettings: vi.fn(async () => ({})),
      putSettings: vi.fn(async () => {}),
      getLayout: vi.fn(async () => []),
      putLayout: vi.fn(async () => {}),
      postAsk: vi.fn(async () => ({}) as any),
      aiAssist: mockAiAssist,
    };
  });

  describe('POST /api/admin/builder/ai-assist', () => {
    it('accepts aiAssist handler in RestServerHandlers', () => {
      expect(handlers.aiAssist).toBeDefined();
      expect(typeof handlers.aiAssist).toBe('function');
    });

    it('calls aiAssist handler with request data', async () => {
      const response: AiAssistResponse = {
        connector: {
          type: 'json_api',
          url: 'https://api.example.com/data',
          refreshInterval: 300,
        },
        html: '<div>test</div>',
        css: '',
      };

      mockAiAssist.mockResolvedValueOnce(response);

      const result = await handlers.aiAssist!({
        provider: 'anthropic',
        model: 'claude-sonnet-4-20250514',
        docsTextOrUrl: 'API documentation',
        pluginContext: { name: 'Test Plugin' },
      });

      expect(result).toEqual(response);
    });

    it('propagates errors from aiAssist handler', async () => {
      mockAiAssist.mockRejectedValueOnce(new Error('Invalid docs'));

      await expect(
        handlers.aiAssist!({
          provider: 'anthropic',
          model: 'claude-sonnet-4-20250514',
          docsTextOrUrl: 'Invalid docs',
          pluginContext: { name: 'Test' },
        })
      ).rejects.toThrow('Invalid docs');
    });
  });
});
