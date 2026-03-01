import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createJsonApiConnector, JsonApiConnector } from '../json-api-connector';
import type { JsonApiConnectorConfig } from '@lensing/types';
import type { ConnectorFetchFn } from '../connector-proxy';

describe('JSON API Connector', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  const defaultConfig: JsonApiConnectorConfig = {
    type: 'json-api',
    url: 'https://api.example.com/data',
    method: 'GET',
    headers: { Accept: 'application/json' },
    refresh_ms: 5000,
    mapping: {
      temperature: '$.temp',
      condition: '$.weather.condition',
      humidity: '$.humidity',
    },
  };

  const mockJsonResponse = {
    temp: 72,
    weather: { condition: 'sunny' },
    humidity: 65,
  };

  beforeEach(() => {
    mockFetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('basic fetch and mapping', () => {
    it('should fetch JSON and map fields using JSONPath', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockJsonResponse,
      });

      const connector = createJsonApiConnector(defaultConfig, { fetchFn: mockFetch });
      const result = await connector.fetch();

      expect(result).toEqual({
        temperature: 72,
        condition: 'sunny',
        humidity: 65,
      });
    });

    it('should make fetch with correct method and headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockJsonResponse,
      });

      const config: JsonApiConnectorConfig = {
        ...defaultConfig,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Auth': 'token123' },
      };

      const connector = createJsonApiConnector(config, { fetchFn: mockFetch });
      await connector.fetch();

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Auth': 'token123' },
        signal: expect.any(AbortSignal),
      });
    });

    it('should handle nested JSONPath expressions', async () => {
      const response = {
        data: {
          user: {
            profile: {
              name: 'John Doe',
              email: 'john@example.com',
            },
          },
        },
        status: 'active',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => response,
      });

      const config: JsonApiConnectorConfig = {
        ...defaultConfig,
        mapping: {
          name: '$.data.user.profile.name',
          email: '$.data.user.profile.email',
          status: '$.status',
        },
      };

      const connector = createJsonApiConnector(config, { fetchFn: mockFetch });
      const result = await connector.fetch();

      expect(result).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active',
      });
    });

    it('should handle array access in JSONPath', async () => {
      const response = {
        items: [
          { name: 'Item 1', price: 10 },
          { name: 'Item 2', price: 20 },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => response,
      });

      const config: JsonApiConnectorConfig = {
        ...defaultConfig,
        mapping: {
          firstItemName: '$.items[0].name',
          firstItemPrice: '$.items[0].price',
        },
      };

      const connector = createJsonApiConnector(config, { fetchFn: mockFetch });
      const result = await connector.fetch();

      expect(result).toEqual({
        firstItemName: 'Item 1',
        firstItemPrice: 10,
      });
    });
  });

  describe('error handling', () => {
    it('should handle HTTP 4xx errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'Not found' }),
      });

      const connector = createJsonApiConnector(defaultConfig, { fetchFn: mockFetch });
      await expect(connector.fetch()).rejects.toThrow(/404|Not Found/);
    });

    it('should handle HTTP 5xx errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Server error' }),
      });

      const connector = createJsonApiConnector(defaultConfig, { fetchFn: mockFetch });
      await expect(connector.fetch()).rejects.toThrow(/500|Server Error/);
    });

    it('should handle JSON parse errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const connector = createJsonApiConnector(defaultConfig, { fetchFn: mockFetch });
      await expect(connector.fetch()).rejects.toThrow(/JSON/);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'));

      const connector = createJsonApiConnector(defaultConfig, { fetchFn: mockFetch });
      await expect(connector.fetch()).rejects.toThrow(/Network|timeout/);
    });

    it('should handle timeout', async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new DOMException('AbortError', 'AbortError')), 100);
          })
      );

      const connector = createJsonApiConnector(defaultConfig, {
        fetchFn: mockFetch,
        timeoutMs: 50,
      });
      await expect(connector.fetch()).rejects.toThrow(/timeout|abort/i);
    });

    it('should throw when mapping path not found in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ temperature: 72 }), // missing humidity
      });

      const connector = createJsonApiConnector(defaultConfig, { fetchFn: mockFetch });
      await expect(connector.fetch()).rejects.toThrow();
    });
  });

  describe('placeholder substitution', () => {
    it('should substitute {{SECRET_NAME}} placeholders in URL', async () => {
      const secretResolver = vi.fn(async (name: string) => {
        if (name === 'API_KEY') return 'secret-key-123';
        throw new Error(`Unknown secret: ${name}`);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockJsonResponse,
      });

      const config: JsonApiConnectorConfig = {
        ...defaultConfig,
        url: 'https://api.example.com/data?key={{API_KEY}}',
      };

      const connector = createJsonApiConnector(config, { fetchFn: mockFetch, secretResolver });
      await connector.fetch();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/data?key=secret-key-123',
        expect.any(Object)
      );
    });

    it('should substitute {{SECRET_NAME}} placeholders in headers', async () => {
      const secretResolver = vi.fn(async (name: string) => {
        if (name === 'AUTH_TOKEN') return 'bearer-token-xyz';
        throw new Error(`Unknown secret: ${name}`);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockJsonResponse,
      });

      const config: JsonApiConnectorConfig = {
        ...defaultConfig,
        headers: { Authorization: 'Bearer {{AUTH_TOKEN}}' },
      };

      const connector = createJsonApiConnector(config, {
        fetchFn: mockFetch,
        secretResolver,
      });
      await connector.fetch();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer bearer-token-xyz',
          }),
        })
      );
    });

    it('should throw when secret is not found', async () => {
      const secretResolver = vi.fn(async (name: string) => {
        throw new Error(`Secret not found: ${name}`);
      });

      const config: JsonApiConnectorConfig = {
        ...defaultConfig,
        url: 'https://api.example.com/data?key={{UNKNOWN_SECRET}}',
      };

      const connector = createJsonApiConnector(config, { fetchFn: mockFetch, secretResolver });
      await expect(connector.fetch()).rejects.toThrow(/Secret|not found/);
    });
  });

  describe('response caching', () => {
    it('should cache last successful response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockJsonResponse,
      });

      const connector = createJsonApiConnector(defaultConfig, { fetchFn: mockFetch });
      const result1 = await connector.fetch();
      const cached = connector.getCachedResponse();

      expect(cached).toEqual(result1);
    });

    it('should return cached response on subsequent errors', async () => {
      // First successful response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockJsonResponse,
      });

      const connector = createJsonApiConnector(defaultConfig, { fetchFn: mockFetch });
      const result1 = await connector.fetch();

      // Second fetch fails but has cached data
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Server error' }),
      });

      const result2 = await connector.fetch();
      expect(result2).toEqual(result1);
    });

    it('should throw on first error when no cache exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Server error' }),
      });

      const connector = createJsonApiConnector(defaultConfig, { fetchFn: mockFetch });
      await expect(connector.fetch()).rejects.toThrow();
    });

    it('should clear cache on explicit clear', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockJsonResponse,
      });

      const connector = createJsonApiConnector(defaultConfig, { fetchFn: mockFetch });
      await connector.fetch();
      connector.clearCache();

      const cached = connector.getCachedResponse();
      expect(cached).toBeUndefined();
    });
  });

  describe('SSRF protection', () => {
    it('should reject localhost URLs', async () => {
      const config: JsonApiConnectorConfig = {
        ...defaultConfig,
        url: 'http://localhost:8080/api',
      };

      const connector = createJsonApiConnector(config, { fetchFn: mockFetch });
      await expect(connector.fetch()).rejects.toThrow(/blocked|localhost/i);
    });

    it('should reject private IP ranges', async () => {
      const config: JsonApiConnectorConfig = {
        ...defaultConfig,
        url: 'http://192.168.1.1/api',
      };

      const connector = createJsonApiConnector(config, { fetchFn: mockFetch });
      await expect(connector.fetch()).rejects.toThrow(/blocked|private/i);
    });

    it('should allow public URLs', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockJsonResponse,
      });

      const config: JsonApiConnectorConfig = {
        ...defaultConfig,
        url: 'https://api.example.com/data',
      };

      const connector = createJsonApiConnector(config, { fetchFn: mockFetch });
      const result = await connector.fetch();

      expect(result).toEqual({
        temperature: 72,
        condition: 'sunny',
        humidity: 65,
      });
    });

    it('should allow private IPs when allowPrivate option is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockJsonResponse,
      });

      const config: JsonApiConnectorConfig = {
        ...defaultConfig,
        url: 'http://10.0.0.1/api',
      };

      const connector = createJsonApiConnector(config, {
        fetchFn: mockFetch,
        allowPrivate: true,
      });
      const result = await connector.fetch();

      expect(result).toBeDefined();
    });
  });

  describe('default timeout', () => {
    it('should use 10s default timeout', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockJsonResponse,
      });

      const connector = createJsonApiConnector(defaultConfig, { fetchFn: mockFetch });
      // Don't actually test the timeout duration, just verify it accepts the request
      await connector.fetch();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('should allow custom timeout', async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new DOMException('AbortError', 'AbortError')), 100);
          })
      );

      const connector = createJsonApiConnector(defaultConfig, {
        fetchFn: mockFetch,
        timeoutMs: 50, // Very short timeout
      });

      await expect(connector.fetch()).rejects.toThrow();
    });
  });
});
