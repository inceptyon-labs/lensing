import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAiNewsServer } from '../ai-news-server';
import type {
  AiNewsServerOptions,
  AiNewsData,
  DataBusInstance,
  NotificationQueueInstance,
} from '@lensing/types';

// ── Test helpers ─────────────────────────────────────────────────────────────

const RSS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test News</title>
    <item>
      <title>Headline One</title>
      <description>Description of headline one.</description>
      <link>https://example.com/1</link>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Headline Two</title>
      <description>Description of headline two.</description>
      <link>https://example.com/2</link>
      <pubDate>Mon, 01 Jan 2024 01:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

function makeFetchFn(xml = RSS_XML, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    statusText: ok ? 'OK' : 'Not Found',
    text: vi.fn().mockResolvedValue(xml),
  });
}

function makeSummarizeFn(summaries?: string[]) {
  return vi
    .fn()
    .mockResolvedValue(summaries ?? ['AI summary of headline one.', 'AI summary of headline two.']);
}

function makeDataBus(): DataBusInstance {
  return {
    publish: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
    getLatest: vi.fn(),
    getChannels: vi.fn(() => []),
    onMessage: vi.fn(() => vi.fn()),
    clear: vi.fn(),
    close: vi.fn(),
  };
}

function makeNotifications(): NotificationQueueInstance {
  return {
    emit: vi.fn(() => 'notif-1'),
    list: vi.fn(() => []),
    markRead: vi.fn(),
    dismiss: vi.fn(),
    clear: vi.fn(),
    emitSystemEvent: vi.fn(() => 'sys-1'),
    onNotification: vi.fn(() => vi.fn()),
    close: vi.fn(),
  };
}

function makeOptions(overrides: Partial<AiNewsServerOptions> = {}): AiNewsServerOptions {
  return {
    feedUrls: ['https://example.com/feed.rss'],
    dataBus: makeDataBus(),
    notifications: makeNotifications(),
    fetchFn: makeFetchFn(),
    summarize: makeSummarizeFn(),
    maxStale_ms: 0, // disable caching for tests
    ...overrides,
  };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('AI News Server', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ── Factory validation ──────────────────────────────────────────────────

  it('should throw if feedUrls is empty', () => {
    expect(() => createAiNewsServer(makeOptions({ feedUrls: [] }))).toThrow(
      'feedUrls is required and must not be empty'
    );
  });

  it('should throw if summarize is not provided', () => {
    expect(() => createAiNewsServer(makeOptions({ summarize: undefined as any }))).toThrow(
      'summarize function is required'
    );
  });

  it('should throw if maxItems is invalid', () => {
    expect(() => createAiNewsServer(makeOptions({ maxItems: 0 }))).toThrow(
      'maxItems must be a positive number'
    );
    expect(() => createAiNewsServer(makeOptions({ maxItems: NaN }))).toThrow(
      'maxItems must be a positive number'
    );
  });

  it('should create a valid server instance', () => {
    const server = createAiNewsServer(makeOptions());
    expect(server).toBeDefined();
    expect(typeof server.refresh).toBe('function');
    expect(typeof server.getData).toBe('function');
    expect(typeof server.onUpdate).toBe('function');
    expect(typeof server.onError).toBe('function');
    expect(typeof server.close).toBe('function');
  });

  // ── Initial state ──────────────────────────────────────────────────────

  it('should return null data before refresh', () => {
    const server = createAiNewsServer(makeOptions());
    expect(server.getData()).toBeNull();
  });

  // ── Refresh flow ───────────────────────────────────────────────────────

  it('should fetch RSS, summarize, and publish data on refresh', async () => {
    const opts = makeOptions();
    const server = createAiNewsServer(opts);

    const updateCallback = vi.fn();
    server.onUpdate(updateCallback);

    await server.refresh();

    // Should have fetched
    expect(opts.fetchFn).toHaveBeenCalledWith('https://example.com/feed.rss');

    // Should have called summarize with parsed articles
    expect(opts.summarize).toHaveBeenCalledWith([
      { title: 'Headline One', summary: 'Description of headline one.' },
      { title: 'Headline Two', summary: 'Description of headline two.' },
    ]);

    // Should have data
    const data = server.getData();
    expect(data).not.toBeNull();
    expect(data!.summaries).toHaveLength(2);
    expect(data!.summaries[0].title).toBe('Headline One');
    expect(data!.summaries[0].summary).toBe('AI summary of headline one.');
    expect(data!.summaries[1].summary).toBe('AI summary of headline two.');

    // Should have published to data bus
    expect(opts.dataBus.publish).toHaveBeenCalledWith(
      'ai-news.summaries',
      'ai-news-server',
      expect.objectContaining({ summaries: expect.any(Array) })
    );

    // Should have notified listeners
    expect(updateCallback).toHaveBeenCalledTimes(1);
  });

  it('should respect maxItems and trim articles', async () => {
    const summarize = vi.fn().mockResolvedValue(['summary1']);
    const server = createAiNewsServer(makeOptions({ maxItems: 1, summarize }));

    await server.refresh();

    // Only 1 article should be sent to summarize
    expect(summarize).toHaveBeenCalledWith([
      { title: 'Headline One', summary: 'Description of headline one.' },
    ]);

    const data = server.getData();
    expect(data!.summaries).toHaveLength(1);
  });

  // ── Error handling ─────────────────────────────────────────────────────

  it('should notify error when fetch fails', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('network down'));
    const server = createAiNewsServer(makeOptions({ fetchFn }));

    const errorCb = vi.fn();
    server.onError(errorCb);

    await server.refresh();

    expect(errorCb).toHaveBeenCalledWith(expect.stringContaining('network down'));
    expect(server.getData()).toBeNull();
  });

  it('should notify error when HTTP response is not ok', async () => {
    const fetchFn = makeFetchFn('', false, 404);
    const server = createAiNewsServer(makeOptions({ fetchFn }));

    const errorCb = vi.fn();
    server.onError(errorCb);

    await server.refresh();

    expect(errorCb).toHaveBeenCalledWith(expect.stringContaining('404'));
  });

  it('should notify error when summarize fails', async () => {
    const summarize = vi.fn().mockRejectedValue(new Error('LLM quota exceeded'));
    const server = createAiNewsServer(makeOptions({ summarize }));

    const errorCb = vi.fn();
    server.onError(errorCb);

    await server.refresh();

    expect(errorCb).toHaveBeenCalledWith(expect.stringContaining('LLM quota exceeded'));
    expect(server.getData()).toBeNull();
  });

  it('should fall back to original description if summarize returns fewer items', async () => {
    const summarize = vi.fn().mockResolvedValue(['only one summary']);
    const server = createAiNewsServer(makeOptions({ summarize }));

    await server.refresh();

    const data = server.getData()!;
    expect(data.summaries[0].summary).toBe('only one summary');
    expect(data.summaries[1].summary).toBe('Description of headline two.');
  });

  // ── Staleness / caching ────────────────────────────────────────────────

  it('should skip refresh when data is still fresh', async () => {
    const fetchFn = makeFetchFn();
    const server = createAiNewsServer(makeOptions({ fetchFn, maxStale_ms: 60_000 }));

    await server.refresh();
    expect(fetchFn).toHaveBeenCalledTimes(1);

    await server.refresh();
    expect(fetchFn).toHaveBeenCalledTimes(1); // should not re-fetch
  });

  // ── Close ──────────────────────────────────────────────────────────────

  it('should not refresh after close', async () => {
    const fetchFn = makeFetchFn();
    const server = createAiNewsServer(makeOptions({ fetchFn }));

    server.close();
    await server.refresh();

    expect(fetchFn).not.toHaveBeenCalled();
  });

  // ── Listener unsubscribe ───────────────────────────────────────────────

  it('should support unsubscribing update listeners', async () => {
    const server = createAiNewsServer(makeOptions());
    const cb = vi.fn();

    const unsub = server.onUpdate(cb);
    unsub();

    await server.refresh();
    expect(cb).not.toHaveBeenCalled();
  });

  // ── Concurrent refresh guard ──────────────────────────────────────────

  it('should guard against concurrent refreshes', async () => {
    const fetchFn = makeFetchFn();
    const server = createAiNewsServer(makeOptions({ fetchFn }));

    const p1 = server.refresh();
    const p2 = server.refresh();

    await Promise.all([p1, p2]);

    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  // ── Defensive copies ──────────────────────────────────────────────────

  it('should return defensive copies from getData', async () => {
    const server = createAiNewsServer(makeOptions());
    await server.refresh();

    const d1 = server.getData()!;
    const d2 = server.getData()!;
    expect(d1).not.toBe(d2);
    expect(d1.summaries[0]).not.toBe(d2.summaries[0]);
    expect(d1.summaries[0].title).toBe(d2.summaries[0].title);
  });

  // ── Multiple feeds ────────────────────────────────────────────────────

  it('should aggregate articles from multiple feeds', async () => {
    const feedUrls = ['https://feed1.com/rss', 'https://feed2.com/rss'];
    const summarize = vi.fn().mockResolvedValue(['s1', 's2', 's3', 's4']);

    const server = createAiNewsServer(makeOptions({ feedUrls, summarize, maxItems: 10 }));

    await server.refresh();

    // 2 articles per feed = 4 total
    expect(summarize).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ title: 'Headline One' })])
    );
    const data = server.getData()!;
    expect(data.summaries.length).toBe(4);
  });

  // ── Category mapping ──────────────────────────────────────────────────

  it('should apply category overrides from options', async () => {
    const categories = { 'https://example.com/feed.rss': 'technology' };
    const server = createAiNewsServer(makeOptions({ categories }));

    await server.refresh();

    const data = server.getData()!;
    expect(data.summaries[0].category).toBe('technology');
  });

  // ── Error listener isolation ──────────────────────────────────────────

  it('should isolate listener errors', async () => {
    const server = createAiNewsServer(makeOptions());
    server.onUpdate(() => {
      throw new Error('bad listener');
    });
    const goodCb = vi.fn();
    server.onUpdate(goodCb);

    await server.refresh();

    expect(goodCb).toHaveBeenCalledTimes(1);
  });
});
