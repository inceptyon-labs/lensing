import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  saveWizardState,
  loadWizardState,
  clearWizardState,
  hasSavedState,
  createAutoSaver,
  type WizardState,
} from '../lib/builder-autosave';

describe('Builder Auto-Save Utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('saveWizardState', () => {
    it('should save wizard state to localStorage keyed by pluginId', () => {
      const pluginId = 'test-plugin-1';
      const state: WizardState = {
        metadata: {
          name: 'Test Plugin',
          description: 'A test plugin',
          category: 'data',
          icon: 'star',
          id: 'test-plugin-1',
        },
        connectorConfig: {
          selectedType: 'json_api',
          url: 'https://api.example.com/data',
          method: 'GET',
          refreshInterval: 300,
          headers: [],
        },
        fieldMappings: {
          title: { path: '$.title', value: 'Sample Title' },
          value: { path: '$.value', value: 123 },
        },
        editorProject: { pages: [], styles: [] },
        currentStep: 2,
        canvasSize: 'medium',
      };

      saveWizardState(pluginId, state);

      const stored = localStorage.getItem(`lensing:builder:${pluginId}`);
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.metadata.name).toBe('Test Plugin');
      expect(parsed.timestamp).toBeDefined();
    });

    it('should overwrite previous state for same pluginId', () => {
      const pluginId = 'test-plugin-1';
      const state1: WizardState = {
        metadata: { name: 'First', description: 'First plugin', category: 'data', icon: 'star', id: 'test-plugin-1' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 0,
        canvasSize: 'medium',
      };
      const state2: WizardState = {
        metadata: { name: 'Second', description: 'Second plugin', category: 'web', icon: 'globe', id: 'test-plugin-1' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 1,
        canvasSize: 'large',
      };

      saveWizardState(pluginId, state1);
      saveWizardState(pluginId, state2);

      const stored = JSON.parse(localStorage.getItem(`lensing:builder:${pluginId}`)!);
      expect(stored.metadata.name).toBe('Second');
      expect(stored.currentStep).toBe(1);
    });

    it('should include timestamp when saving', () => {
      const pluginId = 'test-plugin-1';
      const state: WizardState = {
        metadata: { name: 'Test', description: 'Test', category: 'data', icon: 'star', id: 'test-plugin-1' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 0,
        canvasSize: 'medium',
      };

      const beforeSave = Date.now();
      saveWizardState(pluginId, state);
      const afterSave = Date.now();

      const stored = JSON.parse(localStorage.getItem(`lensing:builder:${pluginId}`)!);
      expect(stored.timestamp).toBeGreaterThanOrEqual(beforeSave);
      expect(stored.timestamp).toBeLessThanOrEqual(afterSave);
    });
  });

  describe('loadWizardState', () => {
    it('should load wizard state from localStorage', () => {
      const pluginId = 'test-plugin-1';
      const state: WizardState = {
        metadata: {
          name: 'Test Plugin',
          description: 'A test plugin',
          category: 'data',
          icon: 'star',
          id: 'test-plugin-1',
        },
        connectorConfig: {
          selectedType: 'json_api',
          url: 'https://api.example.com/data',
          method: 'GET',
          refreshInterval: 300,
          headers: [{ key: 'X-API-Key', value: 'secret' }],
        },
        fieldMappings: {
          title: { path: '$.title', value: 'Sample Title' },
        },
        editorProject: { pages: [{ id: 'page-1', name: 'Page 1' }], styles: [] },
        currentStep: 2,
        canvasSize: 'large',
      };

      saveWizardState(pluginId, state);
      const loaded = loadWizardState(pluginId);

      expect(loaded).toBeTruthy();
      expect(loaded?.metadata.name).toBe('Test Plugin');
      expect(loaded?.connectorConfig?.url).toBe('https://api.example.com/data');
      expect(loaded?.fieldMappings.title.path).toBe('$.title');
      expect(loaded?.currentStep).toBe(2);
      expect(loaded?.canvasSize).toBe('large');
    });

    it('should return null if no saved state exists', () => {
      const loaded = loadWizardState('non-existent-plugin');
      expect(loaded).toBeNull();
    });

    it('should return null if localStorage is empty for pluginId', () => {
      localStorage.setItem('lensing:builder:test-plugin-1', '');
      const loaded = loadWizardState('test-plugin-1');
      expect(loaded).toBeNull();
    });

    it('should handle corrupted JSON gracefully', () => {
      localStorage.setItem('lensing:builder:test-plugin-1', 'not valid json {');
      const loaded = loadWizardState('test-plugin-1');
      expect(loaded).toBeNull();
    });

    it('should preserve optional null fields', () => {
      const pluginId = 'test-plugin-1';
      const state: WizardState = {
        metadata: { name: 'Test', description: 'Test', category: 'data', icon: 'star', id: 'test-plugin-1' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 0,
        canvasSize: 'medium',
      };

      saveWizardState(pluginId, state);
      const loaded = loadWizardState(pluginId);

      expect(loaded?.connectorConfig).toBeNull();
      expect(loaded?.editorProject).toBeNull();
      expect(loaded?.fieldMappings).toEqual({});
    });
  });

  describe('clearWizardState', () => {
    it('should remove saved state from localStorage', () => {
      const pluginId = 'test-plugin-1';
      const state: WizardState = {
        metadata: { name: 'Test', description: 'Test', category: 'data', icon: 'star', id: 'test-plugin-1' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 0,
        canvasSize: 'medium',
      };

      saveWizardState(pluginId, state);
      expect(localStorage.getItem(`lensing:builder:${pluginId}`)).toBeTruthy();

      clearWizardState(pluginId);
      expect(localStorage.getItem(`lensing:builder:${pluginId}`)).toBeNull();
    });

    it('should not throw when clearing non-existent state', () => {
      expect(() => clearWizardState('non-existent-plugin')).not.toThrow();
    });

    it('should only clear state for specified pluginId', () => {
      const state: WizardState = {
        metadata: { name: 'Test', description: 'Test', category: 'data', icon: 'star', id: 'test-plugin-1' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 0,
        canvasSize: 'medium',
      };

      saveWizardState('plugin-1', state);
      saveWizardState('plugin-2', state);

      clearWizardState('plugin-1');

      expect(localStorage.getItem('lensing:builder:plugin-1')).toBeNull();
      expect(localStorage.getItem('lensing:builder:plugin-2')).toBeTruthy();
    });
  });

  describe('hasSavedState', () => {
    it('should return true if saved state exists', () => {
      const pluginId = 'test-plugin-1';
      const state: WizardState = {
        metadata: { name: 'Test', description: 'Test', category: 'data', icon: 'star', id: 'test-plugin-1' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 0,
        canvasSize: 'medium',
      };

      saveWizardState(pluginId, state);
      expect(hasSavedState(pluginId)).toBe(true);
    });

    it('should return false if no saved state exists', () => {
      expect(hasSavedState('non-existent-plugin')).toBe(false);
    });

    it('should return false if state was cleared', () => {
      const pluginId = 'test-plugin-1';
      const state: WizardState = {
        metadata: { name: 'Test', description: 'Test', category: 'data', icon: 'star', id: 'test-plugin-1' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 0,
        canvasSize: 'medium',
      };

      saveWizardState(pluginId, state);
      clearWizardState(pluginId);
      expect(hasSavedState(pluginId)).toBe(false);
    });
  });

  describe('createAutoSaver factory', () => {
    it('should return object with save, load, clear, hasSaved methods', () => {
      const saver = createAutoSaver('test-plugin-1');

      expect(typeof saver.save).toBe('function');
      expect(typeof saver.load).toBe('function');
      expect(typeof saver.clear).toBe('function');
      expect(typeof saver.hasSaved).toBe('function');
      expect(typeof saver.startPeriodicSave).toBe('function');
      expect(typeof saver.stopPeriodicSave).toBe('function');
    });

    it('should save and load state via factory methods', () => {
      const saver = createAutoSaver('test-plugin-1');
      const state: WizardState = {
        metadata: { name: 'Test', description: 'Test', category: 'data', icon: 'star', id: 'test-plugin-1' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 1,
        canvasSize: 'medium',
      };

      saver.save(state);
      const loaded = saver.load();

      expect(loaded?.metadata.name).toBe('Test');
      expect(loaded?.currentStep).toBe(1);
    });

    it('should isolate state by pluginId', () => {
      const saver1 = createAutoSaver('plugin-1');
      const saver2 = createAutoSaver('plugin-2');
      const state1: WizardState = {
        metadata: { name: 'Plugin 1', description: 'Plugin 1', category: 'data', icon: 'star', id: 'plugin-1' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 0,
        canvasSize: 'medium',
      };
      const state2: WizardState = {
        metadata: { name: 'Plugin 2', description: 'Plugin 2', category: 'web', icon: 'globe', id: 'plugin-2' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 1,
        canvasSize: 'large',
      };

      saver1.save(state1);
      saver2.save(state2);

      expect(saver1.load()?.metadata.name).toBe('Plugin 1');
      expect(saver2.load()?.metadata.name).toBe('Plugin 2');
    });

    it('startPeriodicSave should save state every 30 seconds', () => {
      vi.useFakeTimers();
      const saver = createAutoSaver('test-plugin-1');
      const state: WizardState = {
        metadata: { name: 'Test', description: 'Test', category: 'data', icon: 'star', id: 'test-plugin-1' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 0,
        canvasSize: 'medium',
      };

      const getState = vi.fn(() => state);
      const cleanup = saver.startPeriodicSave(getState);

      // First save happens before first interval
      expect(hasSavedState('test-plugin-1')).toBe(true);

      vi.advanceTimersByTime(30000);
      expect(saver.load()?.metadata.name).toBe('Test');

      vi.advanceTimersByTime(30000);
      expect(saver.load()?.metadata.name).toBe('Test');

      cleanup();
      vi.useRealTimers();
    });

    it('stopPeriodicSave should stop saving', () => {
      vi.useFakeTimers();
      const saver = createAutoSaver('test-plugin-1');
      let state: WizardState = {
        metadata: { name: 'Initial', description: 'Test', category: 'data', icon: 'star', id: 'test-plugin-1' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 0,
        canvasSize: 'medium',
      };

      const getState = vi.fn(() => state);
      const cleanup = saver.startPeriodicSave(getState);

      vi.advanceTimersByTime(30000);
      expect(saver.load()?.metadata.name).toBe('Initial');

      // Stop periodic save
      cleanup();

      // Update state but periodic save is stopped
      state = {
        ...state,
        metadata: { ...state.metadata, name: 'Updated' },
      };

      vi.advanceTimersByTime(30000);
      // Should still have old state
      expect(saver.load()?.metadata.name).toBe('Initial');

      vi.useRealTimers();
    });

    it('should handle localStorage unavailable gracefully', () => {
      // Mock localStorage to throw
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('localStorage not available');
      });

      const saver = createAutoSaver('test-plugin-1');
      const state: WizardState = {
        metadata: { name: 'Test', description: 'Test', category: 'data', icon: 'star', id: 'test-plugin-1' },
        connectorConfig: null,
        fieldMappings: {},
        editorProject: null,
        currentStep: 0,
        canvasSize: 'medium',
      };

      expect(() => saver.save(state)).not.toThrow();

      // Restore
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('scoped multiple drafts', () => {
    it('should support multiple concurrent drafts for different plugins', () => {
      const state1: WizardState = {
        metadata: { name: 'Weather Widget', description: 'Displays weather', category: 'data', icon: 'cloud', id: 'weather-widget' },
        connectorConfig: { selectedType: 'json_api', url: 'https://weather.api', method: 'GET', refreshInterval: 600, headers: [] },
        fieldMappings: { temp: { path: '$.temp', value: 72 } },
        editorProject: null,
        currentStep: 2,
        canvasSize: 'small',
      };
      const state2: WizardState = {
        metadata: { name: 'News Reader', description: 'Displays news', category: 'web', icon: 'newspaper', id: 'news-reader' },
        connectorConfig: { selectedType: 'rss_feed', url: 'https://news.rss', method: 'GET', refreshInterval: 1800, headers: [] },
        fieldMappings: { headline: { path: '$.title', value: 'Breaking News' }, image: { path: '$.image', value: 'https://...' } },
        editorProject: null,
        currentStep: 2,
        canvasSize: 'large',
      };

      saveWizardState('weather-widget', state1);
      saveWizardState('news-reader', state2);

      expect(loadWizardState('weather-widget')?.metadata.name).toBe('Weather Widget');
      expect(loadWizardState('news-reader')?.metadata.name).toBe('News Reader');
      expect(loadWizardState('weather-widget')?.currentStep).toBe(2);
      expect(loadWizardState('news-reader')?.fieldMappings.headline.value).toBe('Breaking News');
    });
  });
});
