import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPIRServer } from '../pir-server';
import { createDataBus } from '../data-bus';
import type { DataBusInstance, GpioWatcher, GpioWatcherFactory, PresenceData } from '@lensing/types';

// ── Mock GPIO helpers ────────────────────────────────────────────────────────

function createMockGpioWatcher(): GpioWatcher & { trigger(value: 0 | 1): void } {
  let watchCallback: ((value: 0 | 1) => void) | null = null;
  let currentValue: 0 | 1 = 0;

  return {
    watch(callback) {
      watchCallback = callback;
    },
    async read() {
      return currentValue;
    },
    close: vi.fn(),
    trigger(value: 0 | 1) {
      currentValue = value;
      if (watchCallback) watchCallback(value);
    },
  };
}

function createMockGpioFactory(
  watcher?: ReturnType<typeof createMockGpioWatcher>
): { factory: GpioWatcherFactory; watcher: ReturnType<typeof createMockGpioWatcher> } {
  const mockWatcher = watcher ?? createMockGpioWatcher();
  const factory = vi.fn(() => mockWatcher) as unknown as GpioWatcherFactory;
  return { factory, watcher: mockWatcher };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PIR Server', () => {
  let dataBus: DataBusInstance;

  beforeEach(() => {
    dataBus = createDataBus();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Factory ─────────────────────────────────────────────────────────────────

  it('should create a server instance with expected methods', () => {
    const { factory } = createMockGpioFactory();
    const server = createPIRServer({ dataBus, gpioFactory: factory });

    expect(typeof server.getData).toBe('function');
    expect(typeof server.onUpdate).toBe('function');
    expect(typeof server.onError).toBe('function');
    expect(typeof server.close).toBe('function');
    server.close();
  });

  it('should return initial data with available=true when GPIO factory is provided', () => {
    const { factory } = createMockGpioFactory();
    const server = createPIRServer({ dataBus, gpioFactory: factory });
    const data = server.getData();

    expect(data).not.toBeNull();
    expect(data!.available).toBe(true);
    expect(data!.detected).toBe(false);
    server.close();
  });

  it('should return initial data with available=false when no GPIO factory is provided', () => {
    const server = createPIRServer({ dataBus });
    const data = server.getData();

    expect(data).not.toBeNull();
    expect(data!.available).toBe(false);
    expect(data!.detected).toBe(false);
    server.close();
  });

  // ── Motion detection ────────────────────────────────────────────────────────

  it('should set detected=true when GPIO goes HIGH', () => {
    const { factory, watcher } = createMockGpioFactory();
    const server = createPIRServer({ dataBus, gpioFactory: factory });

    watcher.trigger(1);
    const data = server.getData()!;

    expect(data.detected).toBe(true);
    expect(data.lastMotionAt).toBeGreaterThan(0);
    server.close();
  });

  it('should call onUpdate listeners when motion is detected', () => {
    const { factory, watcher } = createMockGpioFactory();
    const server = createPIRServer({ dataBus, gpioFactory: factory });

    const updates: PresenceData[] = [];
    server.onUpdate((data) => updates.push(data));

    watcher.trigger(1);

    expect(updates).toHaveLength(1);
    expect(updates[0].detected).toBe(true);
    server.close();
  });

  it('should publish to presence.pir data bus channel on motion', () => {
    const publishSpy = vi.spyOn(dataBus, 'publish');
    const { factory, watcher } = createMockGpioFactory();
    const server = createPIRServer({ dataBus, gpioFactory: factory });

    watcher.trigger(1);

    const presenceCall = publishSpy.mock.calls.find((c) => c[0] === 'presence.pir');
    expect(presenceCall).toBeDefined();
    expect((presenceCall![2] as PresenceData).detected).toBe(true);
    server.close();
  });

  // ── Idle timeout ────────────────────────────────────────────────────────────

  it('should switch to detected=false after idle timeout', () => {
    const { factory, watcher } = createMockGpioFactory();
    const server = createPIRServer({
      dataBus,
      gpioFactory: factory,
      idleTimeout_ms: 10_000,
    });

    watcher.trigger(1);
    expect(server.getData()!.detected).toBe(true);

    vi.advanceTimersByTime(10_001);
    expect(server.getData()!.detected).toBe(false);
    server.close();
  });

  it('should reset idle timer on subsequent motion events', () => {
    const { factory, watcher } = createMockGpioFactory();
    const server = createPIRServer({
      dataBus,
      gpioFactory: factory,
      idleTimeout_ms: 10_000,
    });

    watcher.trigger(1);
    vi.advanceTimersByTime(8_000);

    // Another motion event at 8s resets the timer
    watcher.trigger(1);
    vi.advanceTimersByTime(8_000);

    // At 16s total, only 8s since last motion — still active
    expect(server.getData()!.detected).toBe(true);

    vi.advanceTimersByTime(3_000);
    // At 19s total, 11s since last motion — idle
    expect(server.getData()!.detected).toBe(false);
    server.close();
  });

  it('should call onUpdate when transitioning to idle', () => {
    const { factory, watcher } = createMockGpioFactory();
    const server = createPIRServer({
      dataBus,
      gpioFactory: factory,
      idleTimeout_ms: 5_000,
    });

    const updates: PresenceData[] = [];
    server.onUpdate((data) => updates.push(data));

    watcher.trigger(1);
    expect(updates).toHaveLength(1);

    vi.advanceTimersByTime(5_001);
    expect(updates).toHaveLength(2);
    expect(updates[1].detected).toBe(false);
    server.close();
  });

  it('should publish idle state to data bus', () => {
    const publishSpy = vi.spyOn(dataBus, 'publish');
    const { factory, watcher } = createMockGpioFactory();
    const server = createPIRServer({
      dataBus,
      gpioFactory: factory,
      idleTimeout_ms: 5_000,
    });

    watcher.trigger(1);
    vi.advanceTimersByTime(5_001);

    const calls = publishSpy.mock.calls.filter((c) => c[0] === 'presence.pir');
    expect(calls.length).toBeGreaterThanOrEqual(2);
    const lastCall = calls[calls.length - 1];
    expect((lastCall[2] as PresenceData).detected).toBe(false);
    server.close();
  });

  // ── GPIO LOW (clear) event ──────────────────────────────────────────────────

  it('should not immediately go idle on GPIO LOW — wait for timeout', () => {
    const { factory, watcher } = createMockGpioFactory();
    const server = createPIRServer({
      dataBus,
      gpioFactory: factory,
      idleTimeout_ms: 10_000,
    });

    watcher.trigger(1);
    expect(server.getData()!.detected).toBe(true);

    watcher.trigger(0);
    // Should still be detected — idle timeout hasn't fired
    expect(server.getData()!.detected).toBe(true);
    server.close();
  });

  // ── Graceful fallback ───────────────────────────────────────────────────────

  it('should call onError when GPIO factory throws', () => {
    const throwingFactory = (() => {
      throw new Error('GPIO not available');
    }) as unknown as GpioWatcherFactory;

    const server = createPIRServer({ dataBus, gpioFactory: throwingFactory });

    const errors: string[] = [];
    server.onError((msg) => errors.push(msg));

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/GPIO|not available/i);
    expect(server.getData()!.available).toBe(false);
    server.close();
  });

  it('should not call onError in fallback mode without gpioFactory', () => {
    const server = createPIRServer({ dataBus });

    const errors: string[] = [];
    server.onError((msg) => errors.push(msg));

    // No error — just disabled mode
    expect(errors).toHaveLength(0);
    expect(server.getData()!.available).toBe(false);
    server.close();
  });

  // ── Unsubscribe ─────────────────────────────────────────────────────────────

  it('should return unsubscribe function from onUpdate', () => {
    const { factory, watcher } = createMockGpioFactory();
    const server = createPIRServer({ dataBus, gpioFactory: factory });

    const updates: number[] = [];
    const unsub = server.onUpdate(() => updates.push(1));

    watcher.trigger(1);
    unsub();
    watcher.trigger(0);
    watcher.trigger(1);

    expect(updates).toHaveLength(1);
    server.close();
  });

  // ── close() ─────────────────────────────────────────────────────────────────

  it('should close the GPIO watcher on close()', () => {
    const { factory, watcher } = createMockGpioFactory();
    const server = createPIRServer({ dataBus, gpioFactory: factory });

    server.close();
    expect(watcher.close).toHaveBeenCalledOnce();
  });

  it('should not fire idle timeout after close()', () => {
    const { factory, watcher } = createMockGpioFactory();
    const server = createPIRServer({
      dataBus,
      gpioFactory: factory,
      idleTimeout_ms: 5_000,
    });

    const updates: PresenceData[] = [];
    server.onUpdate((data) => updates.push(data));

    watcher.trigger(1);
    expect(updates).toHaveLength(1);

    server.close();
    vi.advanceTimersByTime(10_000);

    // No idle transition after close
    expect(updates).toHaveLength(1);
  });

  it('should ignore GPIO events after close()', () => {
    const { factory, watcher } = createMockGpioFactory();
    const server = createPIRServer({ dataBus, gpioFactory: factory });

    const updates: PresenceData[] = [];
    server.onUpdate((data) => updates.push(data));

    server.close();
    watcher.trigger(1);

    expect(updates).toHaveLength(0);
  });

  // ── Custom GPIO pin ─────────────────────────────────────────────────────────

  it('should pass configured GPIO pin to factory', () => {
    const factoryFn = vi.fn(() => createMockGpioWatcher()) as unknown as GpioWatcherFactory;
    const server = createPIRServer({ dataBus, gpioFactory: factoryFn, gpioPin: 27 });

    expect(factoryFn).toHaveBeenCalledWith(27);
    server.close();
  });

  it('should use DEFAULT_PIR_GPIO_PIN when no pin specified', () => {
    const factoryFn = vi.fn(() => createMockGpioWatcher()) as unknown as GpioWatcherFactory;
    const server = createPIRServer({ dataBus, gpioFactory: factoryFn });

    expect(factoryFn).toHaveBeenCalledWith(17);
    server.close();
  });

  // ── Defensive copies ────────────────────────────────────────────────────────

  it('should return defensive copies from getData', () => {
    const { factory, watcher } = createMockGpioFactory();
    const server = createPIRServer({ dataBus, gpioFactory: factory });

    watcher.trigger(1);
    const data1 = server.getData()!;
    (data1 as Record<string, unknown>).detected = false;

    const data2 = server.getData()!;
    expect(data2.detected).toBe(true);
    server.close();
  });
});
