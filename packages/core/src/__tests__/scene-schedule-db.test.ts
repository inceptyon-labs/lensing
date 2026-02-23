import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createDatabase } from '../database';
import type { DatabaseInstance, SceneSchedule } from '@lensing/types';
import { cronTime } from '@lensing/types';

describe('Database: Scene Schedules', () => {
  let db: DatabaseInstance;
  const testDbPath = ':memory:';

  beforeEach(() => {
    db = createDatabase({ path: testDbPath });
  });

  afterEach(() => {
    db.close();
  });

  it('should save and retrieve a schedule', () => {
    const schedule: SceneSchedule = {
      id: 'schedule-1',
      name: 'Default',
      entries: [
        { time: cronTime('06:00'), sceneName: 'morning' },
        { time: cronTime('18:00'), sceneName: 'evening' },
      ],
      createdAt: new Date('2026-02-23T00:00:00Z'),
      updatedAt: new Date('2026-02-23T00:00:00Z'),
    };

    db.setSchedule(schedule);
    const retrieved = db.getSchedule('schedule-1');

    expect(retrieved).toBeDefined();
    expect(retrieved!.name).toBe('Default');
    expect(retrieved!.entries).toHaveLength(2);
    expect(retrieved!.entries[0].time).toBe('06:00');
  });

  it('should return undefined for non-existent schedule', () => {
    const schedule = db.getSchedule('nonexistent');
    expect(schedule).toBeUndefined();
  });

  it('should update an existing schedule', () => {
    const schedule1: SceneSchedule = {
      id: 'schedule-1',
      name: 'Version 1',
      entries: [{ time: cronTime('06:00'), sceneName: 'morning' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.setSchedule(schedule1);

    const schedule2: SceneSchedule = {
      id: 'schedule-1',
      name: 'Version 2',
      entries: [
        { time: cronTime('06:00'), sceneName: 'morning' },
        { time: cronTime('22:00'), sceneName: 'sleep' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.setSchedule(schedule2);
    const retrieved = db.getSchedule('schedule-1');

    expect(retrieved!.name).toBe('Version 2');
    expect(retrieved!.entries).toHaveLength(2);
  });

  it('should get all schedules', () => {
    const sched1: SceneSchedule = {
      id: 'schedule-1',
      name: 'Schedule 1',
      entries: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const sched2: SceneSchedule = {
      id: 'schedule-2',
      name: 'Schedule 2',
      entries: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.setSchedule(sched1);
    db.setSchedule(sched2);

    const all = db.getAllSchedules();
    expect(Object.keys(all)).toHaveLength(2);
    expect(all['schedule-1'].name).toBe('Schedule 1');
    expect(all['schedule-2'].name).toBe('Schedule 2');
  });

  it('should delete a schedule', () => {
    const schedule: SceneSchedule = {
      id: 'schedule-1',
      name: 'To Delete',
      entries: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.setSchedule(schedule);
    expect(db.getSchedule('schedule-1')).toBeDefined();

    const deleted = db.deleteSchedule('schedule-1');
    expect(deleted).toBe(true);
    expect(db.getSchedule('schedule-1')).toBeUndefined();
  });

  it('should return false when deleting non-existent schedule', () => {
    const deleted = db.deleteSchedule('nonexistent');
    expect(deleted).toBe(false);
  });

  it('should persist dates correctly', () => {
    const now = new Date('2026-02-23T12:34:56Z');
    const schedule: SceneSchedule = {
      id: 'schedule-1',
      name: 'Test',
      entries: [],
      createdAt: now,
      updatedAt: now,
    };

    db.setSchedule(schedule);
    const retrieved = db.getSchedule('schedule-1')!;

    // Dates should be equal after JSON round-trip
    expect(retrieved.createdAt).toEqual(now);
    expect(retrieved.updatedAt).toEqual(now);
  });

  it('should handle empty schedule entries', () => {
    const schedule: SceneSchedule = {
      id: 'schedule-empty',
      name: 'Empty',
      entries: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.setSchedule(schedule);
    const retrieved = db.getSchedule('schedule-empty')!;

    expect(retrieved.entries).toHaveLength(0);
  });
});
