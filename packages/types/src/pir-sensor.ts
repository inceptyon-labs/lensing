import type { DataBusInstance } from './index';

/** Default idle timeout in ms before switching to idle mode (5 minutes) */
export const DEFAULT_PIR_IDLE_TIMEOUT_MS = 5 * 60_000;

/** Default GPIO pin for PIR sensor */
export const DEFAULT_PIR_GPIO_PIN = 17;

/** Presence state published by the PIR server */
export interface PresenceData {
  /** Whether motion is currently detected */
  detected: boolean;
  /** Unix timestamp (ms) of the last motion event */
  lastMotionAt: number;
  /** Whether the PIR hardware is available */
  available: boolean;
  /** Unix timestamp (ms) of this update */
  lastUpdated: number;
}

/** GPIO watcher interface for dependency injection */
export interface GpioWatcher {
  /** Register a callback invoked on pin value change (1 = motion, 0 = clear) */
  watch(callback: (value: 0 | 1) => void): void;
  /** Read the current pin value */
  read(): Promise<0 | 1>;
  /** Release the GPIO pin */
  close(): void;
}

/** Factory function for creating a GPIO watcher */
export type GpioWatcherFactory = (pin: number) => GpioWatcher;

/** Configuration for createPIRServer */
export interface PIRServerOptions {
  /** GPIO pin number for the PIR sensor (default: DEFAULT_PIR_GPIO_PIN) */
  gpioPin?: number;
  /** Idle timeout in ms — no motion for this duration triggers idle (default: DEFAULT_PIR_IDLE_TIMEOUT_MS) */
  idleTimeout_ms?: number;
  /** Data bus instance for publishing presence state */
  dataBus: DataBusInstance;
  /** Injectable GPIO watcher factory (required on Pi, null for fallback mode) */
  gpioFactory?: GpioWatcherFactory;
}

/** Instance returned by createPIRServer */
export interface PIRServerInstance {
  /** Get the current presence data (null if not yet initialized) */
  getData(): PresenceData | null;
  /** Register a listener called when presence state changes; returns unsubscribe */
  onUpdate(callback: (data: PresenceData) => void): () => void;
  /** Register a listener called when an error occurs */
  onError(callback: (error: string) => void): void;
  /** Stop monitoring and release GPIO resources */
  close(): void;
}
