import { describe, it, expect, vi } from 'vitest';
import { createHomeAssistantStore } from '../home-assistant-store';
import type { HomeAssistantData, HassEntity } from '@lensing/types';

// ── Test helpers ─────────────────────────────────────────────────────────────

function makeEntity(overrides: Partial<HassEntity> = {}): HassEntity {
  return {
    entity_id: 'light.living_room',
    state: 'on',
    domain: 'light',
    friendly_name: 'Living Room',
    attributes: {},
    last_changed: Date.now() - 60_000,
    last_updated: Date.now() - 60_000,
    ...overrides,
  };
}

function makeData(overrides: Partial<HomeAssistantData> = {}): HomeAssistantData {
  return {
    devices: [
      makeEntity({ entity_id: 'light.kitchen', domain: 'light', friendly_name: 'Kitchen' }),
      makeEntity({
        entity_id: 'light.bedroom',
        domain: 'light',
        friendly_name: 'Bedroom',
        state: 'off',
      }),
      makeEntity({ entity_id: 'switch.fan', domain: 'switch', friendly_name: 'Fan', state: 'off' }),
      makeEntity({
        entity_id: 'lock.front_door',
        domain: 'lock',
        friendly_name: 'Front Door',
        state: 'locked',
      }),
      makeEntity({
        entity_id: 'climate.thermostat',
        domain: 'climate',
        friendly_name: 'Thermostat',
        state: 'heat',
        attributes: { current_temperature: 72, temperature: 70 },
      }),
    ],
    sensors: [
      makeEntity({
        entity_id: 'sensor.temperature',
        domain: 'sensor',
        friendly_name: 'Temperature',
        state: '72',
        attributes: { unit_of_measurement: '°F', device_class: 'temperature' },
      }),
      makeEntity({
        entity_id: 'binary_sensor.motion',
        domain: 'binary_sensor',
        friendly_name: 'Motion',
        state: 'on',
        attributes: { device_class: 'motion' },
      }),
    ],
    lastUpdated: Date.now(),
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Home Assistant Store', () => {
  // ── Factory ─────────────────────────────────────────────────────────────────

  it('should create a store with standard methods', () => {
    const store = createHomeAssistantStore();

    expect(typeof store.getState).toBe('function');
    expect(typeof store.setData).toBe('function');
    expect(typeof store.setLoading).toBe('function');
    expect(typeof store.setError).toBe('function');
    expect(typeof store.isStale).toBe('function');
    expect(typeof store.onChange).toBe('function');
  });

  // ── Initial state ────────────────────────────────────────────────────────────

  it('should initialize with null data, not loading, no error', () => {
    const store = createHomeAssistantStore();
    const state = store.getState();

    expect(state.data).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  // ── setData ──────────────────────────────────────────────────────────────────

  it('should update state when setData is called', () => {
    const store = createHomeAssistantStore();
    store.setData(makeData());
    const state = store.getState();

    expect(state.data).not.toBeNull();
    expect(state.data!.devices.length).toBeGreaterThan(0);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should return defensive copies from getState', () => {
    const store = createHomeAssistantStore();
    store.setData(makeData());

    const state1 = store.getState();
    const state2 = store.getState();

    expect(state1.data).toEqual(state2.data);
    expect(state1.data).not.toBe(state2.data);
    expect(state1.data!.devices).not.toBe(state2.data!.devices);
  });

  it('should not be mutated by caller modifying setData input', () => {
    const store = createHomeAssistantStore();
    const data = makeData();
    store.setData(data);

    data.devices[0].state = 'MUTATED';

    expect(store.getState().data!.devices[0].state).toBe('on');
  });

  // ── setLoading ───────────────────────────────────────────────────────────────

  it('should update isLoading flag', () => {
    const store = createHomeAssistantStore();
    store.setLoading(true);

    expect(store.getState().isLoading).toBe(true);
  });

  // ── setError ─────────────────────────────────────────────────────────────────

  it('should set error and clear data', () => {
    const store = createHomeAssistantStore();
    store.setData(makeData());
    store.setError('Connection failed');

    const state = store.getState();
    expect(state.error).toBe('Connection failed');
    expect(state.data).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  // ── onChange ─────────────────────────────────────────────────────────────────

  it('should call onChange when data changes', () => {
    const store = createHomeAssistantStore();
    const callback = vi.fn();

    store.onChange(callback);
    store.setData(makeData());

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should allow unsubscribing from onChange', () => {
    const store = createHomeAssistantStore();
    const callback = vi.fn();

    const unsubscribe = store.onChange(callback);
    unsubscribe();
    store.setData(makeData());

    expect(callback).not.toHaveBeenCalled();
  });

  it('should isolate callback errors', () => {
    const store = createHomeAssistantStore();
    const goodCallback = vi.fn();

    store.onChange(() => {
      throw new Error('Bad callback');
    });
    store.onChange(goodCallback);
    store.setData(makeData());

    expect(goodCallback).toHaveBeenCalledTimes(1);
  });

  // ── isStale ──────────────────────────────────────────────────────────────────

  it('should return false when data is null', () => {
    const store = createHomeAssistantStore();
    expect(store.isStale()).toBe(false);
  });

  it('should return false when data is fresh', () => {
    const store = createHomeAssistantStore({ maxStale_ms: 60_000 });
    store.setData(makeData({ lastUpdated: Date.now() }));

    expect(store.isStale()).toBe(false);
  });

  it('should return true when data is stale', () => {
    const store = createHomeAssistantStore({ maxStale_ms: 60_000 });
    store.setData(makeData({ lastUpdated: Date.now() - 61_000 }));

    expect(store.isStale()).toBe(true);
  });

  it('should return true for non-finite lastUpdated', () => {
    const store = createHomeAssistantStore({ maxStale_ms: 60_000 });
    store.setData(makeData({ lastUpdated: NaN }));

    expect(store.isStale()).toBe(true);
  });

  // ── Domain helpers ───────────────────────────────────────────────────────────

  it('should return empty array from domain helpers when no data', () => {
    const store = createHomeAssistantStore();

    expect(store.getLights()).toEqual([]);
    expect(store.getSwitches()).toEqual([]);
    expect(store.getLocks()).toEqual([]);
    expect(store.getClimate()).toEqual([]);
  });

  it('should return lights filtered to domain=light', () => {
    const store = createHomeAssistantStore();
    store.setData(makeData());

    const lights = store.getLights();
    expect(lights.length).toBe(2);
    expect(lights.every((e) => e.domain === 'light')).toBe(true);
  });

  it('should return switches filtered to domain=switch', () => {
    const store = createHomeAssistantStore();
    store.setData(makeData());

    const switches = store.getSwitches();
    expect(switches.length).toBe(1);
    expect(switches[0].entity_id).toBe('switch.fan');
  });

  it('should return locks filtered to domain=lock', () => {
    const store = createHomeAssistantStore();
    store.setData(makeData());

    const locks = store.getLocks();
    expect(locks.length).toBe(1);
    expect(locks[0].entity_id).toBe('lock.front_door');
  });

  it('should return climate entities filtered to domain=climate', () => {
    const store = createHomeAssistantStore();
    store.setData(makeData());

    const climate = store.getClimate();
    expect(climate.length).toBe(1);
    expect(climate[0].entity_id).toBe('climate.thermostat');
  });

  it('should return sensors filtered by device_class', () => {
    const store = createHomeAssistantStore();
    store.setData(makeData());

    const tempSensors = store.getSensorsByType('temperature');
    expect(tempSensors.length).toBe(1);
    expect(tempSensors[0].entity_id).toBe('sensor.temperature');
  });

  it('should return empty array from getSensorsByType when no sensors match', () => {
    const store = createHomeAssistantStore();
    store.setData(makeData());

    expect(store.getSensorsByType('humidity')).toEqual([]);
  });

  it('should return defensive copies from domain helpers', () => {
    const store = createHomeAssistantStore();
    store.setData(makeData());

    const lights = store.getLights();
    lights[0].state = 'MUTATED';

    expect(store.getLights()[0].state).not.toBe('MUTATED');
  });
});
