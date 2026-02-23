import { describe, it, expect } from 'vitest';
import {
  DEFAULT_HA_MAX_STALE_MS,
  DEFAULT_HA_DOMAINS,
  type HassEntity,
  type HomeAssistantData,
  type HomeAssistantServerOptions,
  type HomeAssistantServerInstance,
  type WsFactory,
  type WsLike,
} from '../home-assistant';

describe('Home Assistant Types', () => {
  it('should export DEFAULT_HA_MAX_STALE_MS as 60000 (1 minute)', () => {
    expect(DEFAULT_HA_MAX_STALE_MS).toBe(60_000);
  });

  it('should export DEFAULT_HA_DOMAINS with standard device domains', () => {
    expect(DEFAULT_HA_DOMAINS).toContain('light');
    expect(DEFAULT_HA_DOMAINS).toContain('switch');
    expect(DEFAULT_HA_DOMAINS).toContain('lock');
    expect(DEFAULT_HA_DOMAINS).toContain('climate');
    expect(DEFAULT_HA_DOMAINS).toContain('sensor');
    expect(DEFAULT_HA_DOMAINS).toContain('binary_sensor');
  });

  it('should allow constructing a valid HassEntity', () => {
    const entity: HassEntity = {
      entity_id: 'light.living_room',
      state: 'on',
      domain: 'light',
      friendly_name: 'Living Room Light',
      attributes: { brightness: 255, color_temp: 400 },
      last_changed: 1708646400000,
      last_updated: 1708646400000,
    };

    expect(entity.entity_id).toBe('light.living_room');
    expect(entity.state).toBe('on');
    expect(entity.domain).toBe('light');
    expect(entity.attributes).toEqual({ brightness: 255, color_temp: 400 });
  });

  it('should allow constructing a valid HomeAssistantData', () => {
    const data: HomeAssistantData = {
      devices: [
        {
          entity_id: 'light.bedroom',
          state: 'off',
          domain: 'light',
          friendly_name: 'Bedroom Light',
          attributes: {},
          last_changed: 1708646400000,
          last_updated: 1708646400000,
        },
      ],
      sensors: [
        {
          entity_id: 'sensor.temperature',
          state: '72',
          domain: 'sensor',
          friendly_name: 'Temperature',
          attributes: { unit_of_measurement: '°F' },
          last_changed: 1708646400000,
          last_updated: 1708646400000,
        },
      ],
      lastUpdated: 1708646400000,
    };

    expect(data.devices).toHaveLength(1);
    expect(data.sensors).toHaveLength(1);
    expect(data.lastUpdated).toBe(1708646400000);
  });

  it('should define HomeAssistantServerOptions requiring url and token', () => {
    const options: HomeAssistantServerOptions = {
      url: 'http://homeassistant.local:8123',
      token: 'test-token',
      dataBus: {} as HomeAssistantServerOptions['dataBus'],
      notifications: {} as HomeAssistantServerOptions['notifications'],
    };

    expect(options.url).toBe('http://homeassistant.local:8123');
    expect(options.token).toBe('test-token');
  });

  it('should define HomeAssistantServerInstance with standard methods', () => {
    const instance: HomeAssistantServerInstance = {
      refresh: async () => {},
      getData: () => null,
      onUpdate: () => () => {},
      onError: () => {},
      close: () => {},
    };

    expect(typeof instance.refresh).toBe('function');
    expect(typeof instance.getData).toBe('function');
    expect(typeof instance.onUpdate).toBe('function');
    expect(typeof instance.onError).toBe('function');
    expect(typeof instance.close).toBe('function');
  });

  it('should define WsLike interface for injectable WebSocket', () => {
    const ws: WsLike = {
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
      send: () => {},
      close: () => {},
      readyState: 0,
    };

    expect(ws.readyState).toBe(0);
    expect(typeof ws.send).toBe('function');
    expect(typeof ws.close).toBe('function');
  });

  it('should define WsFactory type', () => {
    const factory: WsFactory = () => ({
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
      send: () => {},
      close: () => {},
      readyState: 0,
    });

    const ws = factory('ws://test');
    expect(typeof ws.send).toBe('function');
  });
});
