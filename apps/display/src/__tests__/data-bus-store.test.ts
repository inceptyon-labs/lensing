import { describe, it, expect, beforeEach } from 'vitest';
import { getChannelData, handlePluginData, resetStore } from '../lib/stores/dataBusStore';

function msg(plugin_id: string, data: unknown) {
  return { channel: `${plugin_id}.data`, plugin_id, timestamp: '', data };
}

describe('getChannelData', () => {
  beforeEach(() => resetStore());

  it('emits when its own plugin publishes', () => {
    const values: unknown[] = [];
    const unsub = getChannelData('news-server').subscribe((v) => values.push(v));
    handlePluginData(msg('news-server', { a: 1 }));
    unsub();
    expect(values).toEqual([null, { a: 1 }]);
  });

  it('does not re-emit when a different plugin publishes', () => {
    const values: unknown[] = [];
    handlePluginData(msg('news-server', { a: 1 }));
    const unsub = getChannelData('news-server').subscribe((v) => values.push(v));
    handlePluginData(msg('crypto-server', { coins: [] }));
    handlePluginData(msg('weather-server', { current: null }));
    unsub();
    expect(values).toEqual([{ a: 1 }]);
  });
});
