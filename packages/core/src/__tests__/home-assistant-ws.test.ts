import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHomeAssistantServer } from '../home-assistant-server';
import { createDataBus } from '../data-bus';
import { createNotificationQueue } from '../notification-queue';
import type {
  DataBusInstance,
  FetchFn,
  HomeAssistantData,
  WsFactory,
  WsLike,
} from '@lensing/types';
import type { NotificationQueueInstance } from '../notification-queue';

// ── WS mock helpers ───────────────────────────────────────────────────────────

interface MockWs extends WsLike {
  _simulateOpen(): void;
  _simulateMessage(data: unknown): void;
  _simulateClose(code?: number, reason?: string): void;
  _simulateError(): void;
  _sentMessages: unknown[];
}

function createMockWs(): MockWs {
  const sentMessages: unknown[] = [];

  const ws: MockWs = {
    onopen: null,
    onmessage: null,
    onclose: null,
    onerror: null,
    readyState: 0, // CONNECTING
    _sentMessages: sentMessages,

    send(data: string): void {
      sentMessages.push(JSON.parse(data));
    },

    close(): void {
      ws.readyState = 3; // CLOSED
      ws.onclose?.({ code: 1000, reason: 'normal' });
    },

    _simulateOpen(): void {
      ws.readyState = 1; // OPEN
      ws.onopen?.();
    },

    _simulateMessage(data: unknown): void {
      ws.onmessage?.({ data: JSON.stringify(data) });
    },

    _simulateClose(code = 1000, reason = ''): void {
      ws.readyState = 3; // CLOSED
      ws.onclose?.({ code, reason });
    },

    _simulateError(): void {
      ws.onerror?.(new Error('WS error'));
    },
  };

  return ws;
}

function createMockFetch(responseData: unknown = []): FetchFn {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => responseData,
  }) as unknown as FetchFn;
}

// Simulate complete HA WS auth + subscribe handshake
function doHaHandshake(ws: MockWs, _token: string): void {
  ws._simulateOpen();
  ws._simulateMessage({ type: 'auth_required' });
  // Server should have sent auth message; now send auth_ok
  ws._simulateMessage({ type: 'auth_ok', ha_version: '2024.1.0' });
  // Server should have sent subscribe_events; confirm subscription
  ws._simulateMessage({ type: 'result', id: 1, success: true });
}

const HA_URL = 'http://homeassistant.local:8123';
const HA_TOKEN = 'test-token';

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Home Assistant Server — WebSocket', () => {
  let dataBus: DataBusInstance;
  let notifications: NotificationQueueInstance;
  let mockWs: MockWs;
  let wsFn: WsFactory;

  beforeEach(() => {
    dataBus = createDataBus();
    notifications = createNotificationQueue();
    mockWs = createMockWs();
    wsFn = vi.fn().mockReturnValue(mockWs);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Connection ────────────────────────────────────────────────────────────────

  it('should connect to ws url derived from http url', () => {
    createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch(),
      wsFn,
    });

    expect(wsFn).toHaveBeenCalledOnce();
    const wsUrl = (wsFn as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(wsUrl).toMatch(/^ws:\/\//);
    expect(wsUrl).toContain('homeassistant.local:8123');
    expect(wsUrl).toContain('/api/websocket');
  });

  it('should convert https url to wss url', () => {
    createHomeAssistantServer({
      url: 'https://ha.example.com',
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch(),
      wsFn,
    });

    const wsUrl = (wsFn as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(wsUrl).toMatch(/^wss:\/\//);
  });

  // ── Auth handshake ────────────────────────────────────────────────────────────

  it('should send auth message with token after receiving auth_required', () => {
    createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch(),
      wsFn,
    });

    mockWs._simulateOpen();
    mockWs._simulateMessage({ type: 'auth_required' });

    const authMsg = mockWs._sentMessages.find(
      (m): m is { type: string; access_token: string } =>
        typeof m === 'object' && m !== null && (m as { type: string }).type === 'auth'
    );
    expect(authMsg).toBeDefined();
    expect(authMsg!.access_token).toBe(HA_TOKEN);
  });

  it('should subscribe to state_changed events after auth_ok', () => {
    createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch(),
      wsFn,
    });

    mockWs._simulateOpen();
    mockWs._simulateMessage({ type: 'auth_required' });
    mockWs._simulateMessage({ type: 'auth_ok' });

    const subscribeMsg = mockWs._sentMessages.find(
      (m): m is { type: string; event_type: string } =>
        typeof m === 'object' && m !== null && (m as { type: string }).type === 'subscribe_events'
    );
    expect(subscribeMsg).toBeDefined();
    expect(subscribeMsg!.event_type).toBe('state_changed');
  });

  it('should call onError when auth_invalid is received', () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch(),
      wsFn,
    });

    const errors: string[] = [];
    server.onError((e) => errors.push(e));

    mockWs._simulateOpen();
    mockWs._simulateMessage({ type: 'auth_required' });
    mockWs._simulateMessage({ type: 'auth_invalid', message: 'Invalid access token' });

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/auth/i);
  });

  // ── State change events ───────────────────────────────────────────────────────

  it('should update device state when state_changed event is received', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([
        {
          entity_id: 'light.living_room',
          state: 'off',
          attributes: { friendly_name: 'Living Room' },
          last_changed: '2026-02-23T06:00:00.000Z',
          last_updated: '2026-02-23T06:00:00.000Z',
        },
      ]),
      wsFn,
    });

    // Do initial REST fetch
    await server.refresh();

    // Complete WS handshake
    doHaHandshake(mockWs, HA_TOKEN);

    // Simulate state_changed event: light turns on
    mockWs._simulateMessage({
      type: 'event',
      event: {
        event_type: 'state_changed',
        data: {
          entity_id: 'light.living_room',
          new_state: {
            entity_id: 'light.living_room',
            state: 'on',
            attributes: { friendly_name: 'Living Room', brightness: 200 },
            last_changed: '2026-02-23T07:00:00.000Z',
            last_updated: '2026-02-23T07:00:00.000Z',
          },
        },
      },
    });

    const data = server.getData()!;
    const light = data.devices.find((e) => e.entity_id === 'light.living_room');
    expect(light).toBeDefined();
    expect(light!.state).toBe('on');
    expect(light!.attributes.brightness).toBe(200);
  });

  it('should call onUpdate listeners when state_changed updates an entity', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([
        {
          entity_id: 'switch.fan',
          state: 'off',
          attributes: { friendly_name: 'Fan' },
          last_changed: '2026-02-23T06:00:00.000Z',
          last_updated: '2026-02-23T06:00:00.000Z',
        },
      ]),
      wsFn,
    });

    await server.refresh();
    doHaHandshake(mockWs, HA_TOKEN);

    const updates: HomeAssistantData[] = [];
    server.onUpdate((d) => updates.push(d));

    mockWs._simulateMessage({
      type: 'event',
      event: {
        event_type: 'state_changed',
        data: {
          entity_id: 'switch.fan',
          new_state: {
            entity_id: 'switch.fan',
            state: 'on',
            attributes: { friendly_name: 'Fan' },
            last_changed: '2026-02-23T07:00:00.000Z',
            last_updated: '2026-02-23T07:00:00.000Z',
          },
        },
      },
    });

    expect(updates).toHaveLength(1);
    expect(updates[0].devices.find((e) => e.entity_id === 'switch.fan')?.state).toBe('on');
  });

  it('should re-publish to data bus when state_changed updates an entity', async () => {
    const publishSpy = vi.spyOn(dataBus, 'publish');

    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([
        {
          entity_id: 'lock.front_door',
          state: 'locked',
          attributes: { friendly_name: 'Front Door' },
          last_changed: '2026-02-23T06:00:00.000Z',
          last_updated: '2026-02-23T06:00:00.000Z',
        },
      ]),
      wsFn,
    });

    await server.refresh();
    publishSpy.mockClear();

    doHaHandshake(mockWs, HA_TOKEN);

    mockWs._simulateMessage({
      type: 'event',
      event: {
        event_type: 'state_changed',
        data: {
          entity_id: 'lock.front_door',
          new_state: {
            entity_id: 'lock.front_door',
            state: 'unlocked',
            attributes: { friendly_name: 'Front Door' },
            last_changed: '2026-02-23T07:00:00.000Z',
            last_updated: '2026-02-23T07:00:00.000Z',
          },
        },
      },
    });

    const calls = publishSpy.mock.calls;
    const deviceCall = calls.find((c) => c[0] === 'home.devices');
    expect(deviceCall).toBeDefined();
  });

  it('should add new entities from state_changed if they appear for the first time', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([]),
      wsFn,
    });

    await server.refresh();
    doHaHandshake(mockWs, HA_TOKEN);

    mockWs._simulateMessage({
      type: 'event',
      event: {
        event_type: 'state_changed',
        data: {
          entity_id: 'light.new_light',
          new_state: {
            entity_id: 'light.new_light',
            state: 'on',
            attributes: { friendly_name: 'New Light' },
            last_changed: '2026-02-23T07:00:00.000Z',
            last_updated: '2026-02-23T07:00:00.000Z',
          },
        },
      },
    });

    const data = server.getData()!;
    expect(data.devices.some((e) => e.entity_id === 'light.new_light')).toBe(true);
  });

  it('should ignore state_changed for null new_state (entity removed)', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([]),
      wsFn,
    });

    await server.refresh();
    doHaHandshake(mockWs, HA_TOKEN);

    // Should not throw when new_state is null
    expect(() => {
      mockWs._simulateMessage({
        type: 'event',
        event: {
          event_type: 'state_changed',
          data: {
            entity_id: 'light.removed',
            new_state: null,
          },
        },
      });
    }).not.toThrow();
  });

  // ── Auto-reconnect ────────────────────────────────────────────────────────────

  it('should reconnect when WS closes unexpectedly', () => {
    createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch(),
      wsFn,
    });

    doHaHandshake(mockWs, HA_TOKEN);

    // Simulate unexpected close (non-1000 code)
    const secondWs = createMockWs();
    (wsFn as ReturnType<typeof vi.fn>).mockReturnValue(secondWs);
    mockWs._simulateClose(1006, 'Connection dropped');

    // Advance timer to trigger reconnect
    vi.advanceTimersByTime(3000);

    expect(wsFn).toHaveBeenCalledTimes(2);
  });

  it('should NOT reconnect when closed by close()', () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch(),
      wsFn,
    });

    doHaHandshake(mockWs, HA_TOKEN);

    server.close();

    vi.advanceTimersByTime(10_000);

    // Should still only be 1 WS (no reconnect after intentional close)
    expect(wsFn).toHaveBeenCalledTimes(1);
  });

  it('should NOT reconnect when close() is called after unexpected disconnect before timer fires', () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch(),
      wsFn,
    });

    doHaHandshake(mockWs, HA_TOKEN);

    // WS drops unexpectedly — schedules reconnect in 3s
    const secondWs = createMockWs();
    (wsFn as ReturnType<typeof vi.fn>).mockReturnValue(secondWs);
    mockWs._simulateClose(1006, 'Connection dropped');

    // close() is called BEFORE the 3s timer fires
    server.close();

    // Even after the timer fires, no new connection should be made
    vi.advanceTimersByTime(3000);

    expect(wsFn).toHaveBeenCalledTimes(1);
  });

  // ── No WS option ──────────────────────────────────────────────────────────────

  it('should work without wsFn option (REST-only mode)', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([
        {
          entity_id: 'light.test',
          state: 'on',
          attributes: {},
          last_changed: '2026-02-23T06:00:00.000Z',
          last_updated: '2026-02-23T06:00:00.000Z',
        },
      ]),
      // no wsFn — REST only
    });

    await server.refresh();
    expect(server.getData()!.devices).toHaveLength(1);
    expect(wsFn).not.toHaveBeenCalled();
  });
});
