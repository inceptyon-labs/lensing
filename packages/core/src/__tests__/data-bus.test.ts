import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createDataBus } from '../data-bus';
import type { DataBusInstance, DataBusMessage } from '@lensing/types';

describe('DataBus', () => {
  let bus: DataBusInstance;

  beforeEach(() => {
    bus = createDataBus();
  });

  describe('publish and subscribe', () => {
    it('should deliver published messages to subscribers', () => {
      const callback = vi.fn();
      bus.subscribe('weather.current', callback);

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });

      expect(callback).toHaveBeenCalledTimes(1);
      const msg = callback.mock.calls[0][0] as DataBusMessage;
      expect(msg.channel).toBe('weather.current');
      expect(msg.plugin_id).toBe('weather-plugin');
      expect(msg.data).toEqual({ temp: 72 });
      expect(msg.timestamp).toBeDefined();
    });

    it('should support multiple subscribers on the same channel', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      const cb3 = vi.fn();

      bus.subscribe('weather.current', cb1);
      bus.subscribe('weather.current', cb2);
      bus.subscribe('weather.current', cb3);

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });

      expect(cb1).toHaveBeenCalledTimes(1);
      expect(cb2).toHaveBeenCalledTimes(1);
      expect(cb3).toHaveBeenCalledTimes(1);
    });

    it('should not deliver messages to subscribers of other channels', () => {
      const weatherCb = vi.fn();
      const calendarCb = vi.fn();

      bus.subscribe('weather.current', weatherCb);
      bus.subscribe('calendar.today', calendarCb);

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });

      expect(weatherCb).toHaveBeenCalledTimes(1);
      expect(calendarCb).not.toHaveBeenCalled();
    });

    it('should deliver multiple publishes to subscribers', () => {
      const callback = vi.fn();
      bus.subscribe('weather.current', callback);

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });
      bus.publish('weather.current', 'weather-plugin', { temp: 75 });

      expect(callback).toHaveBeenCalledTimes(2);
      expect((callback.mock.calls[0][0] as DataBusMessage).data).toEqual({ temp: 72 });
      expect((callback.mock.calls[1][0] as DataBusMessage).data).toEqual({ temp: 75 });
    });
  });

  describe('immutable snapshots', () => {
    it('should deliver frozen data to subscribers', () => {
      const callback = vi.fn();
      bus.subscribe('weather.current', callback);

      bus.publish('weather.current', 'weather-plugin', { temp: 72, location: 'NYC' });

      const msg = callback.mock.calls[0][0] as DataBusMessage;
      expect(Object.isFrozen(msg.data)).toBe(true);
    });

    it('should deliver frozen message envelopes to subscribers', () => {
      const callback = vi.fn();
      bus.subscribe('weather.current', callback);

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });

      const msg = callback.mock.calls[0][0] as DataBusMessage;
      expect(Object.isFrozen(msg)).toBe(true);
    });

    it('should not allow mutation of published data across subscribers', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();

      bus.subscribe('weather.current', cb1);
      bus.subscribe('weather.current', cb2);

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });

      // Both subscribers get the same frozen snapshot
      const msg1 = cb1.mock.calls[0][0] as DataBusMessage<{ temp: number }>;
      const msg2 = cb2.mock.calls[0][0] as DataBusMessage<{ temp: number }>;

      // Attempting to mutate should throw in strict mode
      expect(() => {
        (msg1.data as { temp: number }).temp = 100;
      }).toThrow();

      // msg2 should still have original value
      expect(msg2.data.temp).toBe(72);
    });
  });

  describe('getLatest', () => {
    it('should return the latest message on a channel', () => {
      bus.publish('weather.current', 'weather-plugin', { temp: 72 });
      bus.publish('weather.current', 'weather-plugin', { temp: 75 });

      const latest = bus.getLatest<{ temp: number }>('weather.current');
      expect(latest).toBeDefined();
      expect(latest!.data.temp).toBe(75);
    });

    it('should return undefined for channels with no data', () => {
      const latest = bus.getLatest('nonexistent');
      expect(latest).toBeUndefined();
    });

    it('should return frozen data from getLatest', () => {
      bus.publish('weather.current', 'weather-plugin', { temp: 72 });

      const latest = bus.getLatest('weather.current');
      expect(latest).toBeDefined();
      expect(Object.isFrozen(latest)).toBe(true);
      expect(Object.isFrozen(latest!.data)).toBe(true);
    });
  });

  describe('unsubscribe', () => {
    it('should stop delivering messages after unsubscribe', () => {
      const callback = vi.fn();
      const unsubscribe = bus.subscribe('weather.current', callback);

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();

      bus.publish('weather.current', 'weather-plugin', { temp: 75 });
      expect(callback).toHaveBeenCalledTimes(1); // Not called again
    });

    it('should not affect other subscribers when one unsubscribes', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();

      const unsub1 = bus.subscribe('weather.current', cb1);
      bus.subscribe('weather.current', cb2);

      unsub1();

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });

      expect(cb1).not.toHaveBeenCalled();
      expect(cb2).toHaveBeenCalledTimes(1);
    });

    it('should handle double-unsubscribe gracefully', () => {
      const callback = vi.fn();
      const unsubscribe = bus.subscribe('weather.current', callback);

      unsubscribe();
      expect(() => unsubscribe()).not.toThrow();
    });
  });

  describe('getChannels', () => {
    it('should return list of channels that have had publishes', () => {
      bus.publish('weather.current', 'weather-plugin', { temp: 72 });
      bus.publish('calendar.today', 'calendar-plugin', { events: [] });

      const channels = bus.getChannels();
      expect(channels).toHaveLength(2);
      expect(channels).toEqual(expect.arrayContaining(['weather.current', 'calendar.today']));
    });

    it('should return empty array when no publishes', () => {
      expect(bus.getChannels()).toEqual([]);
    });
  });

  describe('onMessage (global listener for WS forwarding)', () => {
    it('should call global listeners on every publish', () => {
      const globalCb = vi.fn();
      bus.onMessage(globalCb);

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });
      bus.publish('calendar.today', 'calendar-plugin', { events: [] });

      expect(globalCb).toHaveBeenCalledTimes(2);
      expect((globalCb.mock.calls[0][0] as DataBusMessage).channel).toBe('weather.current');
      expect((globalCb.mock.calls[1][0] as DataBusMessage).channel).toBe('calendar.today');
    });

    it('should support unsubscribing global listeners', () => {
      const globalCb = vi.fn();
      const unsubscribe = bus.onMessage(globalCb);

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });
      expect(globalCb).toHaveBeenCalledTimes(1);

      unsubscribe();

      bus.publish('weather.current', 'weather-plugin', { temp: 75 });
      expect(globalCb).toHaveBeenCalledTimes(1);
    });
  });

  describe('error isolation', () => {
    it('should isolate errors in one subscriber from others', () => {
      const errorCb = vi.fn(() => {
        throw new Error('Subscriber error');
      });
      const goodCb = vi.fn();

      bus.subscribe('weather.current', errorCb);
      bus.subscribe('weather.current', goodCb);

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });

      expect(errorCb).toHaveBeenCalledTimes(1);
      expect(goodCb).toHaveBeenCalledTimes(1);
    });

    it('should isolate errors in global listeners from channel subscribers', () => {
      const errorGlobal = vi.fn(() => {
        throw new Error('Global error');
      });
      const channelCb = vi.fn();

      bus.onMessage(errorGlobal);
      bus.subscribe('weather.current', channelCb);

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });

      expect(errorGlobal).toHaveBeenCalledTimes(1);
      expect(channelCb).toHaveBeenCalledTimes(1);
    });
  });

  describe('clear', () => {
    it('should remove all channel data', () => {
      bus.publish('weather.current', 'weather-plugin', { temp: 72 });
      bus.publish('calendar.today', 'calendar-plugin', { events: [] });

      bus.clear();

      expect(bus.getLatest('weather.current')).toBeUndefined();
      expect(bus.getLatest('calendar.today')).toBeUndefined();
      expect(bus.getChannels()).toEqual([]);
    });

    it('should remove all subscriptions after clear', () => {
      const callback = vi.fn();
      bus.subscribe('weather.current', callback);

      bus.clear();

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should stop all subscriptions after close', () => {
      const callback = vi.fn();
      const globalCb = vi.fn();

      bus.subscribe('weather.current', callback);
      bus.onMessage(globalCb);

      bus.close();

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });
      expect(callback).not.toHaveBeenCalled();
      expect(globalCb).not.toHaveBeenCalled();
    });
  });

  describe('timestamp', () => {
    it('should include an ISO 8601 timestamp in messages', () => {
      const callback = vi.fn();
      bus.subscribe('weather.current', callback);

      bus.publish('weather.current', 'weather-plugin', { temp: 72 });

      const msg = callback.mock.calls[0][0] as DataBusMessage;
      // Should be a valid ISO 8601 timestamp
      expect(() => new Date(msg.timestamp)).not.toThrow();
      expect(new Date(msg.timestamp).toISOString()).toBe(msg.timestamp);
    });
  });
});
