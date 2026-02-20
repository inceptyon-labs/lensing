import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createAllergiesServer } from '../allergies-server';
import type {
  AllergiesServerOptions,
  AllergiesServerInstance,
  AllergyData,
  AllergyLocation,
  FetchFn,
} from '@lensing/types';
import type { DataBusInstance, NotificationQueueInstance } from '@lensing/types';

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

function createMockAllergyResponse() {
  return {
    current: {
      idx: 2,
      allergens: [
        { name: 'Grass Pollen', level: 2, category: 'pollen' },
        { name: 'Ragweed', level: 1, category: 'pollen' },
      ],
    },
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Allergies Server', () => {
  let dataBus: DataBusInstance;
  let notifications: NotificationQueueInstance;
  let server: AllergiesServerInstance;
  const location: AllergyLocation = { lat: 37.7749, lon: -122.4194 };

  beforeEach(() => {
    dataBus = createMockDataBus();
    notifications = createMockNotifications();
    vi.useFakeTimers();
  });

  afterEach(() => {
    server?.close();
    vi.useRealTimers();
  });

  function createServer(overrides: Partial<AllergiesServerOptions> = {}): AllergiesServerInstance {
    server = createAllergiesServer({
      apiKey: 'test-key',
      location,
      dataBus,
      notifications,
      fetchFn: createMockFetch(createMockAllergyResponse()),
      ...overrides,
    });
    return server;
  }

  describe('Configuration', () => {
    it('should require apiKey', () => {
      expect(() => {
        createAllergiesServer({
          apiKey: '',
          location,
          dataBus,
          notifications,
        });
      }).toThrow('apiKey is required');
    });

    it('should require location', () => {
      expect(() => {
        createAllergiesServer({
          apiKey: 'test',
          location: {} as any,
          dataBus,
          notifications,
        });
      }).toThrow('location is required');
    });

    it('should accept lat=0 (equator) as valid location', () => {
      expect(() => {
        createAllergiesServer({
          apiKey: 'test',
          location: { lat: 0, lon: -122.4194 },
          dataBus,
          notifications,
          fetchFn: createMockFetch(createMockAllergyResponse()),
        });
      }).not.toThrow();
    });

    it('should accept alertThreshold option', () => {
      const server = createServer({ alertThreshold: 4 });
      expect(server).toBeDefined();
      server.close();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch and transform allergy data', async () => {
      const fetchFn = createMockFetch(createMockAllergyResponse());
      const server = createServer({ fetchFn });

      await server.refresh();

      const data = server.getAllergyData();
      expect(data).not.toBeNull();
      expect(data?.index).toBe(2);
      expect(data?.allergens).toHaveLength(2);
      expect(data?.allergens[0].name).toBe('Grass Pollen');
    });

    it('should fetch from correct API endpoint', async () => {
      const fetchFn = createMockFetch(createMockAllergyResponse());
      const server = createServer({ fetchFn });

      await server.refresh();

      expect(fetchFn).toHaveBeenCalled();
      const url = (fetchFn as any).mock.calls[0][0];
      expect(url).toContain('37.7749');
      expect(url).toContain('-122.4194');
      expect(url).toContain('test-key');
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
        status: 401,
        statusText: 'Unauthorized',
      } as any);
      const onError = vi.fn();
      const server = createServer({ fetchFn });
      server.onError(onError);

      await server.refresh();

      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0]).toContain('401');
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
  });

  describe('Data Bus Publishing', () => {
    it('should publish allergy data to data bus', async () => {
      const server = createServer();

      await server.refresh();

      expect((dataBus.publish as any).mock.calls.length).toBeGreaterThan(0);
      const publishCall = (dataBus.publish as any).mock.calls[0];
      expect(publishCall[0]).toBe('allergies.current');
    });

    it('should include allergen data in publication', async () => {
      const server = createServer();

      await server.refresh();

      const publishCall = (dataBus.publish as any).mock.calls[0];
      const data = publishCall[2];
      expect(data.index).toBe(2);
      expect(data.allergens).toBeDefined();
    });
  });

  describe('Alert Notifications', () => {
    it('should emit alert when index exceeds threshold', async () => {
      const fetchFn = createMockFetch({
        current: {
          idx: 4,
          allergens: [{ name: 'Pollen', level: 4, category: 'pollen' }],
        },
      });
      const server = createServer({ fetchFn, alertThreshold: 3 });

      await server.refresh();

      expect((notifications.emit as any).mock.calls.length).toBeGreaterThan(0);
    });

    it('should not emit alert when index below threshold', async () => {
      const fetchFn = createMockFetch({
        current: {
          idx: 2,
          allergens: [{ name: 'Pollen', level: 2, category: 'pollen' }],
        },
      });
      const server = createServer({ fetchFn, alertThreshold: 3 });

      await server.refresh();

      expect((notifications.emit as any).mock.calls.length).toBe(0);
    });

    it('should use default alert threshold of 3', async () => {
      const fetchFn = createMockFetch({
        current: {
          idx: 3,
          allergens: [{ name: 'Pollen', level: 3, category: 'pollen' }],
        },
      });
      const server = createServer({ fetchFn }); // no alertThreshold

      await server.refresh();

      // idx=3, default threshold=3, should trigger
      expect((notifications.emit as any).mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe('Callbacks', () => {
    it('should call onUpdate when data arrives', async () => {
      const onUpdate = vi.fn();
      const server = createServer();
      server.onUpdate(onUpdate);

      await server.refresh();

      expect(onUpdate).toHaveBeenCalled();
      const data = onUpdate.mock.calls[0][0];
      expect(data.index).toBe(2);
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

      // After unsubscribe, onUpdate should not be called again
      expect(onUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Caching', () => {
    it('should not refetch if cache is fresh', async () => {
      const fetchFn = createMockFetch(createMockAllergyResponse());
      const server = createServer({ fetchFn, maxStale_ms: 3600000 });

      await server.refresh();
      expect(fetchFn).toHaveBeenCalledTimes(1);

      await server.refresh();
      expect(fetchFn).toHaveBeenCalledTimes(1); // no second call
    });

    it('should refetch if cache is stale', async () => {
      const fetchFn = createMockFetch(createMockAllergyResponse());
      const server = createServer({ fetchFn, maxStale_ms: 1000 });

      await server.refresh();
      expect(fetchFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(2000);
      await server.refresh();
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('should return null until first fetch', () => {
      const server = createServer();
      expect(server.getAllergyData()).toBeNull();
    });
  });

  describe('Lifecycle', () => {
    it('should close cleanly', () => {
      const server = createServer();
      expect(() => server.close()).not.toThrow();
    });

    it('should ignore refresh after close', async () => {
      const fetchFn = createMockFetch(createMockAllergyResponse());
      const server = createServer({ fetchFn });

      server.close();
      await server.refresh();

      expect(fetchFn).not.toHaveBeenCalled();
    });
  });
});
