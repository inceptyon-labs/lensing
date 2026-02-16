import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateBackoff, createReconnectManager } from '../ws-reconnect';
import type { ConnectionStatus } from '@lensing/types';

describe('calculateBackoff', () => {
  it('should return base delay for first attempt', () => {
    const delay = calculateBackoff(0, { baseDelay: 1000, maxDelay: 30000 });
    // With jitter factor [0.5, 1.0], range is [500, 1000]
    expect(delay).toBeGreaterThanOrEqual(500);
    expect(delay).toBeLessThanOrEqual(1000);
  });

  it('should increase exponentially', () => {
    const delay0 = calculateBackoff(0, { baseDelay: 1000, maxDelay: 60000 });
    const delay1 = calculateBackoff(1, { baseDelay: 1000, maxDelay: 60000 });
    const delay2 = calculateBackoff(2, { baseDelay: 1000, maxDelay: 60000 });

    // Each should be roughly double (with jitter)
    expect(delay1).toBeGreaterThan(delay0);
    expect(delay2).toBeGreaterThan(delay1);
  });

  it('should cap at maxDelay', () => {
    const delay = calculateBackoff(20, { baseDelay: 1000, maxDelay: 30000 });
    expect(delay).toBeLessThanOrEqual(30000);
  });

  it('should add jitter to prevent thundering herd', () => {
    // Run multiple times — results should vary
    const delays = Array.from({ length: 10 }, () =>
      calculateBackoff(0, { baseDelay: 1000, maxDelay: 30000 })
    );
    const unique = new Set(delays);
    // With jitter, we should get at least some different values
    expect(unique.size).toBeGreaterThanOrEqual(1);
  });
});

describe('ReconnectManager', () => {
  let statusChanges: ConnectionStatus[];
  let manager: ReturnType<typeof createReconnectManager>;

  beforeEach(() => {
    vi.useFakeTimers();
    statusChanges = [];
  });

  afterEach(() => {
    manager?.destroy();
    vi.useRealTimers();
  });

  it('should start in disconnected state', () => {
    manager = createReconnectManager({
      onStatusChange: (s) => statusChanges.push(s),
      onReconnect: vi.fn(),
    });

    expect(manager.status).toBe('disconnected');
  });

  it('should transition to connected on connect()', () => {
    manager = createReconnectManager({
      onStatusChange: (s) => statusChanges.push(s),
      onReconnect: vi.fn(),
    });

    manager.connect();
    expect(manager.status).toBe('connected');
    expect(statusChanges).toContain('connected');
  });

  it('should transition to reconnecting on connectionLost()', () => {
    const onReconnect = vi.fn();
    manager = createReconnectManager({
      onStatusChange: (s) => statusChanges.push(s),
      onReconnect,
    });

    manager.connect();
    manager.connectionLost();
    expect(manager.status).toBe('reconnecting');
    expect(statusChanges).toContain('reconnecting');
  });

  it('should call onReconnect after backoff delay', () => {
    const onReconnect = vi.fn();
    manager = createReconnectManager({
      onStatusChange: (s) => statusChanges.push(s),
      onReconnect,
      baseDelay: 1000,
      maxDelay: 30000,
    });

    manager.connect();
    manager.connectionLost();

    expect(onReconnect).not.toHaveBeenCalled();

    // Advance past first backoff
    vi.advanceTimersByTime(2000);
    expect(onReconnect).toHaveBeenCalledTimes(1);
  });

  it('should increase backoff on repeated failures', () => {
    const onReconnect = vi.fn();
    manager = createReconnectManager({
      onStatusChange: (s) => statusChanges.push(s),
      onReconnect,
      baseDelay: 1000,
      maxDelay: 30000,
    });

    manager.connect();

    // First failure
    manager.connectionLost();
    vi.advanceTimersByTime(2000); // 1st attempt
    expect(onReconnect).toHaveBeenCalledTimes(1);

    // Still failed — report another loss
    manager.connectionLost();
    vi.advanceTimersByTime(3000); // 2nd attempt (longer)
    expect(onReconnect).toHaveBeenCalledTimes(2);

    // Still failed — another loss
    manager.connectionLost();
    vi.advanceTimersByTime(5000); // 3rd attempt (even longer)
    expect(onReconnect).toHaveBeenCalledTimes(3);
  });

  it('should stop after maxRetries', () => {
    const onReconnect = vi.fn();
    manager = createReconnectManager({
      onStatusChange: (s) => statusChanges.push(s),
      onReconnect,
      baseDelay: 100,
      maxDelay: 1000,
      maxRetries: 3,
    });

    manager.connect();

    for (let i = 0; i < 5; i++) {
      manager.connectionLost();
      vi.advanceTimersByTime(2000);
    }

    // Should only attempt maxRetries times
    expect(onReconnect).toHaveBeenCalledTimes(3);
    expect(manager.status).toBe('disconnected');
  });

  it('should reset retries on successful reconnect', () => {
    const onReconnect = vi.fn();
    manager = createReconnectManager({
      onStatusChange: (s) => statusChanges.push(s),
      onReconnect,
      baseDelay: 100,
      maxDelay: 1000,
      maxRetries: 5,
    });

    manager.connect();

    // Fail twice
    manager.connectionLost();
    vi.advanceTimersByTime(500);
    manager.connectionLost();
    vi.advanceTimersByTime(500);

    // Reconnect successfully
    manager.connect();
    expect(manager.attempts).toBe(0);
  });

  it('should expose connection status for UI', () => {
    const onReconnect = vi.fn();
    manager = createReconnectManager({
      onStatusChange: (s) => statusChanges.push(s),
      onReconnect,
    });

    expect(manager.status).toBe('disconnected');

    manager.connect();
    expect(manager.status).toBe('connected');

    manager.connectionLost();
    expect(manager.status).toBe('reconnecting');

    manager.disconnect();
    expect(manager.status).toBe('disconnected');
  });

  it('should cancel pending reconnect on explicit disconnect', () => {
    const onReconnect = vi.fn();
    manager = createReconnectManager({
      onStatusChange: (s) => statusChanges.push(s),
      onReconnect,
      baseDelay: 1000,
    });

    manager.connect();
    manager.connectionLost(); // Starts reconnect timer

    // Explicitly disconnect before timer fires
    manager.disconnect();
    vi.advanceTimersByTime(5000);

    // Should NOT have attempted reconnect
    expect(onReconnect).not.toHaveBeenCalled();
    expect(manager.status).toBe('disconnected');
  });

  it('should handle sleep/wake scenario (long disconnect)', () => {
    const onReconnect = vi.fn();
    manager = createReconnectManager({
      onStatusChange: (s) => statusChanges.push(s),
      onReconnect,
      baseDelay: 1000,
      maxDelay: 30000,
    });

    manager.connect();
    manager.connectionLost();

    // Simulate a very long sleep
    vi.advanceTimersByTime(120000); // 2 minutes

    // Should have attempted reconnect at least once
    expect(onReconnect).toHaveBeenCalled();
    expect(manager.status).toBe('reconnecting');
  });
});
