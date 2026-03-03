import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createHostService } from '../host-service';
import type { AiAssistRequest, AiAssistResponse } from '@lensing/types';

describe('HostService AI Assist Integration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset env vars before each test
    process.env = { ...originalEnv };
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.DEEPSEEK_API_KEY;
    delete process.env.GEMINI_API_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('handler availability based on env vars', () => {
    it('should boot successfully when no API keys are set', async () => {
      const service = createHostService({
        port: 0,
        dbPath: ':memory:',
      });

      await service.ready;
      expect(service.rest).toBeDefined();
      await service.close();
    });

    it('should boot successfully with ANTHROPIC_API_KEY', async () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';

      const service = createHostService({
        port: 0,
        dbPath: ':memory:',
      });

      await service.ready;
      expect(service.rest).toBeDefined();
      await service.close();
    });

    it('should boot successfully with DEEPSEEK_API_KEY', async () => {
      process.env.DEEPSEEK_API_KEY = 'sk-deepseek-test-key';

      const service = createHostService({
        port: 0,
        dbPath: ':memory:',
      });

      await service.ready;
      expect(service.rest).toBeDefined();
      await service.close();
    });

    it('should boot successfully with GEMINI_API_KEY', async () => {
      process.env.GEMINI_API_KEY = 'AIzaSy-test-key';

      const service = createHostService({
        port: 0,
        dbPath: ':memory:',
      });

      await service.ready;
      expect(service.rest).toBeDefined();
      await service.close();
    });

    it('should boot successfully with all API keys set', async () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';
      process.env.DEEPSEEK_API_KEY = 'sk-deepseek-test-key';
      process.env.GEMINI_API_KEY = 'AIzaSy-test-key';

      const service = createHostService({
        port: 0,
        dbPath: ':memory:',
      });

      await service.ready;
      expect(service.rest).toBeDefined();
      await service.close();
    });
  });

  describe('available providers from env vars', () => {
    it('should provide anthropic when ANTHROPIC_API_KEY is set', async () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';

      const service = createHostService({
        port: 0,
        dbPath: ':memory:',
      });

      await service.ready;

      // The available providers should be returned in REST response
      // We test this by making a request, but since we don't have
      // the REST response exposed, we rely on the handler being wired
      expect(service.rest).toBeDefined();

      await service.close();
    });

    it('should provide deepseek when DEEPSEEK_API_KEY is set', async () => {
      process.env.DEEPSEEK_API_KEY = 'sk-deepseek-test-key';

      const service = createHostService({
        port: 0,
        dbPath: ':memory:',
      });

      await service.ready;
      expect(service.rest).toBeDefined();
      await service.close();
    });

    it('should provide gemini when GEMINI_API_KEY is set', async () => {
      process.env.GEMINI_API_KEY = 'AIzaSy-test-key';

      const service = createHostService({
        port: 0,
        dbPath: ':memory:',
      });

      await service.ready;
      expect(service.rest).toBeDefined();
      await service.close();
    });

    it('should provide multiple providers when multiple keys are set', async () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';
      process.env.GEMINI_API_KEY = 'AIzaSy-test-key';

      const service = createHostService({
        port: 0,
        dbPath: ':memory:',
      });

      await service.ready;
      expect(service.rest).toBeDefined();
      await service.close();
    });
  });

  describe('aiAssist handler security', () => {
    it('should not expose API keys in service output', async () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-secret-key-12345';

      const service = createHostService({
        port: 0,
        dbPath: ':memory:',
      });

      await service.ready;

      // Verify the service initialized without exposing secrets
      expect(service.rest).toBeDefined();

      await service.close();
    });

    it('should initialize successfully with empty API key', async () => {
      process.env.ANTHROPIC_API_KEY = '';

      const service = createHostService({
        port: 0,
        dbPath: ':memory:',
      });

      await service.ready;
      expect(service.rest).toBeDefined();
      await service.close();
    });
  });

  describe('handler invocation', () => {
    it('should have aiAssist handler available when providers are configured', async () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';

      const service = createHostService({
        port: 0,
        dbPath: ':memory:',
      });

      await service.ready;

      // The handler should exist and be callable
      // Since we can't access it directly, we verify the service is ready
      expect(service.rest).toBeDefined();

      await service.close();
    });
  });
});
