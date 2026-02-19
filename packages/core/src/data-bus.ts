import type { DataBusInstance, DataBusMessage, DataBusSubscriber } from '@lensing/types';

function makeMessage<T>(channel: string, pluginId: string, data: T): DataBusMessage<T> {
  const frozenData = Object.freeze(
    typeof data === 'object' && data !== null ? { ...(data as object) } : data
  ) as T;
  return Object.freeze({
    channel,
    plugin_id: pluginId,
    data: frozenData,
    timestamp: new Date().toISOString(),
  });
}

function safeCall(cb: (...args: unknown[]) => void, ...args: unknown[]): void {
  try {
    cb(...args);
  } catch {
    // Isolate subscriber errors
  }
}

export function createDataBus(): DataBusInstance {
  const channels = new Map<string, DataBusMessage>();
  const subscribers = new Map<string, Set<DataBusSubscriber>>();
  const globalListeners = new Set<DataBusSubscriber>();
  let closed = false;

  return {
    publish<T>(channel: string, pluginId: string, data: T): void {
      if (closed) return;
      const msg = makeMessage(channel, pluginId, data);
      channels.set(channel, msg as DataBusMessage);

      const subs = subscribers.get(channel);
      if (subs) {
        for (const cb of [...subs]) {
          safeCall(cb as (...args: unknown[]) => void, msg);
        }
      }
      for (const cb of [...globalListeners]) {
        safeCall(cb as (...args: unknown[]) => void, msg);
      }
    },

    subscribe<T>(channel: string, callback: DataBusSubscriber<T>): () => void {
      if (!subscribers.has(channel)) {
        subscribers.set(channel, new Set());
      }
      subscribers.get(channel)!.add(callback as DataBusSubscriber);
      return () => {
        subscribers.get(channel)?.delete(callback as DataBusSubscriber);
      };
    },

    getLatest<T>(channel: string): DataBusMessage<T> | undefined {
      return channels.get(channel) as DataBusMessage<T> | undefined;
    },

    getChannels(): string[] {
      return Array.from(channels.keys());
    },

    onMessage(callback: DataBusSubscriber): () => void {
      globalListeners.add(callback);
      return () => {
        globalListeners.delete(callback);
      };
    },

    clear(): void {
      channels.clear();
      subscribers.clear();
      globalListeners.clear();
    },

    close(): void {
      closed = true;
      channels.clear();
      subscribers.clear();
      globalListeners.clear();
    },
  };
}
