import { describe, it, expect } from 'vitest';
import { createPresenceStore } from '../presence-store';
import type { PresenceData } from '@lensing/types';

describe('Presence Store', () => {
  it('should create a store instance with expected methods', () => {
    const store = createPresenceStore();

    expect(typeof store.getState).toBe('function');
    expect(typeof store.setData).toBe('function');
    expect(typeof store.onChange).toBe('function');
    expect(typeof store.isMotionDetected).toBe('function');
  });

  it('should return initial state with presence=false', () => {
    const store = createPresenceStore();
    const state = store.getState();

    expect(state.detected).toBe(false);
    expect(state.available).toBe(false);
    expect(state.timeSinceMotionMs).toBe(0);
  });

  it('should update state when setData is called', () => {
    const store = createPresenceStore();

    const presenceData: PresenceData = {
      detected: true,
      lastMotionAt: Date.now() - 1000,
      available: true,
      lastUpdated: Date.now(),
    };

    store.setData(presenceData);
    const state = store.getState();

    expect(state.detected).toBe(true);
    expect(state.available).toBe(true);
  });

  it('should calculate timeSinceMotionMs correctly', () => {
    const store = createPresenceStore();

    const now = Date.now();
    const presenceData: PresenceData = {
      detected: true,
      lastMotionAt: now - 5000,
      available: true,
      lastUpdated: now,
    };

    store.setData(presenceData);
    const state = store.getState();

    // Should be approximately 5000ms
    expect(state.timeSinceMotionMs).toBeGreaterThanOrEqual(4900);
    expect(state.timeSinceMotionMs).toBeLessThanOrEqual(5100);
  });

  it('should call onChange listeners when data changes', () => {
    const store = createPresenceStore();

    const changes: number[] = [];
    store.onChange(() => changes.push(1));

    const presenceData: PresenceData = {
      detected: true,
      lastMotionAt: Date.now(),
      available: true,
      lastUpdated: Date.now(),
    };

    store.setData(presenceData);

    expect(changes).toHaveLength(1);
  });

  it('should support multiple onChange listeners', () => {
    const store = createPresenceStore();

    const calls1: number[] = [];
    const calls2: number[] = [];

    store.onChange(() => calls1.push(1));
    store.onChange(() => calls2.push(1));

    const presenceData: PresenceData = {
      detected: true,
      lastMotionAt: Date.now(),
      available: true,
      lastUpdated: Date.now(),
    };

    store.setData(presenceData);

    expect(calls1).toHaveLength(1);
    expect(calls2).toHaveLength(1);
  });

  it('should return unsubscribe function from onChange', () => {
    const store = createPresenceStore();

    const changes: number[] = [];
    const unsubscribe = store.onChange(() => changes.push(1));

    const presenceData: PresenceData = {
      detected: true,
      lastMotionAt: Date.now(),
      available: true,
      lastUpdated: Date.now(),
    };

    store.setData(presenceData);
    unsubscribe();
    store.setData(presenceData);

    expect(changes).toHaveLength(1);
  });

  it('should provide isMotionDetected() helper', () => {
    const store = createPresenceStore();

    expect(store.isMotionDetected()).toBe(false);

    const presenceData: PresenceData = {
      detected: true,
      lastMotionAt: Date.now(),
      available: true,
      lastUpdated: Date.now(),
    };

    store.setData(presenceData);
    expect(store.isMotionDetected()).toBe(true);
  });

  it('should return defensive copy from getState', () => {
    const store = createPresenceStore();

    const presenceData: PresenceData = {
      detected: true,
      lastMotionAt: Date.now(),
      available: true,
      lastUpdated: Date.now(),
    };

    store.setData(presenceData);

    const state1 = store.getState();
    (state1 as unknown as Record<string, unknown>).detected = false;

    const state2 = store.getState();
    expect(state2.detected).toBe(true);
  });

  it('should handle available=false state', () => {
    const store = createPresenceStore();

    const presenceData: PresenceData = {
      detected: false,
      lastMotionAt: 0,
      available: false,
      lastUpdated: Date.now(),
    };

    store.setData(presenceData);
    const state = store.getState();

    expect(state.available).toBe(false);
  });

  it('should isolate onChange listener errors', () => {
    const store = createPresenceStore();

    const calls: number[] = [];

    store.onChange(() => {
      throw new Error('First listener error');
    });

    store.onChange(() => {
      calls.push(1);
    });

    const presenceData: PresenceData = {
      detected: true,
      lastMotionAt: Date.now(),
      available: true,
      lastUpdated: Date.now(),
    };

    // Should not throw, second listener should still be called
    store.setData(presenceData);

    expect(calls).toHaveLength(1);
  });
});
