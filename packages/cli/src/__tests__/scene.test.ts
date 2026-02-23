import { describe, it, expect } from 'vitest';
import { listScenes, switchScene } from '../commands/scene';
import { DEFAULT_SCENES } from '@lensing/core';

describe('Scene CLI Commands', () => {
  describe('listScenes', () => {
    it('should list all available scenes', () => {
      const output = listScenes({ scenes: DEFAULT_SCENES, activeSceneName: 'ambient' });
      expect(typeof output).toBe('string');

      // Should mention all default scene names
      DEFAULT_SCENES.forEach((scene) => {
        expect(output).toContain(scene.name);
      });
    });

    it('should indicate the active scene', () => {
      const output = listScenes({ scenes: DEFAULT_SCENES, activeSceneName: 'morning' });
      expect(output).toContain('morning');
      expect(output).toMatch(/morning.*active|active.*morning|\*.*morning|morning.*\*/);
    });

    it('should show schedule entries when provided', () => {
      const output = listScenes({
        scenes: DEFAULT_SCENES,
        activeSceneName: 'ambient',
        scheduleEntries: [
          { time: '06:00' as unknown as import('@lensing/types').CronTime, sceneName: 'morning' },
          { time: '18:00' as unknown as import('@lensing/types').CronTime, sceneName: 'evening' },
          { time: '23:00' as unknown as import('@lensing/types').CronTime, sceneName: 'ambient' },
        ],
      });
      expect(output).toContain('06:00');
      expect(output).toContain('18:00');
      expect(output).toContain('23:00');
    });

    it('should handle no schedule when entries not provided', () => {
      const output = listScenes({ scenes: DEFAULT_SCENES, activeSceneName: 'ambient' });
      expect(typeof output).toBe('string');
      expect(output.length).toBeGreaterThan(0);
    });

    it('should handle empty scenes list', () => {
      const output = listScenes({ scenes: [], activeSceneName: '' });
      expect(typeof output).toBe('string');
    });
  });

  describe('switchScene', () => {
    it('should return the new active scene name on success', () => {
      const scenes = DEFAULT_SCENES.map((s) => s.name);
      const result = switchScene({ sceneName: 'morning', availableScenes: scenes });
      expect(result.success).toBe(true);
      expect(result.sceneName).toBe('morning');
    });

    it('should return error when scene does not exist', () => {
      const scenes = DEFAULT_SCENES.map((s) => s.name);
      const result = switchScene({ sceneName: 'nonexistent', availableScenes: scenes });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/nonexistent|not found|unknown/i);
    });

    it('should accept all default scene names', () => {
      const scenes = DEFAULT_SCENES.map((s) => s.name);
      DEFAULT_SCENES.forEach((scene) => {
        const result = switchScene({ sceneName: scene.name, availableScenes: scenes });
        expect(result.success).toBe(true);
      });
    });

    it('should return error for empty scene name', () => {
      const scenes = DEFAULT_SCENES.map((s) => s.name);
      const result = switchScene({ sceneName: '', availableScenes: scenes });
      expect(result.success).toBe(false);
    });
  });
});
