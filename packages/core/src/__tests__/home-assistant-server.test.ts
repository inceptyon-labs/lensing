import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHomeAssistantServer } from '../home-assistant-server';
import { createDataBus } from '../data-bus';
import { createNotificationQueue } from '../notification-queue';
import type { DataBusInstance, FetchFn, HomeAssistantData } from '@lensing/types';
import type { NotificationQueueInstance } from '../notification-queue';

// ── HA API response helpers ───────────────────────────────────────────────────

function makeHaState(
  entity_id: string,
  state: string,
  attributes: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    entity_id,
    state,
    attributes: { friendly_name: entity_id.split('.')[1]?.replace(/_/g, ' '), ...attributes },
    last_changed: '2026-02-23T06:00:00.000Z',
    last_updated: '2026-02-23T06:00:00.000Z',
  };
}

function createMockFetch(responseData: unknown): FetchFn {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => responseData,
  }) as unknown as FetchFn;
}

function createErrorFetch(status: number): FetchFn {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText: 'Unauthorized',
    json: async () => ({}),
  }) as unknown as FetchFn;
}

function createNetworkErrorFetch(): FetchFn {
  return vi.fn().mockRejectedValue(new Error('Network error')) as unknown as FetchFn;
}

const HA_URL = 'http://homeassistant.local:8123';
const HA_TOKEN = 'test-long-lived-token';

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Home Assistant Server', () => {
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

  // ── Factory ─────────────────────────────────────────────────────────────────

  it('should create a server instance', () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
    });

    expect(typeof server.refresh).toBe('function');
    expect(typeof server.getData).toBe('function');
    expect(typeof server.onUpdate).toBe('function');
    expect(typeof server.onError).toBe('function');
    expect(typeof server.close).toBe('function');
  });

  it('should return null from getData before first refresh', () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
    });

    expect(server.getData()).toBeNull();
  });

  // ── REST API ─────────────────────────────────────────────────────────────────

  it('should fetch from /api/states with Bearer token', async () => {
    const fetchFn = createMockFetch([]);
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn,
    });

    await server.refresh();

    expect(fetchFn).toHaveBeenCalledOnce();
    const [url, options] = (fetchFn as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('/api/states');
    expect(url).toContain(HA_URL);
    expect((options as RequestInit).headers).toMatchObject({
      Authorization: `Bearer ${HA_TOKEN}`,
    });
  });

  it('should split entities into devices and sensors', async () => {
    const states = [
      makeHaState('light.living_room', 'on', { brightness: 255 }),
      makeHaState('switch.fan', 'off'),
      makeHaState('sensor.temperature', '72', { unit_of_measurement: '°F' }),
      makeHaState('binary_sensor.motion', 'on'),
      makeHaState('lock.front_door', 'locked'),
    ];

    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch(states),
    });

    await server.refresh();
    const data = server.getData();

    expect(data).not.toBeNull();
    expect(data!.devices.map((e) => e.entity_id)).toEqual(
      expect.arrayContaining(['light.living_room', 'switch.fan', 'lock.front_door'])
    );
    expect(data!.sensors.map((e) => e.entity_id)).toEqual(
      expect.arrayContaining(['sensor.temperature', 'binary_sensor.motion'])
    );
    expect(data!.devices.some((e) => e.entity_id === 'sensor.temperature')).toBe(false);
  });

  it('should parse entity_id domain correctly', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([makeHaState('light.kitchen', 'off')]),
    });

    await server.refresh();
    const data = server.getData()!;

    expect(data.devices[0].domain).toBe('light');
    expect(data.devices[0].entity_id).toBe('light.kitchen');
  });

  it('should parse friendly_name from attributes', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([
        makeHaState('light.living_room', 'on', { friendly_name: 'Living Room Light' }),
      ]),
    });

    await server.refresh();
    const data = server.getData()!;

    expect(data.devices[0].friendly_name).toBe('Living Room Light');
  });

  it('should parse last_changed and last_updated as Unix ms timestamps', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([makeHaState('light.test', 'on')]),
    });

    await server.refresh();
    const data = server.getData()!;
    const entity = data.devices[0];

    expect(typeof entity.last_changed).toBe('number');
    expect(typeof entity.last_updated).toBe('number');
    expect(Number.isFinite(entity.last_changed)).toBe(true);
    expect(entity.last_changed).toBeGreaterThan(0);
  });

  it('should set lastUpdated on data', async () => {
    const before = Date.now();
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([]),
    });

    await server.refresh();
    const data = server.getData()!;
    const after = Date.now();

    expect(data.lastUpdated).toBeGreaterThanOrEqual(before);
    expect(data.lastUpdated).toBeLessThanOrEqual(after);
  });

  // ── Data Bus ─────────────────────────────────────────────────────────────────

  it('should publish to home.devices data bus channel', async () => {
    const publishSpy = vi.spyOn(dataBus, 'publish');
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([makeHaState('light.test', 'on')]),
    });

    await server.refresh();

    const calls = publishSpy.mock.calls;
    const deviceCall = calls.find((c) => c[0] === 'home.devices');
    expect(deviceCall).toBeDefined();
    expect((deviceCall![2] as HomeAssistantData).devices).toHaveLength(1);
  });

  it('should publish to home.sensors data bus channel', async () => {
    const publishSpy = vi.spyOn(dataBus, 'publish');
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([makeHaState('sensor.temp', '72')]),
    });

    await server.refresh();

    const calls = publishSpy.mock.calls;
    const sensorCall = calls.find((c) => c[0] === 'home.sensors');
    expect(sensorCall).toBeDefined();
    expect((sensorCall![2] as HomeAssistantData).sensors).toHaveLength(1);
  });

  // ── Stale guard ───────────────────────────────────────────────────────────────

  it('should skip refresh if data is not stale', async () => {
    const fetchFn = createMockFetch([]);
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn,
      maxStale_ms: 60_000,
    });

    await server.refresh();
    await server.refresh();

    expect(fetchFn).toHaveBeenCalledOnce();
  });

  it('should re-fetch when data is stale', async () => {
    const fetchFn = createMockFetch([]);
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn,
      maxStale_ms: 60_000,
    });

    await server.refresh();
    vi.advanceTimersByTime(61_000);
    await server.refresh();

    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  // ── Refresh guard ─────────────────────────────────────────────────────────────

  it('should not start concurrent refreshes', async () => {
    let resolveFetch!: () => void;
    const slowFetch = () =>
      new Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>((resolve) => {
        resolveFetch = () => resolve({ ok: true, status: 200, json: async () => [] });
      });

    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: slowFetch as unknown as FetchFn,
    });

    const p1 = server.refresh();
    const p2 = server.refresh();
    resolveFetch();
    await Promise.all([p1, p2]);

    // Only one fetch should have been started (p2 saw refreshing=true and returned early)
    // getData() should be non-null after p1 settles
    expect(server.getData()).not.toBeNull();
  });

  // ── Error handling ────────────────────────────────────────────────────────────

  it('should call onError listeners on HTTP error', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createErrorFetch(401),
    });

    const errors: string[] = [];
    server.onError((msg) => errors.push(msg));

    await server.refresh();

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/401/);
  });

  it('should call onError listeners on network error', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createNetworkErrorFetch(),
    });

    const errors: string[] = [];
    server.onError((msg) => errors.push(msg));

    await server.refresh();

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/Network error/i);
  });

  // ── onUpdate ──────────────────────────────────────────────────────────────────

  it('should call onUpdate listeners after successful refresh', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([makeHaState('light.test', 'on')]),
    });

    const updates: HomeAssistantData[] = [];
    server.onUpdate((data) => updates.push(data));

    await server.refresh();

    expect(updates).toHaveLength(1);
    expect(updates[0].devices).toHaveLength(1);
  });

  it('should return unsubscribe function from onUpdate', async () => {
    const fetchFn = createMockFetch([]);
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn,
      maxStale_ms: 1,
    });

    const updates: number[] = [];
    const unsubscribe = server.onUpdate(() => updates.push(1));

    await server.refresh();
    unsubscribe();

    vi.advanceTimersByTime(10);
    await server.refresh();

    expect(updates).toHaveLength(1);
  });

  // ── Defensive copies ──────────────────────────────────────────────────────────

  it('should return defensive copies from getData', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([makeHaState('light.test', 'on')]),
    });

    await server.refresh();
    const data1 = server.getData()!;
    data1.devices[0].state = 'MUTATED';

    const data2 = server.getData()!;
    expect(data2.devices[0].state).toBe('on');
  });

  // ── close() ───────────────────────────────────────────────────────────────────

  it('should prevent refresh after close', async () => {
    const fetchFn = createMockFetch([]);
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn,
    });

    server.close();
    await server.refresh();

    expect(fetchFn).not.toHaveBeenCalled();
  });

  // ── Domain filtering ──────────────────────────────────────────────────────────

  it('should filter to specified domains only', async () => {
    const states = [
      makeHaState('light.test', 'on'),
      makeHaState('switch.fan', 'off'),
      makeHaState('sensor.temp', '72'),
      makeHaState('media_player.tv', 'playing'),
    ];

    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch(states),
      domains: ['light', 'sensor'],
    });

    await server.refresh();
    const data = server.getData()!;

    const allIds = [
      ...data.devices.map((e) => e.entity_id),
      ...data.sensors.map((e) => e.entity_id),
    ];
    expect(allIds).toContain('light.test');
    expect(allIds).toContain('sensor.temp');
    expect(allIds).not.toContain('switch.fan');
    expect(allIds).not.toContain('media_player.tv');
  });

  it('should handle empty entity list', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch([]),
    });

    await server.refresh();
    const data = server.getData()!;

    expect(data.devices).toEqual([]);
    expect(data.sensors).toEqual([]);
  });

  it('should default to DEFAULT_HA_DOMAINS when no domains option is provided', async () => {
    const states = [
      makeHaState('light.living_room', 'on'),
      makeHaState('automation.morning_routine', 'on'),
      makeHaState('media_player.tv', 'playing'),
    ];

    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: createMockFetch(states),
    });

    await server.refresh();
    const data = server.getData()!;

    const allIds = [
      ...data.devices.map((e) => e.entity_id),
      ...data.sensors.map((e) => e.entity_id),
    ];
    // light is in DEFAULT_HA_DOMAINS — should be included
    expect(allIds).toContain('light.living_room');
    // automation and media_player are NOT in DEFAULT_HA_DOMAINS — should be excluded
    expect(allIds).not.toContain('automation.morning_routine');
    expect(allIds).not.toContain('media_player.tv');
  });

  it('should call onError when REST response is not a valid array', async () => {
    const server = createHomeAssistantServer({
      url: HA_URL,
      token: HA_TOKEN,
      dataBus,
      notifications,
      fetchFn: vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ message: 'unexpected error object' }),
      }) as unknown as FetchFn,
    });

    const errors: string[] = [];
    server.onError((msg) => errors.push(msg));

    await server.refresh();

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/parse error|invalid/i);
  });
});
