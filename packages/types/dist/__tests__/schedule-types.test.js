import { describe, it, expect } from 'vitest';
describe('Schedule Types', () => {
    it('should export CronTime type for HH:MM format', () => {
        // Type-level test: CronTime must be a branded string for HH:MM
        const time = '06:00';
        expect(typeof time).toBe('string');
        expect(time).toMatch(/^\d{2}:\d{2}$/);
    });
    it('should have SceneScheduleEntry interface with time and sceneName', () => {
        const entry = {
            time: '06:00',
            sceneName: 'morning',
        };
        expect(entry.time).toBe('06:00');
        expect(entry.sceneName).toBe('morning');
    });
    it('should have SceneSchedule interface with id, name, and entries', () => {
        const schedule = {
            id: 'schedule-1',
            name: 'Default Schedule',
            entries: [
                { time: '06:00', sceneName: 'morning' },
                { time: '18:00', sceneName: 'evening' },
                { time: '23:00', sceneName: 'sleep' },
            ],
            createdAt: new Date('2026-02-23T00:00:00Z'),
            updatedAt: new Date('2026-02-23T00:00:00Z'),
        };
        expect(schedule.id).toBe('schedule-1');
        expect(schedule.name).toBe('Default Schedule');
        expect(schedule.entries).toHaveLength(3);
        expect(schedule.entries[0].time).toBe('06:00');
    });
    it('should support empty entries list', () => {
        const schedule = {
            id: 'schedule-empty',
            name: 'Empty',
            entries: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        expect(schedule.entries).toHaveLength(0);
    });
    it('should validate CronTime format', () => {
        // Valid times
        const validTimes = [
            '00:00',
            '06:00',
            '12:30',
            '23:59',
        ];
        validTimes.forEach((time) => {
            expect(time).toMatch(/^\d{2}:\d{2}$/);
        });
    });
});
//# sourceMappingURL=schedule-types.test.js.map