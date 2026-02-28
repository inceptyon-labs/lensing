import { describe, it, expect, vi } from 'vitest';
import { testConnector, type ConnectorFetchFn } from '../connector-proxy';

/** Helper: create a mock fetch that returns JSON */
function mockJsonFetch(data: unknown, status = 200): ConnectorFetchFn {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: async () => data,
    text: async () => JSON.stringify(data),
  });
}

/** Helper: create a mock fetch that returns text (RSS) */
function mockTextFetch(text: string, status = 200): ConnectorFetchFn {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: async () => {
      throw new Error('Not JSON');
    },
    text: async () => text,
  });
}

const SAMPLE_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <item>
      <title>Article One</title>
      <link>https://example.com/1</link>
      <description>First article</description>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Article Two</title>
      <link>https://example.com/2</link>
      <description>Second article</description>
    </item>
  </channel>
</rss>`;

describe('testConnector', () => {
  describe('validation', () => {
    it('should reject missing type', async () => {
      const result = await testConnector({ type: '' as 'json_api', url: 'https://example.com' });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/type/i);
    });

    it('should reject missing url', async () => {
      const result = await testConnector({ type: 'json_api', url: '' });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/url/i);
    });

    it('should reject invalid url', async () => {
      const result = await testConnector({ type: 'json_api', url: 'not-a-url' });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/url/i);
    });

    it('should reject unsupported connector type', async () => {
      const result = await testConnector({ type: 'static_data' as 'json_api', url: 'https://example.com' });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/type/i);
    });
  });

  describe('SSRF protection', () => {
    it('should block localhost URLs', async () => {
      const result = await testConnector({ type: 'json_api', url: 'http://localhost/api' });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/blocked/i);
    });

    it('should block private IP ranges', async () => {
      const result = await testConnector({ type: 'json_api', url: 'http://192.168.1.1/api' });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/blocked/i);
    });

    it('should block metadata endpoints', async () => {
      const result = await testConnector({ type: 'json_api', url: 'http://169.254.169.254/latest/meta-data/' });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/blocked/i);
    });

    it('should allow private IPs when allowPrivate is true', async () => {
      const fetchFn = mockJsonFetch({ value: 1 });
      const result = await testConnector(
        { type: 'json_api', url: 'http://192.168.1.100/api' },
        { fetchFn, allowPrivate: true }
      );
      expect(result.success).toBe(true);
    });
  });

  describe('JSON API connector', () => {
    it('should fetch and return sample data', async () => {
      const data = { temperature: 22, humidity: 65, city: 'London' };
      const fetchFn = mockJsonFetch(data);
      const result = await testConnector(
        { type: 'json_api', url: 'https://api.example.com/weather' },
        { fetchFn }
      );

      expect(result.success).toBe(true);
      expect(result.sample).toEqual(data);
    });

    it('should extract top-level field paths', async () => {
      const data = { temperature: 22, humidity: 65, city: 'London' };
      const fetchFn = mockJsonFetch(data);
      const result = await testConnector(
        { type: 'json_api', url: 'https://api.example.com/weather' },
        { fetchFn }
      );

      expect(result.fields).toContain('temperature');
      expect(result.fields).toContain('humidity');
      expect(result.fields).toContain('city');
    });

    it('should extract nested field paths', async () => {
      const data = { data: { temp: 22, wind: { speed: 5, direction: 'N' } } };
      const fetchFn = mockJsonFetch(data);
      const result = await testConnector(
        { type: 'json_api', url: 'https://api.example.com/weather' },
        { fetchFn }
      );

      expect(result.fields).toContain('data.temp');
      expect(result.fields).toContain('data.wind.speed');
      expect(result.fields).toContain('data.wind.direction');
    });

    it('should extract field paths from array items', async () => {
      const data = { items: [{ name: 'A', value: 1 }, { name: 'B', value: 2 }] };
      const fetchFn = mockJsonFetch(data);
      const result = await testConnector(
        { type: 'json_api', url: 'https://api.example.com/list' },
        { fetchFn }
      );

      expect(result.fields).toContain('items[0].name');
      expect(result.fields).toContain('items[0].value');
    });

    it('should pass method and headers to fetch', async () => {
      const fetchFn = mockJsonFetch({ ok: true });
      await testConnector(
        {
          type: 'json_api',
          url: 'https://api.example.com/data',
          method: 'POST',
          headers: { Authorization: 'Bearer token123' },
        },
        { fetchFn }
      );

      expect(fetchFn).toHaveBeenCalledWith(
        'https://api.example.com/data',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ Authorization: 'Bearer token123' }),
        })
      );
    });

    it('should default method to GET', async () => {
      const fetchFn = mockJsonFetch({ ok: true });
      await testConnector(
        { type: 'json_api', url: 'https://api.example.com/data' },
        { fetchFn }
      );

      expect(fetchFn).toHaveBeenCalledWith(
        'https://api.example.com/data',
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe('RSS connector', () => {
    it('should fetch and return parsed RSS items', async () => {
      const fetchFn = mockTextFetch(SAMPLE_RSS);
      const result = await testConnector(
        { type: 'rss_feed', url: 'https://example.com/feed.xml' },
        { fetchFn }
      );

      expect(result.success).toBe(true);
      expect(result.sample).toBeDefined();
    });

    it('should extract RSS item fields', async () => {
      const fetchFn = mockTextFetch(SAMPLE_RSS);
      const result = await testConnector(
        { type: 'rss_feed', url: 'https://example.com/feed.xml' },
        { fetchFn }
      );

      expect(result.fields).toContain('title');
      expect(result.fields).toContain('link');
      expect(result.fields).toContain('description');
    });

    it('should return channel title in sample', async () => {
      const fetchFn = mockTextFetch(SAMPLE_RSS);
      const result = await testConnector(
        { type: 'rss_feed', url: 'https://example.com/feed.xml' },
        { fetchFn }
      );

      const sample = result.sample as { channelTitle: string; items: unknown[] };
      expect(sample.channelTitle).toBe('Test Feed');
      expect(sample.items).toHaveLength(2);
    });
  });

  describe('error handling', () => {
    it('should return error on HTTP failure', async () => {
      const fetchFn = mockJsonFetch({}, 500);
      const result = await testConnector(
        { type: 'json_api', url: 'https://api.example.com/data' },
        { fetchFn }
      );

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/500/);
    });

    it('should return error on fetch exception', async () => {
      const fetchFn = vi.fn().mockRejectedValue(new Error('Network error'));
      const result = await testConnector(
        { type: 'json_api', url: 'https://api.example.com/data' },
        { fetchFn }
      );

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/network/i);
    });

    it('should return error on JSON parse failure', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => {
          throw new SyntaxError('Unexpected token');
        },
        text: async () => 'not json',
      });
      const result = await testConnector(
        { type: 'json_api', url: 'https://api.example.com/data' },
        { fetchFn }
      );

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/parse|json/i);
    });

    it('should return error on timeout', async () => {
      const fetchFn = vi.fn().mockImplementation(
        (_url: string, opts: { signal?: AbortSignal }) =>
          new Promise((_resolve, reject) => {
            if (opts?.signal) {
              opts.signal.addEventListener('abort', () => {
                reject(new DOMException('The operation was aborted', 'AbortError'));
              });
            }
          })
      );

      const result = await testConnector(
        { type: 'json_api', url: 'https://api.example.com/slow' },
        { fetchFn, timeoutMs: 50 }
      );

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/timeout/i);
    });
  });
});
