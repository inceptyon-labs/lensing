import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createSceneManager, DEFAULT_SCENES } from '../scene-manager';
import type { SceneManagerInstance, SceneConfig, ScenePersistence } from '@lensing/types';

describe('SceneManager', () => {
  let manager: SceneManagerInstance;

  beforeEach(() => {
    manager = createSceneManager();
  });

  describe('default scenes', () => {
    it('should load 5 default scenes on init', () => {
      const scenes = manager.getScenes();
      expect(scenes).toHaveLength(5);
    });

    it('should include morning, evening, ambient, focus, and alert scenes', () => {
      const names = manager.getScenes().map((s) => s.name);
      expect(names).toEqual(
        expect.arrayContaining(['morning', 'evening', 'ambient', 'focus', 'alert'])
      );
    });

    it('should set ambient as the default active scene', () => {
      expect(manager.getActiveSceneName()).toBe('ambient');
    });

    it('should export default scenes for reuse', () => {
      expect(DEFAULT_SCENES).toHaveLength(5);
      expect(DEFAULT_SCENES.map((s) => s.name)).toEqual(
        expect.arrayContaining(['morning', 'evening', 'ambient', 'focus', 'alert'])
      );
    });

    it('should include visual settings on default scenes', () => {
      const morning = manager.getScene('morning');
      expect(morning).toBeDefined();
      expect(morning!.visuals).toBeDefined();
      expect(morning!.visuals!.opacity).toBeGreaterThanOrEqual(0);
      expect(morning!.visuals!.opacity).toBeLessThanOrEqual(1);
      expect(['warm', 'neutral', 'cool']).toContain(morning!.visuals!.color_temp);
    });
  });

  describe('getScene', () => {
    it('should return a scene by name', () => {
      const scene = manager.getScene('focus');
      expect(scene).toBeDefined();
      expect(scene!.name).toBe('focus');
    });

    it('should return undefined for unknown scene', () => {
      const scene = manager.getScene('nonexistent');
      expect(scene).toBeUndefined();
    });
  });

  describe('getActiveScene', () => {
    it('should return the active scene config', () => {
      const active = manager.getActiveScene();
      expect(active.name).toBe('ambient');
    });
  });

  describe('switchTo', () => {
    it('should switch to a named scene', () => {
      const scene = manager.switchTo('morning');
      expect(scene.name).toBe('morning');
      expect(manager.getActiveSceneName()).toBe('morning');
    });

    it('should throw for unknown scene name', () => {
      expect(() => manager.switchTo('nonexistent')).toThrow('Unknown scene');
    });

    it('should notify listeners on scene change', () => {
      const callback = vi.fn();
      manager.onSceneChange(callback);

      manager.switchTo('evening');

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback.mock.calls[0][0].name).toBe('evening');
    });

    it('should not notify if switching to already active scene', () => {
      const callback = vi.fn();
      manager.onSceneChange(callback);

      manager.switchTo('ambient'); // Already active
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('addScene', () => {
    it('should add a new custom scene', () => {
      const customScene: SceneConfig = {
        name: 'movie-night',
        layout: [],
        active_plugins: ['clock'],
        visuals: { opacity: 0.3, color_temp: 'warm' },
      };

      manager.addScene(customScene);

      const scene = manager.getScene('movie-night');
      expect(scene).toBeDefined();
      expect(scene!.visuals!.opacity).toBe(0.3);
    });

    it('should throw when adding a scene with duplicate name', () => {
      expect(() =>
        manager.addScene({
          name: 'morning',
          layout: [],
          active_plugins: [],
        })
      ).toThrow('already exists');
    });
  });

  describe('updateScene', () => {
    it('should update scene properties', () => {
      const updated = manager.updateScene('morning', {
        visuals: { opacity: 0.5, color_temp: 'cool' },
      });

      expect(updated.visuals!.opacity).toBe(0.5);
      expect(updated.visuals!.color_temp).toBe('cool');
    });

    it('should preserve unchanged fields', () => {
      const before = manager.getScene('morning')!;
      const originalPlugins = [...before.active_plugins];

      manager.updateScene('morning', {
        visuals: { opacity: 0.5, color_temp: 'cool' },
      });

      const after = manager.getScene('morning')!;
      expect(after.active_plugins).toEqual(originalPlugins);
    });

    it('should throw for unknown scene', () => {
      expect(() => manager.updateScene('nonexistent', { layout: [] })).toThrow('Unknown scene');
    });

    it('should notify listeners when active scene is updated', () => {
      const callback = vi.fn();
      manager.onSceneChange(callback);

      manager.updateScene('ambient', {
        visuals: { opacity: 0.5, color_temp: 'warm' },
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeScene', () => {
    it('should remove a scene by name', () => {
      manager.switchTo('morning');
      manager.removeScene('alert');

      expect(manager.getScene('alert')).toBeUndefined();
      expect(manager.getScenes()).toHaveLength(4);
    });

    it('should throw when removing the active scene', () => {
      expect(() => manager.removeScene('ambient')).toThrow('Cannot remove the active scene');
    });

    it('should throw when removing unknown scene', () => {
      expect(() => manager.removeScene('nonexistent')).toThrow('Unknown scene');
    });
  });

  describe('onSceneChange', () => {
    it('should return an unsubscribe function', () => {
      const callback = vi.fn();
      const unsubscribe = manager.onSceneChange(callback);

      manager.switchTo('morning');
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();

      manager.switchTo('evening');
      expect(callback).toHaveBeenCalledTimes(1); // Not called again
    });

    it('should isolate errors in listeners', () => {
      const errorCb = vi.fn(() => {
        throw new Error('Listener error');
      });
      const goodCb = vi.fn();

      manager.onSceneChange(errorCb);
      manager.onSceneChange(goodCb);

      manager.switchTo('morning');

      expect(errorCb).toHaveBeenCalledTimes(1);
      expect(goodCb).toHaveBeenCalledTimes(1);
    });
  });

  describe('persistence', () => {
    it('should call save callback on scene changes', async () => {
      const save = vi.fn().mockResolvedValue(undefined);
      const persistence: ScenePersistence = {
        save,
        load: vi.fn().mockResolvedValue(null),
      };

      manager = createSceneManager({ persistence });

      manager.switchTo('morning');

      // save is called asynchronously
      await vi.waitFor(() => {
        expect(save).toHaveBeenCalled();
      });
    });

    it('should load scenes from persistence on init', async () => {
      const customScenes: SceneConfig[] = [
        { name: 'custom', layout: [], active_plugins: ['weather'] },
      ];
      const persistence: ScenePersistence = {
        save: vi.fn().mockResolvedValue(undefined),
        load: vi.fn().mockResolvedValue({ scenes: customScenes, activeScene: 'custom' }),
      };

      manager = await createSceneManager({ persistence }).loadFromPersistence();

      expect(manager.getScene('custom')).toBeDefined();
      expect(manager.getActiveSceneName()).toBe('custom');
    });
  });

  describe('close', () => {
    it('should stop all listeners after close', () => {
      const callback = vi.fn();
      manager.onSceneChange(callback);

      manager.close();

      manager.switchTo('morning');
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
