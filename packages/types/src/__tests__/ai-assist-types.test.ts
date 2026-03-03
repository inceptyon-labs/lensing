import { describe, it, expect } from 'vitest';
import type { AiProviderConfig, AiAssistRequest, AiAssistResponse } from '../index';

describe('AI Assist Types', () => {
  it('defines AiProviderConfig with provider id, model, apiKey', () => {
    const config: AiProviderConfig = {
      provider: 'anthropic',
      model: 'claude-sonnet-4-20250514',
      apiKeyRef: 'AI_ASSIST_ANTHROPIC_KEY',
    };

    expect(config.provider).toBe('anthropic');
    expect(config.model).toBe('claude-sonnet-4-20250514');
    expect(config.apiKeyRef).toBe('AI_ASSIST_ANTHROPIC_KEY');
  });

  it('supports all three provider types: anthropic, deepseek, gemini', () => {
    const configs: AiProviderConfig[] = [
      { provider: 'anthropic', model: 'claude-sonnet-4-20250514', apiKeyRef: 'KEY1' },
      { provider: 'deepseek', model: 'deepseek-chat', apiKeyRef: 'KEY2' },
      { provider: 'gemini', model: 'gemini-2.0-flash', apiKeyRef: 'KEY3' },
    ];

    configs.forEach((c) => {
      expect(['anthropic', 'deepseek', 'gemini']).toContain(c.provider);
    });
  });

  it('defines AiAssistRequest with provider, model, docs, plugin context', () => {
    const request: AiAssistRequest = {
      provider: 'anthropic',
      model: 'claude-sonnet-4-20250514',
      docsTextOrUrl: 'https://api.example.com/docs',
      pluginContext: {
        name: 'Example Plugin',
        description: 'Fetches data from Example API',
      },
    };

    expect(request.provider).toBe('anthropic');
    expect(request.docsTextOrUrl).toContain('api.example.com');
    expect(request.pluginContext.name).toBe('Example Plugin');
  });

  it('defines AiAssistResponse with connector config, html, css, explanation', () => {
    const response: AiAssistResponse = {
      connector: {
        type: 'json_api',
        url: 'https://api.example.com/data',
        method: 'GET',
        headers: { Authorization: 'Bearer {{API_KEY}}' },
        refreshInterval: 300,
      },
      html: '<div>{{title}}</div>',
      css: 'div { font-size: 14px; }',
      explanation: 'Generated from Example API documentation',
    };

    expect(response.connector.type).toBe('json_api');
    expect(response.html).toContain('{{title}}');
    expect(response.css).toContain('font-size');
    expect(response.explanation).toBeDefined();
  });

  it('allows optional fields in AiAssistResponse', () => {
    const minimal: AiAssistResponse = {
      connector: { type: 'static_data', url: '', refreshInterval: 3600 },
      html: '',
      css: '',
    };

    expect(minimal.explanation).toBeUndefined();
  });

  it('supports secret placeholder in headers', () => {
    const response: AiAssistResponse = {
      connector: {
        type: 'json_api',
        url: 'https://api.example.com/data',
        headers: {
          'X-API-Key': '{{API_KEY}}',
          'Authorization': 'Bearer {{TOKEN}}',
        },
        refreshInterval: 300,
      },
      html: '',
      css: '',
    };

    expect(response.connector.headers?.['X-API-Key']).toContain('{{');
    expect(response.connector.headers?.['Authorization']).toContain('{{');
  });
});
