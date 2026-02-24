import { writable, derived } from 'svelte/store';
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

/**
 * Returns a derived store containing the latest `.data` for a specific plugin_id.
 * Emits null when no data has arrived yet for that plugin.
 */
export function getChannelData(pluginId: string): Readable<unknown> {
  return derived(_store, ($store) => $store.get(pluginId)?.data ?? null);
}

/** Reset the store to empty. Intended for use in tests only. */
export function resetStore(): void {
  _store.set(new Map());
}
