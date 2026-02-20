import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createCryptoServer } from '../crypto-server';
import type {
  CryptoServerOptions,
  CryptoServerInstance,
  CryptoData,
  CoinPrice,
  CryptoAlertConfig,
  FetchFn,
  DataBusInstance,
  NotificationQueueInstance,
} from '@lensing/types';

// ── Mock helpers ───────────────────────────────────────────────────────────

function createMockDataBus(): DataBusInstance {
  return {
    publish: vi.fn(),
    subscribe: vi.fn(() => () => {}),
    getLatest: vi.fn(),
    getChannels: vi.fn(() => []),
    onMessage: vi.fn(() => () => {}),
    clear: vi.fn(),
    close: vi.fn(),
  };
}

function createMockNotifications(): NotificationQueueInstance {
  return {
    emit: vi.fn(() => 'notification-1'),
    list: vi.fn(() => []),
    markRead: vi.fn(),
    dismiss: vi.fn(),
    clear: vi.fn(),
    emitSystemEvent: vi.fn(() => 'system-event-1'),
    onNotification: vi.fn(() => () => {}),
    close: vi.fn(),
  };
}

function createMockFetch(response: unknown): FetchFn {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => response,
  } as any);
}

function createMockCoinGeckoResponse() {
  return [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      current_price: 50000,
      price_change_percentage_1h_in_currency: 0.5,
      price_change_percentage_24h_in_currency: 2.3,
      price_change_percentage_7d_in_currency: -1.2,
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      current_price: 3000,
      price_change_percentage_1h_in_currency: -0.2,
      price_change_percentage_24h_in_currency: 1.8,
      price_change_percentage_7d_in_currency: 5.1,
    },
  ];
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Crypto Server', () => {
  let dataBus: DataBusInstance;
  let notifications: NotificationQueueInstance;
  let server: CryptoServerInstance;

  beforeEach(() => {
    dataBus = createMockDataBus();
    notifications = createMockNotifications();
    vi.useFakeTimers();
  });

  afterEach(() => {
    server?.close();
    vi.useRealTimers();
  });

  function createServer(overrides: Partial<CryptoServerOptions> = {}): CryptoServerInstance {
    server = createCryptoServer({
      watchlist: ['bitcoin', 'ethereum'],
      dataBus,
      notifications,
      fetchFn: createMockFetch(createMockCoinGeckoResponse()),
      ...overrides,
    });
    return server;
  }

  describe('Configuration', () => {
    it('should require a non-empty watchlist', () => {
      expect(() => {
        createCryptoServer({
          watchlist: [],
          dataBus,
          notifications,
        });
      }).toThrow('watchlist');
    });

    it('should accept a valid watchlist', () => {
      const server = createServer();
      expect(server).toBeDefined();
    });

    it('should accept alertConfigs option', () => {
      const server = createServer({
        alertConfigs: [{ coinId: 'bitcoin', threshold_pct: 5, window: '24h' }],
      });
      expect(server).toBeDefined();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch and transform crypto data', async () => {
      const server = createServer();

      await server.refresh();

      const data = server.getPrices();
      expect(data).not.toBeNull();
      expect(data?.coins).toHaveLength(2);
      expect(data?.coins[0].id).toBe('bitcoin');
      expect(data?.coins[0].price).toBe(50000);
      expect(data?.coins[0].change_24h).toBeCloseTo(2.3);
    });

    it('should include all change windows', async () => {
      const server = createServer();

      await server.refresh();

      const btc = server.getPrices()?.coins[0];
      expect(btc?.change_1h).toBeCloseTo(0.5);
      expect(btc?.change_24h).toBeCloseTo(2.3);
      expect(btc?.change_7d).toBeCloseTo(-1.2);
    });

    it('should fetch from correct CoinGecko endpoint', async () => {
      const fetchFn = createMockFetch(createMockCoinGeckoResponse());
      const server = createServer({ fetchFn });

      await server.refresh();

      expect(fetchFn).toHaveBeenCalled();
      const url = (fetchFn as any).mock.calls[0][0];
      expect(url).toContain('bitcoin');
      expect(url).toContain('ethereum');
      expect(url).toContain('vs_currency=usd');
    });

    it('should handle fetch errors gracefully', async () => {
      const fetchFn = vi.fn().mockRejectedValue(new Error('Network error'));
      const onError = vi.fn();
      const server = createServer({ fetchFn });
      server.onError(onError);

      await server.refresh();

      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0]).toContain('Network error');
    });

    it('should handle HTTP error responses', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
      } as any);
      const onError = vi.fn();
      const server = createServer({ fetchFn });
      server.onError(onError);

      await server.refresh();

      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0]).toContain('429');
    });

    it('should handle malformed JSON responses', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as any);
      const onError = vi.fn();
      const server = createServer({ fetchFn });
      server.onError(onError);

      await server.refresh();

      expect(onError).toHaveBeenCalled();
    });

    it('should handle non-array response', async () => {
      const fetchFn = createMockFetch({ error: 'bad request' });
      const onError = vi.fn();
      const server = createServer({ fetchFn });
      server.onError(onError);

      await server.refresh();

      expect(onError).toHaveBeenCalled();
    });

    it('should handle NaN price values gracefully', async () => {
      const fetchFn = createMockFetch([
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: NaN,
          price_change_percentage_1h_in_currency: null,
          price_change_percentage_24h_in_currency: undefined,
          price_change_percentage_7d_in_currency: 'bad',
        },
      ]);
      const server = createServer({ fetchFn });

      await server.refresh();

      const data = server.getPrices();
      expect(data?.coins[0].price).toBe(0);
      expect(data?.coins[0].change_1h).toBe(0);
      expect(data?.coins[0].change_24h).toBe(0);
      expect(data?.coins[0].change_7d).toBe(0);
    });
  });

  describe('Data Bus Publishing', () => {
    it('should publish prices to data bus', async () => {
      const server = createServer();

      await server.refresh();

      expect((dataBus.publish as any).mock.calls.length).toBeGreaterThan(0);
      const publishCall = (dataBus.publish as any).mock.calls[0];
      expect(publishCall[0]).toBe('crypto.prices');
    });

    it('should include coin data in publication', async () => {
      const server = createServer();

      await server.refresh();

      const publishCall = (dataBus.publish as any).mock.calls[0];
      const data = publishCall[2] as CryptoData;
      expect(data.coins).toHaveLength(2);
      expect(data.coins[0].id).toBe('bitcoin');
    });

    it('should not corrupt internal cache when published data is mutated', async () => {
      let publishedData: any;
      const mockDataBus = createMockDataBus();
      (mockDataBus.publish as any).mockImplementation(
        (_channel: string, _source: string, data: any) => {
          publishedData = data;
        }
      );

      const server = createCryptoServer({
        watchlist: ['bitcoin', 'ethereum'],
        dataBus: mockDataBus,
        notifications,
        fetchFn: createMockFetch(createMockCoinGeckoResponse()),
      });

      await server.refresh();

      publishedData.coins[0].price = 999999;

      const cached = server.getPrices();
      expect(cached?.coins[0].price).toBe(50000);

      server.close();
    });
  });

  describe('Alert Notifications', () => {
    it('should emit alert when change exceeds threshold', async () => {
      const fetchFn = createMockFetch([
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 50000,
          price_change_percentage_1h_in_currency: 0,
          price_change_percentage_24h_in_currency: 8.5,
          price_change_percentage_7d_in_currency: 0,
        },
      ]);
      const server = createServer({
        watchlist: ['bitcoin'],
        fetchFn,
        alertConfigs: [{ coinId: 'bitcoin', threshold_pct: 5, window: '24h' }],
      });

      await server.refresh();

      expect((notifications.emit as any).mock.calls.length).toBeGreaterThan(0);
    });

    it('should not emit alert when change is below threshold', async () => {
      const fetchFn = createMockFetch([
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 50000,
          price_change_percentage_1h_in_currency: 0,
          price_change_percentage_24h_in_currency: 2.0,
          price_change_percentage_7d_in_currency: 0,
        },
      ]);
      const server = createServer({
        watchlist: ['bitcoin'],
        fetchFn,
        alertConfigs: [{ coinId: 'bitcoin', threshold_pct: 5, window: '24h' }],
      });

      await server.refresh();

      expect((notifications.emit as any).mock.calls.length).toBe(0);
    });

    it('should emit alert for negative changes exceeding threshold', async () => {
      const fetchFn = createMockFetch([
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 45000,
          price_change_percentage_1h_in_currency: 0,
          price_change_percentage_24h_in_currency: -7.0,
          price_change_percentage_7d_in_currency: 0,
        },
      ]);
      const server = createServer({
        watchlist: ['bitcoin'],
        fetchFn,
        alertConfigs: [{ coinId: 'bitcoin', threshold_pct: 5, window: '24h' }],
      });

      await server.refresh();

      expect((notifications.emit as any).mock.calls.length).toBeGreaterThan(0);
    });

    it('should publish alerts to crypto.alerts channel', async () => {
      const fetchFn = createMockFetch([
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 50000,
          price_change_percentage_1h_in_currency: 0,
          price_change_percentage_24h_in_currency: 10.0,
          price_change_percentage_7d_in_currency: 0,
        },
      ]);
      const server = createServer({
        watchlist: ['bitcoin'],
        fetchFn,
        alertConfigs: [{ coinId: 'bitcoin', threshold_pct: 5, window: '24h' }],
      });

      await server.refresh();

      const alertPublish = (dataBus.publish as any).mock.calls.find(
        (c: any[]) => c[0] === 'crypto.alerts'
      );
      expect(alertPublish).toBeDefined();
    });
  });

  describe('Callbacks', () => {
    it('should call onUpdate when data arrives', async () => {
      const onUpdate = vi.fn();
      const server = createServer();
      server.onUpdate(onUpdate);

      await server.refresh();

      expect(onUpdate).toHaveBeenCalled();
      const data = onUpdate.mock.calls[0][0] as CryptoData;
      expect(data.coins[0].id).toBe('bitcoin');
    });

    it('should isolate callback errors', async () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Callback error');
      });
      const server = createServer();
      server.onUpdate(errorCallback);

      expect(() => server.refresh()).not.toThrow();
    });

    it('should return unsubscribe function from onUpdate', async () => {
      const onUpdate = vi.fn();
      const server = createServer();
      const unsubscribe = server.onUpdate(onUpdate);

      unsubscribe();
      await server.refresh();

      expect(onUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Caching', () => {
    it('should not refetch if cache is fresh', async () => {
      const fetchFn = createMockFetch(createMockCoinGeckoResponse());
      const server = createServer({ fetchFn, maxStale_ms: 300000 });

      await server.refresh();
      expect(fetchFn).toHaveBeenCalledTimes(1);

      await server.refresh();
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('should refetch if cache is stale', async () => {
      const fetchFn = createMockFetch(createMockCoinGeckoResponse());
      const server = createServer({ fetchFn, maxStale_ms: 1000 });

      await server.refresh();
      expect(fetchFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(2000);
      await server.refresh();
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('should return null until first fetch', () => {
      const server = createServer();
      expect(server.getPrices()).toBeNull();
    });
  });

  describe('Lifecycle', () => {
    it('should close cleanly', () => {
      const server = createServer();
      expect(() => server.close()).not.toThrow();
    });

    it('should ignore refresh after close', async () => {
      const fetchFn = createMockFetch(createMockCoinGeckoResponse());
      const server = createServer({ fetchFn });

      server.close();
      await server.refresh();

      expect(fetchFn).not.toHaveBeenCalled();
    });
  });

  describe('Concurrency', () => {
    it('should not make concurrent fetch calls when refresh is already in flight', async () => {
      let resolveFetch!: (val: any) => void;
      const fetchFn = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve;
          }),
      );

      const server = createServer({ fetchFn, maxStale_ms: 0 });

      // Start first refresh (in-flight, not awaited)
      const p1 = server.refresh();

      // Second refresh should detect in-flight and skip
      const p2 = server.refresh();

      // Resolve the pending fetch
      resolveFetch({
        ok: true,
        status: 200,
        json: async () => createMockCoinGeckoResponse(),
      });

      await Promise.all([p1, p2]);

      expect(fetchFn).toHaveBeenCalledTimes(1);
    });
  });
});
