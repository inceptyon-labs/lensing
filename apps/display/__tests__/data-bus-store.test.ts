import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import type { DataBusMessage } from '@lensing/types';
import {
  dataBusStore,
  handlePluginData,
  getChannelData,
  resetStore,
} from '../src/lib/stores/dataBusStore';

function makeMsg(pluginId: string, channel: string, data: unknown): DataBusMessage {
  return { plugin_id: pluginId, channel, data, timestamp: new Date().toISOString() };
}

describe('dataBusStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should start with an empty map', () => {
    const map = get(dataBusStore);
    expect(map.size).toBe(0);
  });

  it('should update the store when handlePluginData is called', () => {
    const msg = makeMsg('weather', 'weather.current', { temp: 72 });
    handlePluginData(msg);

    const map = get(dataBusStore);
    expect(map.size).toBe(1);
    expect(map.get('weather')).toEqual(msg);
  });

  it('should overwrite old data for the same plugin_id', () => {
    const msg1 = makeMsg('crypto', 'crypto.prices', { btc: 50000 });
    const msg2 = makeMsg('crypto', 'crypto.prices', { btc: 51000 });

    handlePluginData(msg1);
    handlePluginData(msg2);

    const map = get(dataBusStore);
    expect(map.size).toBe(1);
    expect(map.get('crypto')!.data).toEqual({ btc: 51000 });
  });

  it('should support multiple channels independently', () => {
    handlePluginData(makeMsg('weather', 'weather.current', { temp: 72 }));
    handlePluginData(makeMsg('crypto', 'crypto.prices', { btc: 50000 }));
    handlePluginData(makeMsg('news', 'news.headlines', { articles: [] }));

    const map = get(dataBusStore);
    expect(map.size).toBe(3);
    expect(map.has('weather')).toBe(true);
    expect(map.has('crypto')).toBe(true);
    expect(map.has('news')).toBe(true);
  });
});

describe('getChannelData', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should return null for unknown plugin_id', () => {
    const data = get(getChannelData('nonexistent'));
    expect(data).toBeNull();
  });

  it('should return data for a known plugin_id', () => {
    handlePluginData(makeMsg('weather', 'weather.current', { temp: 72, condition: 'sunny' }));

    const data = get(getChannelData('weather'));
    expect(data).toEqual({ temp: 72, condition: 'sunny' });
  });

  it('should reactively update when new data arrives', () => {
    const values: unknown[] = [];
    const unsub = getChannelData('crypto').subscribe((val) => {
      values.push(val);
    });

    handlePluginData(makeMsg('crypto', 'crypto.prices', { btc: 50000 }));
    handlePluginData(makeMsg('crypto', 'crypto.prices', { btc: 51000 }));

    // Initial null + 2 updates
    expect(values).toEqual([null, { btc: 50000 }, { btc: 51000 }]);

    unsub();
  });

  it('should not fire for unrelated plugin updates', () => {
    const values: unknown[] = [];
    const unsub = getChannelData('weather').subscribe((val) => {
      values.push(val);
    });

    // Update a different plugin
    handlePluginData(makeMsg('crypto', 'crypto.prices', { btc: 50000 }));

    // Weather should only have initial null, no update
    expect(values).toEqual([null]);

    unsub();
  });
});
