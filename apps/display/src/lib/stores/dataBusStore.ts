import { writable, readable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import type { DataBusMessage } from '@lensing/types';

const _store = writable<Map<string, DataBusMessage>>(new Map());

/** Read-only view of the full data bus state, keyed by plugin_id. */
export const dataBusStore: Readable<Map<string, DataBusMessage>> = { subscribe: _store.subscribe };

/** Update the store with a new data bus message. Keyed by plugin_id. */
export function handlePluginData(msg: DataBusMessage): void {
  _store.update((map) => {
    const next = new Map(map);
    next.set(msg.plugin_id, msg);
    return next;
  });
}

/** Cache of derived stores, one per plugin_id. Avoids creating a new store on every call. */
const _channelCache = new Map<string, Readable<unknown>>();

/**
 * Returns a derived store containing the latest `.data` for a specific plugin_id.
 * Emits null when no data has arrived yet for that plugin.
 *
 * Only emits when this plugin's message changes; a derived store would re-emit
 * on every message from any plugin, re-rendering every widget each time.
 *
 * The same store instance is returned for repeated calls with the same pluginId.
 * Assign to a component variable once — do not call inside a reactive `$:` block.
 */
export function getChannelData(pluginId: string): Readable<unknown> {
  let cached = _channelCache.get(pluginId);
  if (!cached) {
    cached = readable<unknown>(null, (set) => {
      let started = false;
      let last: DataBusMessage | undefined;
      return _store.subscribe(($store) => {
        const msg = $store.get(pluginId);
        if (started && msg === last) return;
        started = true;
        last = msg;
        set(msg?.data ?? null);
      });
    });
    _channelCache.set(pluginId, cached);
  }
  return cached;
}

/** Reset the store and channel cache to empty. Intended for use in tests only. */
export function resetStore(): void {
  _store.set(new Map());
  _channelCache.clear();
}
