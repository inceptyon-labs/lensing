import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createSceneScheduler } from '../scene-scheduler';
import { createDatabase } from '../database';
import { createSceneManager } from '../scene-manager';
import type { DatabaseInstance, SceneManagerInstance } from '@lensing/types';
import { cronTime } from '@lensing/types';

describe('Scene Scheduler', () => {
  let db: DatabaseInstance;
  let sceneManager: SceneManagerInstance;

  beforeEach(() => {
    db = createDatabase({ path: ':memory:' });
    sceneManager = createSceneManager();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-23T08:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    sceneManager.close();
    db.close();
  });

  it('should create a scheduler instance', () => {
    const scheduler = createSceneScheduler({ db, sceneManager });
    expect(scheduler).toBeDefined();
    expect(typeof scheduler.getActiveSchedule).toBe('function');
    expect(typeof scheduler.setSchedule).toBe('function');
    expect(typeof scheduler.start).toBe('function');
    expect(typeof scheduler.stop).toBe('function');
    expect(typeof scheduler.close).toBe('function');
    scheduler.close();
  });

  it('should return undefined when no schedule is set', () => {
    const scheduler = createSceneScheduler({ db, sceneManager });
    const active = scheduler.getActiveSchedule();
    expect(active).toBeUndefined();
    scheduler.close();
  });

  it('should save and retrieve a schedule', () => {
    const scheduler = createSceneScheduler({ db, sceneManager });

    const schedule = {
      id: 'default',
      name: 'Daily',
      entries: [
        { time: cronTime('06:00'), sceneName: 'morning' },
        { time: cronTime('18:00'), sceneName: 'evening' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    scheduler.setSchedule(schedule);
    const retrieved = scheduler.getActiveSchedule();

    expect(retrieved).toBeDefined();
    expect(retrieved!.name).toBe('Daily');
    expect(retrieved!.entries).toHaveLength(2);
    scheduler.close();
  });

  it('should persist schedule to database', () => {
    const scheduler = createSceneScheduler({ db, sceneManager });

    const schedule = {
      id: 'default',
      name: 'Test',
      entries: [{ time: cronTime('10:00'), sceneName: 'focus' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    scheduler.setSchedule(schedule);
    scheduler.close();

    // Create new scheduler to verify persistence
    const sceneManager2 = createSceneManager();
    const scheduler2 = createSceneScheduler({ db, sceneManager: sceneManager2 });
    const retrieved = scheduler2.getActiveSchedule();

    expect(retrieved).toBeDefined();
    expect(retrieved!.name).toBe('Test');
    scheduler2.close();
    sceneManager2.close();
  });

  it('should determine next scene for current time', () => {
    // Current time is 08:00 UTC (set in beforeEach)
    const scheduler = createSceneScheduler({ db, sceneManager });

    const schedule = {
      id: 'default',
      name: 'Test',
      entries: [
        { time: cronTime('06:00'), sceneName: 'morning' },
        { time: cronTime('18:00'), sceneName: 'evening' },
        { time: cronTime('23:00'), sceneName: 'ambient' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    scheduler.setSchedule(schedule);
    const next = scheduler.getNextScheduledScene();

    // At 08:00, the next entry is 18:00 evening
    expect(next).toBeDefined();
    expect(next!.time).toBe('18:00');
    expect(next!.sceneName).toBe('evening');
    scheduler.close();
  });

  it('should return first entry when past all times in day', () => {
    // Set time to 23:30
    vi.setSystemTime(new Date('2026-02-23T23:30:00Z'));

    const scheduler = createSceneScheduler({ db, sceneManager });

    const schedule = {
      id: 'default',
      name: 'Test',
      entries: [
        { time: cronTime('06:00'), sceneName: 'morning' },
        { time: cronTime('18:00'), sceneName: 'evening' },
        { time: cronTime('23:00'), sceneName: 'ambient' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    scheduler.setSchedule(schedule);
    const next = scheduler.getNextScheduledScene();

    // Next entry wraps to tomorrow's 06:00 morning
    expect(next).toBeDefined();
    expect(next!.sceneName).toBe('morning');
    scheduler.close();
  });

  it('should switch scene when timer reaches scheduled time', async () => {
    // Start at 08:00, schedule has morning at 06:00 and evening at 18:00
    const scheduler = createSceneScheduler({ db, sceneManager, timerInterval_ms: 100 });

    const schedule = {
      id: 'default',
      name: 'Test',
      entries: [
        { time: cronTime('06:00'), sceneName: 'morning' },
        { time: cronTime('18:00'), sceneName: 'evening' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    scheduler.setSchedule(schedule);
    // At 08:00, morning should be active
    expect(sceneManager.getActiveSceneName()).toBe('morning');

    scheduler.start();

    // Advance to 18:00
    vi.setSystemTime(new Date('2026-02-23T18:00:00Z'));
    vi.advanceTimersByTime(500);

    const active = sceneManager.getActiveSceneName();
    expect(active).toBe('evening');

    scheduler.close();
  });

  it('should not switch scene when manually overridden', () => {
    const scheduler = createSceneScheduler({ db, sceneManager, timerInterval_ms: 100 });

    const schedule = {
      id: 'default',
      name: 'Test',
      entries: [{ time: cronTime('18:00'), sceneName: 'evening' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    scheduler.setSchedule(schedule);
    scheduler.start();

    // Manual override
    scheduler.overrideScene('alert');
    expect(sceneManager.getActiveSceneName()).toBe('alert');

    // Advance to scheduled time
    vi.setSystemTime(new Date('2026-02-23T18:00:00Z'));
    vi.advanceTimersByTime(500);

    // Should remain on override, not switch to evening
    expect(sceneManager.getActiveSceneName()).toBe('alert');

    scheduler.close();
  });

  it('should clear override after specified duration', () => {
    const scheduler = createSceneScheduler({ db, sceneManager, timerInterval_ms: 100 });

    const schedule = {
      id: 'default',
      name: 'Test',
      entries: [{ time: cronTime('18:00'), sceneName: 'evening' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    scheduler.setSchedule(schedule);
    scheduler.start();

    const sceneBefore = sceneManager.getActiveSceneName();

    // Manual override for 5 seconds
    scheduler.overrideScene('alert', 5000);
    expect(sceneManager.getActiveSceneName()).toBe('alert');

    // After 6 seconds, override should be cleared
    vi.advanceTimersByTime(6000);

    // Should be back to original scene (before override)
    expect(sceneManager.getActiveSceneName()).not.toBe('alert');
    expect(sceneManager.getActiveSceneName()).toBe(sceneBefore);

    scheduler.close();
  });

  it('should handle scenes with no schedule entries', () => {
    const scheduler = createSceneScheduler({ db, sceneManager });

    const schedule = {
      id: 'default',
      name: 'Empty',
      entries: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    scheduler.setSchedule(schedule);
    const next = scheduler.getNextScheduledScene();

    expect(next).toBeUndefined();
    scheduler.close();
  });

  it('should listen to scene changes from setSchedule', () => {
    const scheduler = createSceneScheduler({ db, sceneManager });
    const changes: string[] = [];

    scheduler.onSceneChange((sceneName) => changes.push(sceneName));

    // At 08:00, setting a schedule with morning at 06:00 triggers switch
    const schedule = {
      id: 'default',
      name: 'Test',
      entries: [{ time: cronTime('06:00'), sceneName: 'morning' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    scheduler.setSchedule(schedule);
    // 06:00 is in the past at 08:00, so morning should be applied
    expect(changes.length).toBeGreaterThan(0);
    expect(changes[0]).toBe('morning');

    scheduler.close();
  });

  it('should return unsubscribe function from onSceneChange', () => {
    const scheduler = createSceneScheduler({ db, sceneManager });
    const changes: string[] = [];

    const unsub = scheduler.onSceneChange((name) => changes.push(name));

    const schedule = {
      id: 'default',
      name: 'Test',
      entries: [{ time: cronTime('06:00'), sceneName: 'morning' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    scheduler.setSchedule(schedule);
    const countAfterFirst = changes.length;
    expect(countAfterFirst).toBeGreaterThan(0);

    unsub();

    // Update schedule — no new notifications expected
    scheduler.setSchedule({ ...schedule, name: 'Test 2', updatedAt: new Date() });

    expect(changes.length).toBe(countAfterFirst);

    scheduler.close();
  });

  it('should gracefully handle start/stop lifecycle', () => {
    const scheduler = createSceneScheduler({ db, sceneManager });

    scheduler.start();
    scheduler.start(); // Should be idempotent
    scheduler.stop();
    scheduler.stop(); // Should be idempotent

    expect(() => scheduler.close()).not.toThrow();
  });

  it('should return getNextScheduledScene() as undefined with no schedule', () => {
    const scheduler = createSceneScheduler({ db, sceneManager });
    expect(scheduler.getNextScheduledScene()).toBeUndefined();
    scheduler.close();
  });

  it('should carry over last entry when before first entry time (midnight crossing)', () => {
    // Set time BEFORE creating scheduler so it loads at correct time
    vi.setSystemTime(new Date('2026-02-23T04:00:00Z'));

    const scheduler = createSceneScheduler({ db, sceneManager });

    // Schedule: 08:00 → ambient, 18:00 → focus
    const schedule = {
      id: 'midnight-test',
      name: 'Midnight Test',
      entries: [
        { time: cronTime('08:00'), sceneName: 'ambient' },
        { time: cronTime('18:00'), sceneName: 'focus' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // setSchedule calls applyCurrentScene at 04:00, should apply last entry (18:00 → focus)
    scheduler.setSchedule(schedule);

    // The active scene should be 'focus' (from yesterday's 18:00 entry)
    expect(sceneManager.getActiveSceneName()).toBe('focus');

    scheduler.close();
  });
});
