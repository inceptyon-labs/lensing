import type {
  PIRServerOptions,
  PIRServerInstance,
  PresenceData,
  GpioWatcher,
  DataBusInstance,
} from '@lensing/types';
import { DEFAULT_PIR_IDLE_TIMEOUT_MS, DEFAULT_PIR_GPIO_PIN } from '@lensing/types';

const PLUGIN_ID = 'pir-sensor';
const DATA_BUS_CHANNEL = 'presence.pir';

export function createPIRServer(options: PIRServerOptions): PIRServerInstance {
  const {
    dataBus,
    gpioFactory,
    gpioPin = DEFAULT_PIR_GPIO_PIN,
    idleTimeout_ms = DEFAULT_PIR_IDLE_TIMEOUT_MS,
  } = options;

  let closed = false;
  let watcher: GpioWatcher | null = null;
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  let startupError: string | null = null;

  const updateListeners: Array<(data: PresenceData) => void> = [];
  const errorListeners: Array<(error: string) => void> = [];

  let presenceData: PresenceData = {
    detected: false,
    lastMotionAt: 0,
    available: false,
    lastUpdated: Date.now(),
  };

  function notifyUpdate(data: PresenceData): void {
    for (const cb of [...updateListeners]) {
      try {
        cb(data);
      } catch {
        // isolate listener errors
      }
    }
  }

  function notifyError(message: string): void {
    for (const cb of [...errorListeners]) {
      try {
        cb(message);
      } catch {
        // isolate listener errors
      }
    }
  }

  function copyData(d: PresenceData): PresenceData {
    return { ...d };
  }

  function publishAndNotify(data: PresenceData): void {
    try {
      (dataBus as DataBusInstance).publish(DATA_BUS_CHANNEL, PLUGIN_ID, data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Data bus publish error: ${message}`);
    }
    notifyUpdate(data);
  }

  function clearIdleTimer(): void {
    if (idleTimer !== null) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  }

  function scheduleIdle(): void {
    clearIdleTimer();
    idleTimer = setTimeout(() => {
      if (closed) return;
      presenceData = {
        ...presenceData,
        detected: false,
        lastUpdated: Date.now(),
      };
      publishAndNotify(copyData(presenceData));
    }, idleTimeout_ms);
  }

  function handleGpioValue(value: 0 | 1): void {
    if (closed) return;
    if (value === 1) {
      const now = Date.now();
      presenceData = {
        ...presenceData,
        detected: true,
        lastMotionAt: now,
        lastUpdated: now,
      };
      publishAndNotify(copyData(presenceData));
      scheduleIdle();
    }
    // GPIO LOW (0) does not immediately clear — let idle timer fire
  }

  // Initialise GPIO
  if (gpioFactory) {
    try {
      watcher = gpioFactory(gpioPin);
      presenceData = { ...presenceData, available: true };
      watcher.watch(handleGpioValue);
    } catch (err) {
      // Clean up watcher if it was created but watch() failed
      if (watcher !== null) {
        try {
          watcher.close();
        } catch {
          // ignore cleanup errors
        }
        watcher = null;
      }
      const message = err instanceof Error ? err.message : String(err);
      presenceData = { ...presenceData, available: false };
      startupError = `GPIO error: ${message}`;
    }
  }

  return {
    getData(): PresenceData | null {
      return copyData(presenceData);
    },

    onUpdate(callback: (data: PresenceData) => void): () => void {
      updateListeners.push(callback);
      return () => {
        const idx = updateListeners.indexOf(callback);
        if (idx !== -1) updateListeners.splice(idx, 1);
      };
    },

    onError(callback: (error: string) => void): void {
      errorListeners.push(callback);
      // Replay startup error to newly registered listener
      if (startupError !== null) {
        try {
          callback(startupError);
        } catch {
          // isolate listener errors
        }
      }
    },

    close(): void {
      closed = true;
      clearIdleTimer();
      try {
        watcher?.close();
      } catch {
        // ignore GPIO close errors
      }
    },
  };
}
