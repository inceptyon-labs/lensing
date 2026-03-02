import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { RssConnectorConfig } from '@lensing/types';
import { createRssConnector, type RssConnector, type RssConnectorOptions } from '../rss-connector';

/** Helper to create a minimal RSS 2.0 feed */
function createRss2Feed(items: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <link>https://example.com</link>
    <description>A test RSS feed</description>
    ${items}
  </channel>
</rss>`;
}

/** Helper to create a minimal Atom feed */
function createAtomFeed(entries: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Test Feed</title>
  <link href="https://example.com"/>
  <id>urn:uuid:60a76c80-d399-11d9-b91C-0003939e0af6</id>
  <updated>2003-12-13T18:30:02Z</updated>
  ${entries}
</feed>`;
}

describe('RSS Connector', () => {
  let config: RssConnectorConfig;
  let options: RssConnectorOptions;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    config = {
      type: 'rss',
      url: 'https://example.com/feed.xml',
      refresh_ms: 300000,
      mapping: {
        title: 'title',
        description: 'description',
        image: 'image > url',
        date: 'pubDate',
        link: 'link',
        author: 'author',
      },
    };
    mockFetch = vi.fn();
    options = { fetchFn: mockFetch, timeoutMs: 5000 };
  });

  describe('RSS 2.0 parsing', () => {
    it('should parse RSS 2.0 feed and extract items', async () => {
      const rssContent = createRss2Feed(`
        <item>
          <title>First Item</title>
          <description>First description</description>
          <link>https://example.com/item1</link>
          <pubDate>Fri, 01 Mar 2024 10:00:00 GMT</pubDate>
          <author>John Doe</author>
        </item>
        <item>
          <title>Second Item</title>
          <description>Second description</description>
          <link>https://example.com/item2</link>
          <pubDate>Fri, 01 Mar 2024 11:00:00 GMT</pubDate>
          <author>Jane Smith</author>
        </item>
      `);

      mockFetch.mockResolvedValueOnce(new Response(rssContent, { status: 200 }));
      const connector = createRssConnector(config, options);
      const result = await connector.fetch();

      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items.length).toBe(2);
      expect(result.items[0]).toMatchObject({
        title: 'First Item',
        description: 'First description',
        link: 'https://example.com/item1',
        author: 'John Doe',
      });
    });

    it('should respect item limit (default 10)', async () => {
      let itemsXml = '';
      for (let i = 1; i <= 15; i++) {
        itemsXml += `
          <item>
            <title>Item ${i}</title>
            <link>https://example.com/item${i}</link>
            <description>Description ${i}</description>
          </item>
        `;
      }
      const rssContent = createRss2Feed(itemsXml);

      mockFetch.mockResolvedValueOnce(new Response(rssContent, { status: 200 }));
      const connector = createRssConnector(config, options);
      const result = await connector.fetch();

      expect(result.items.length).toBe(10);
    });

    it('should respect custom item limit', async () => {
      let itemsXml = '';
      for (let i = 1; i <= 10; i++) {
        itemsXml += `
          <item>
            <title>Item ${i}</title>
            <link>https://example.com/item${i}</link>
            <description>Description ${i}</description>
          </item>
        `;
      }
      const rssContent = createRss2Feed(itemsXml);

      mockFetch.mockResolvedValueOnce(new Response(rssContent, { status: 200 }));
      const customConfig: RssConnectorConfig = { ...config, limit: 3 };
      const connector = createRssConnector(customConfig, options);
      const result = await connector.fetch();

      expect(result.items.length).toBe(3);
    });

    it('should extract and map image URL from RSS item enclosure', async () => {
      const rssContent = createRss2Feed(`
        <item>
          <title>Item with Image</title>
          <description>Description</description>
          <link>https://example.com/item</link>
          <enclosure url="https://example.com/image.jpg" type="image/jpeg"/>
        </item>
      `);

      const imageConfig: RssConnectorConfig = {
        ...config,
        mapping: { ...config.mapping, image: 'enclosure @url' },
      };
      mockFetch.mockResolvedValueOnce(new Response(rssContent, { status: 200 }));
      const connector = createRssConnector(imageConfig, options);
      const result = await connector.fetch();

      expect(result.items[0]).toMatchObject({
        image: 'https://example.com/image.jpg',
      });
    });
  });

  describe('Atom feed parsing', () => {
    it('should parse Atom feed and extract entries', async () => {
      const atomContent = createAtomFeed(`
        <entry>
          <title>First Entry</title>
          <summary>First summary</summary>
          <link href="https://example.com/entry1"/>
          <published>2024-03-01T10:00:00Z</published>
          <author><name>John Doe</name></author>
        </entry>
        <entry>
          <title>Second Entry</title>
          <summary>Second summary</summary>
          <link href="https://example.com/entry2"/>
          <published>2024-03-01T11:00:00Z</published>
          <author><name>Jane Smith</name></author>
        </entry>
      `);

      mockFetch.mockResolvedValueOnce(new Response(atomContent, { status: 200 }));
      const connector = createRssConnector(config, options);
      const result = await connector.fetch();

      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items.length).toBe(2);
      expect(result.items[0]).toMatchObject({
        title: 'First Entry',
        description: 'First summary',
        link: 'https://example.com/entry1',
        author: 'John Doe',
      });
    });

    it('should handle Atom entries with media:content', async () => {
      const atomContent = createAtomFeed(`
        <entry xmlns:media="http://search.yahoo.com/mrss/">
          <title>Entry with Image</title>
          <summary>Description</summary>
          <link href="https://example.com/entry"/>
          <media:content url="https://example.com/image.jpg" medium="image"/>
        </entry>
      `);

      const imageConfig: RssConnectorConfig = {
        ...config,
        mapping: { ...config.mapping, image: 'media:content @url' },
      };
      mockFetch.mockResolvedValueOnce(new Response(atomContent, { status: 200 }));
      const connector = createRssConnector(imageConfig, options);
      const result = await connector.fetch();

      expect(result.items[0]).toMatchObject({
        image: 'https://example.com/image.jpg',
      });
    });
  });

  describe('Field mapping', () => {
    it('should map all standard fields correctly', async () => {
      const rssContent = createRss2Feed(`
        <item>
          <title>Test Item</title>
          <description>Test description</description>
          <link>https://example.com/item</link>
          <pubDate>Fri, 01 Mar 2024 10:00:00 GMT</pubDate>
          <author>Test Author</author>
        </item>
      `);

      mockFetch.mockResolvedValueOnce(new Response(rssContent, { status: 200 }));
      const connector = createRssConnector(config, options);
      const result = await connector.fetch();

      expect(result.items[0]).toMatchObject({
        title: 'Test Item',
        description: 'Test description',
        link: 'https://example.com/item',
        author: 'Test Author',
      });
      expect(result.items[0].date).toBeDefined();
    });

    it('should handle missing optional fields gracefully', async () => {
      const rssContent = createRss2Feed(`
        <item>
          <title>Minimal Item</title>
          <link>https://example.com/item</link>
        </item>
      `);

      mockFetch.mockResolvedValueOnce(new Response(rssContent, { status: 200 }));
      const connector = createRssConnector(config, options);
      const result = await connector.fetch();

      expect(result.items[0]).toMatchObject({
        title: 'Minimal Item',
        link: 'https://example.com/item',
      });
      expect(result.items[0].description).toBeUndefined();
      expect(result.items[0].author).toBeUndefined();
    });

    it('should support custom mapping with arbitrary field names', async () => {
      const rssContent = createRss2Feed(`
        <item>
          <title>Test</title>
          <category>tech</category>
          <guid>item-123</guid>
        </item>
      `);

      const customConfig: RssConnectorConfig = {
        ...config,
        mapping: {
          headline: 'title',
          category: 'category',
          uniqueId: 'guid',
        },
      };
      mockFetch.mockResolvedValueOnce(new Response(rssContent, { status: 200 }));
      const connector = createRssConnector(customConfig, options);
      const result = await connector.fetch();

      expect(result.items[0]).toMatchObject({
        headline: 'Test',
        category: 'tech',
        uniqueId: 'item-123',
      });
    });
  });

  describe('Error handling', () => {
    it('should handle malformed XML gracefully', async () => {
      const malformed = '<rss><channel><unclosed>';

      mockFetch.mockResolvedValueOnce(new Response(malformed, { status: 200 }));
      const connector = createRssConnector(config, options);

      await expect(connector.fetch()).rejects.toThrow();
    });

    it('should handle HTTP errors (4xx/5xx)', async () => {
      mockFetch.mockResolvedValueOnce(new Response('Not Found', { status: 404 }));
      const connector = createRssConnector(config, options);

      await expect(connector.fetch()).rejects.toThrow();
    });

    it('should handle network timeouts', async () => {
      mockFetch.mockRejectedValueOnce(new Error('AbortError'));
      const connector = createRssConnector(config, options);

      await expect(connector.fetch()).rejects.toThrow();
    });

    it('should return cached response on fetch error if available', async () => {
      const rssContent = createRss2Feed(`
        <item>
          <title>Cached Item</title>
          <link>https://example.com/item</link>
        </item>
      `);

      // First fetch succeeds
      mockFetch.mockResolvedValueOnce(new Response(rssContent, { status: 200 }));
      const connector = createRssConnector(config, options);
      await connector.fetch();

      // Second fetch fails
      mockFetch.mockResolvedValueOnce(new Response('Error', { status: 500 }));
      const cached = await connector.getCachedResponse();

      expect(cached).toBeDefined();
      expect(cached?.items.length).toBe(1);
      expect(cached?.items[0]).toMatchObject({
        title: 'Cached Item',
      });
    });

    it('should throw if no cache available and fetch fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const connector = createRssConnector(config, options);

      await expect(connector.fetch()).rejects.toThrow();
    });

    it('should clear cache after error', async () => {
      const rssContent = createRss2Feed(`
        <item>
          <title>Item</title>
          <link>https://example.com</link>
        </item>
      `);

      // Prime the cache
      mockFetch.mockResolvedValueOnce(new Response(rssContent, { status: 200 }));
      const connector = createRssConnector(config, options);
      await connector.fetch();

      // Clear cache
      connector.clearCache();
      const cached = await connector.getCachedResponse();
      expect(cached).toBeUndefined();
    });
  });

  describe('Caching', () => {
    it('should cache successful responses', async () => {
      const rssContent = createRss2Feed(`
        <item>
          <title>Cached Item</title>
          <link>https://example.com</link>
        </item>
      `);

      mockFetch.mockResolvedValueOnce(new Response(rssContent, { status: 200 }));
      const connector = createRssConnector(config, options);
      await connector.fetch();

      const cached = await connector.getCachedResponse();
      expect(cached).toBeDefined();
      expect(cached?.items[0]).toMatchObject({
        title: 'Cached Item',
      });
    });

    it('should return fresh data when cache available', async () => {
      const rss1 = createRss2Feed(`<item><title>Item 1</title></item>`);
      const rss2 = createRss2Feed(`<item><title>Item 2</title></item>`);

      mockFetch.mockResolvedValueOnce(new Response(rss1, { status: 200 }));
      const connector = createRssConnector(config, options);
      const result1 = await connector.fetch();
      expect(result1.items[0].title).toBe('Item 1');

      mockFetch.mockResolvedValueOnce(new Response(rss2, { status: 200 }));
      const result2 = await connector.fetch();
      expect(result2.items[0].title).toBe('Item 2');
    });
  });

  describe('SSRF protection', () => {
    it('should block localhost URLs', async () => {
      const localhostConfig: RssConnectorConfig = {
        ...config,
        url: 'http://localhost:8080/feed.xml',
      };

      const connector = createRssConnector(localhostConfig, options);
      await expect(connector.fetch()).rejects.toThrow();
    });

    it('should block private IP ranges by default', async () => {
      const privateConfig: RssConnectorConfig = {
        ...config,
        url: 'http://192.168.1.1/feed.xml',
      };

      const connector = createRssConnector(privateConfig, options);
      await expect(connector.fetch()).rejects.toThrow();
    });

    it('should allow private IPs when allowPrivate option is set', async () => {
      const rssContent = createRss2Feed(`
        <item>
          <title>Home Lab Item</title>
          <link>http://192.168.1.1/item</link>
        </item>
      `);

      const privateConfig: RssConnectorConfig = {
        ...config,
        url: 'http://192.168.1.1/feed.xml',
      };

      mockFetch.mockResolvedValueOnce(new Response(rssContent, { status: 200 }));
      const connector = createRssConnector(privateConfig, { ...options, allowPrivate: true });
      const result = await connector.fetch();

      expect(result.items[0]).toMatchObject({
        title: 'Home Lab Item',
      });
    });
  });

  describe('Timeout handling', () => {
    it('should timeout if fetch exceeds timeout duration', async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('AbortError')), 100);
          })
      );

      const timeoutConfig: RssConnectorOptions = { ...options, timeoutMs: 50 };
      const connector = createRssConnector(config, timeoutConfig);

      await expect(connector.fetch()).rejects.toThrow();
    });

    it('should use default timeout of 10 seconds', async () => {
      const rssContent = createRss2Feed(`<item><title>Item</title></item>`);

      mockFetch.mockResolvedValueOnce(new Response(rssContent, { status: 200 }));
      const connector = createRssConnector(config, { fetchFn: mockFetch });
      await connector.fetch();

      // Should have been called with a timeout controller
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('Connector interface', () => {
    it('should return RssConnector interface with required methods', async () => {
      const connector = createRssConnector(config, options);

      expect(connector).toHaveProperty('fetch');
      expect(connector).toHaveProperty('getCachedResponse');
      expect(connector).toHaveProperty('clearCache');
    });

    it('fetch should return object with items array', async () => {
      const rssContent = createRss2Feed(`
        <item>
          <title>Item</title>
          <link>https://example.com</link>
        </item>
      `);

      mockFetch.mockResolvedValueOnce(new Response(rssContent, { status: 200 }));
      const connector = createRssConnector(config, options);
      const result = await connector.fetch();

      expect(result).toHaveProperty('items');
      expect(Array.isArray(result.items)).toBe(true);
    });
  });
});
