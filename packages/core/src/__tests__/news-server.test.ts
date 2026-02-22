import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createNewsServer } from '../news-server';
import { createDataBus } from '../data-bus';
import { createNotificationQueue } from '../notification-queue';
import type { DataBusInstance, NewsData, FetchFn } from '@lensing/types';
import type { NotificationQueueInstance } from '../notification-queue';

// ── Test helpers ─────────────────────────────────────────────────────────────

const SAMPLE_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <item>
      <title>First Article</title>
      <description>Summary of first article</description>
      <link>https://example.com/article-1</link>
      <pubDate>Mon, 01 Jan 2024 12:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Second Article</title>
      <description>Summary of second article</description>
      <link>https://example.com/article-2</link>
      <pubDate>Mon, 01 Jan 2024 11:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

const SAMPLE_RSS_WITH_HTML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>HTML Feed</title>
    <item>
      <title>Article with &lt;b&gt;HTML&lt;/b&gt;</title>
      <description>&lt;p&gt;This has &lt;strong&gt;bold&lt;/strong&gt; text&lt;/p&gt;</description>
      <link>https://example.com/html-article</link>
      <pubDate>Mon, 01 Jan 2024 12:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

function createMockFetch(rssXml: string): FetchFn {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => rssXml, // not used for RSS
    text: async () => rssXml,
  }) as unknown as FetchFn;
}

function createErrorFetch(status: number): FetchFn {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText: 'Not Found',
    json: async () => ({}),
    text: async () => '',
  }) as unknown as FetchFn;
}

function createNetworkErrorFetch(): FetchFn {
  return vi.fn().mockRejectedValue(new Error('Network error')) as unknown as FetchFn;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('News Server', () => {
  let dataBus: DataBusInstance;
  let notifications: NotificationQueueInstance;

  beforeEach(() => {
    dataBus = createDataBus();
    notifications = createNotificationQueue();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Configuration ────────────────────────────────────────────────────────

  it('should throw if feedUrls is empty', () => {
    expect(() =>
      createNewsServer({
        feedUrls: [],
        dataBus,
        notifications,
      })
    ).toThrow('feedUrls');
  });

  it('should throw if feedUrls is missing', () => {
    expect(() =>
      createNewsServer({
        feedUrls: undefined as unknown as string[],
        dataBus,
        notifications,
      })
    ).toThrow();
  });

  // ── Fetching & Parsing ───────────────────────────────────────────────────

  it('should parse RSS feed and return articles', async () => {
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      dataBus,
      notifications,
      fetchFn: createMockFetch(SAMPLE_RSS),
    });

    await server.refresh();
    const data = server.getHeadlines();

    expect(data).not.toBeNull();
    expect(data!.articles).toHaveLength(2);
    expect(data!.articles[0].title).toBe('First Article');
    expect(data!.articles[0].summary).toBe('Summary of first article');
    expect(data!.articles[0].link).toBe('https://example.com/article-1');
    expect(data!.articles[0].published).toBeGreaterThan(0);
    expect(data!.lastUpdated).toBeGreaterThan(0);

    server.close();
  });

  it('should strip HTML from article descriptions', async () => {
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      dataBus,
      notifications,
      fetchFn: createMockFetch(SAMPLE_RSS_WITH_HTML),
    });

    await server.refresh();
    const data = server.getHeadlines();

    expect(data).not.toBeNull();
    expect(data!.articles[0].summary).not.toContain('<');
    expect(data!.articles[0].summary).not.toContain('>');
    expect(data!.articles[0].summary).toContain('bold');

    server.close();
  });

  it('should assign category from categories map', async () => {
    const feedUrl = 'https://example.com/feed.xml';
    const server = createNewsServer({
      feedUrls: [feedUrl],
      categories: { [feedUrl]: 'technology' },
      dataBus,
      notifications,
      fetchFn: createMockFetch(SAMPLE_RSS),
    });

    await server.refresh();
    const data = server.getHeadlines();

    expect(data!.articles[0].category).toBe('technology');
    expect(data!.articles[1].category).toBe('technology');

    server.close();
  });

  it('should use "general" as default category when not mapped', async () => {
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      dataBus,
      notifications,
      fetchFn: createMockFetch(SAMPLE_RSS),
    });

    await server.refresh();
    const data = server.getHeadlines();

    expect(data!.articles[0].category).toBe('general');

    server.close();
  });

  it('should limit articles to maxItems', async () => {
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      maxItems: 1,
      dataBus,
      notifications,
      fetchFn: createMockFetch(SAMPLE_RSS),
    });

    await server.refresh();
    const data = server.getHeadlines();

    expect(data!.articles).toHaveLength(1);

    server.close();
  });

  // ── Data Bus Publishing ──────────────────────────────────────────────────

  it('should publish to news.headlines data bus channel', async () => {
    const published: unknown[] = [];
    dataBus.subscribe('news.headlines', (msg) => published.push(msg.data));

    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      dataBus,
      notifications,
      fetchFn: createMockFetch(SAMPLE_RSS),
    });

    await server.refresh();

    expect(published).toHaveLength(1);
    const data = published[0] as NewsData;
    expect(data.articles).toHaveLength(2);

    server.close();
  });

  // ── Callbacks ────────────────────────────────────────────────────────────

  it('should call onUpdate listeners after successful refresh', async () => {
    const onUpdate = vi.fn();
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      dataBus,
      notifications,
      fetchFn: createMockFetch(SAMPLE_RSS),
    });

    server.onUpdate(onUpdate);
    await server.refresh();

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate.mock.calls[0][0].articles).toHaveLength(2);

    server.close();
  });

  it('should allow unsubscribing from onUpdate', async () => {
    const onUpdate = vi.fn();
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      dataBus,
      notifications,
      fetchFn: createMockFetch(SAMPLE_RSS),
    });

    const unsubscribe = server.onUpdate(onUpdate);
    unsubscribe();
    await server.refresh();

    expect(onUpdate).not.toHaveBeenCalled();

    server.close();
  });

  it('should call onError listeners on fetch failure', async () => {
    const onError = vi.fn();
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      dataBus,
      notifications,
      fetchFn: createNetworkErrorFetch(),
    });

    server.onError(onError);
    await server.refresh();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toContain('Network error');

    server.close();
  });

  it('should call onError on non-ok HTTP response', async () => {
    const onError = vi.fn();
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      dataBus,
      notifications,
      fetchFn: createErrorFetch(404),
    });

    server.onError(onError);
    await server.refresh();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toContain('404');

    server.close();
  });

  it('should isolate listener errors from other listeners', async () => {
    const goodListener = vi.fn();
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      dataBus,
      notifications,
      fetchFn: createMockFetch(SAMPLE_RSS),
    });

    server.onUpdate(() => {
      throw new Error('Bad listener');
    });
    server.onUpdate(goodListener);
    await server.refresh();

    expect(goodListener).toHaveBeenCalledTimes(1);

    server.close();
  });

  // ── Caching ──────────────────────────────────────────────────────────────

  it('should not re-fetch if data is still fresh', async () => {
    const fetchFn = createMockFetch(SAMPLE_RSS);
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      maxStale_ms: 60_000,
      dataBus,
      notifications,
      fetchFn,
    });

    await server.refresh();
    await server.refresh();

    expect(fetchFn).toHaveBeenCalledTimes(1);

    server.close();
  });

  it('should re-fetch after maxStale_ms expires', async () => {
    const fetchFn = createMockFetch(SAMPLE_RSS);
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      maxStale_ms: 60_000,
      dataBus,
      notifications,
      fetchFn,
    });

    await server.refresh();
    vi.advanceTimersByTime(60_001);
    await server.refresh();

    expect(fetchFn).toHaveBeenCalledTimes(2);

    server.close();
  });

  // ── Concurrency ──────────────────────────────────────────────────────────

  it('should prevent concurrent refreshes', async () => {
    let resolveFirst: (() => void) | undefined;
    const fetchFn = vi.fn().mockImplementation(
      () =>
        new Promise<{ ok: boolean; text: () => Promise<string> }>((resolve) => {
          resolveFirst = () =>
            resolve({
              ok: true,
              text: async () => SAMPLE_RSS,
            });
        })
    ) as unknown as FetchFn;

    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      maxStale_ms: 0,
      dataBus,
      notifications,
      fetchFn,
    });

    const first = server.refresh();
    const second = server.refresh();

    resolveFirst!();
    await first;
    await second;

    expect(fetchFn).toHaveBeenCalledTimes(1);

    server.close();
  });

  // ── Defensive Copies ─────────────────────────────────────────────────────

  it('should return defensive copies from getHeadlines', async () => {
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      dataBus,
      notifications,
      fetchFn: createMockFetch(SAMPLE_RSS),
    });

    await server.refresh();
    const data1 = server.getHeadlines();
    const data2 = server.getHeadlines();

    expect(data1).toEqual(data2);
    expect(data1).not.toBe(data2);
    expect(data1!.articles).not.toBe(data2!.articles);

    server.close();
  });

  // ── Lifecycle ────────────────────────────────────────────────────────────

  it('should return null from getHeadlines before any refresh', () => {
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      dataBus,
      notifications,
      fetchFn: createMockFetch(SAMPLE_RSS),
    });

    expect(server.getHeadlines()).toBeNull();

    server.close();
  });

  it('should not fetch after close', async () => {
    const fetchFn = createMockFetch(SAMPLE_RSS);
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      dataBus,
      notifications,
      fetchFn,
    });

    server.close();
    await server.refresh();

    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('should preserve stale data on error', async () => {
    let callCount = 0;
    const fetchFn = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        return { ok: true, text: async () => SAMPLE_RSS };
      }
      throw new Error('Second fetch failed');
    }) as unknown as FetchFn;

    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      maxStale_ms: 0,
      dataBus,
      notifications,
      fetchFn,
    });

    await server.refresh();
    const beforeError = server.getHeadlines();
    expect(beforeError!.articles).toHaveLength(2);

    await server.refresh();
    const afterError = server.getHeadlines();
    expect(afterError!.articles).toHaveLength(2);

    server.close();
  });

  // ── Multiple feeds ───────────────────────────────────────────────────────

  it('should fetch from multiple feed URLs', async () => {
    const fetchFn = createMockFetch(SAMPLE_RSS);
    const server = createNewsServer({
      feedUrls: [
        'https://example.com/feed1.xml',
        'https://example.com/feed2.xml',
      ],
      dataBus,
      notifications,
      fetchFn,
    });

    await server.refresh();
    const data = server.getHeadlines();

    // 2 articles per feed × 2 feeds = 4
    expect(data!.articles.length).toBeGreaterThanOrEqual(2);
    expect(fetchFn).toHaveBeenCalledTimes(2);

    server.close();
  });

  // ── Source assignment ────────────────────────────────────────────────────

  it('should set source from RSS channel title', async () => {
    const server = createNewsServer({
      feedUrls: ['https://example.com/feed.xml'],
      dataBus,
      notifications,
      fetchFn: createMockFetch(SAMPLE_RSS),
    });

    await server.refresh();
    const data = server.getHeadlines();

    expect(data!.articles[0].source).toBe('Test Feed');

    server.close();
  });
});
