import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createDevServer, type DevServer } from '../dev-server';
import type { PluginManifest } from '@lensing/types';

const validManifest: PluginManifest = {
  id: 'weather',
  name: 'Weather Widget',
  version: '1.0.0',
  ui_entry: './dist/widget.js',
};

const fixtures: Record<string, string> = {
  'weather.json': JSON.stringify({ temp: 72 }),
  'calendar.json': JSON.stringify({ events: [] }),
};

function createMockFs() {
  return {
    readFile: vi.fn(async (path: string): Promise<string> => {
      if (path.endsWith('plugin.json')) {
        return JSON.stringify(validManifest);
      }
      const filename = path.split('/').pop() ?? path;
      if (fixtures[filename]) return fixtures[filename];
      throw new Error(`ENOENT: ${path}`);
    }),
    readDir: vi.fn(async (): Promise<string[]> => {
      return Object.keys(fixtures);
    }),
    watch: vi.fn((_path: string, callback: (event: string, filename: string) => void) => {
      return { callback, close: vi.fn() };
    }),
  };
}

describe('DevServer', () => {
  let server: DevServer;
  let mockFs: ReturnType<typeof createMockFs>;

  beforeEach(() => {
    mockFs = createMockFs();
    server = createDevServer({
      pluginDir: '/plugins/weather',
      fixturesDir: '/plugins/weather/fixtures',
      readFile: mockFs.readFile,
      readDir: mockFs.readDir,
      watch: mockFs.watch,
    });
  });

  describe('start', () => {
    it('should start successfully with valid manifest', async () => {
      await server.start();
      expect(server.isRunning()).toBe(true);
    });

    it('should load and validate manifest on start', async () => {
      await server.start();
      const manifest = server.getManifest();
      expect(manifest).toBeDefined();
      expect(manifest?.id).toBe('weather');
    });

    it('should load fixtures on start', async () => {
      await server.start();
      const loaded = server.getFixtures();
      expect(loaded['weather']).toEqual({ temp: 72 });
    });

    it('should throw on invalid manifest', async () => {
      mockFs.readFile.mockImplementation(async (path: string) => {
        if (path.endsWith('plugin.json')) return '{"invalid": true}';
        return '{}';
      });

      await expect(server.start()).rejects.toThrow('Invalid plugin manifest');
    });

    it('should throw on unparseable manifest JSON', async () => {
      mockFs.readFile.mockImplementation(async (path: string) => {
        if (path.endsWith('plugin.json')) return '{not json';
        return '{}';
      });

      await expect(server.start()).rejects.toThrow();
    });

    it('should start file watcher', async () => {
      await server.start();
      expect(mockFs.watch).toHaveBeenCalled();
    });

    it('should not start twice', async () => {
      await server.start();
      await server.start(); // second start is a no-op
      expect(server.isRunning()).toBe(true);
    });
  });

  describe('stop', () => {
    it('should stop the server', async () => {
      await server.start();
      server.stop();
      expect(server.isRunning()).toBe(false);
    });

    it('should close file watcher on stop', async () => {
      await server.start();
      const watcherResult = mockFs.watch.mock.results[0].value;
      server.stop();
      expect(watcherResult.close).toHaveBeenCalled();
    });

    it('should be safe to stop when not running', () => {
      expect(() => server.stop()).not.toThrow();
    });
  });

  describe('reload', () => {
    it('should reload manifest and fixtures', async () => {
      await server.start();

      // Change fixture data
      mockFs.readFile.mockImplementation(async (path: string) => {
        if (path.endsWith('plugin.json')) return JSON.stringify(validManifest);
        if (path.includes('weather.json')) return JSON.stringify({ temp: 85 });
        return '{}';
      });

      await server.reload();
      expect(server.getFixtures()['weather']).toEqual({ temp: 85 });
    });

    it('should throw if not running', async () => {
      await expect(server.reload()).rejects.toThrow('Server is not running');
    });
  });

  describe('onReload callback', () => {
    it('should fire callback on reload', async () => {
      const callback = vi.fn();
      server.onReload(callback);
      await server.start();
      await server.reload();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should fire callback when file watcher triggers', async () => {
      const callback = vi.fn();
      server.onReload(callback);
      await server.start();

      // Simulate file change via the watcher callback
      const watcherResult = mockFs.watch.mock.results[0].value;
      watcherResult.callback('change', 'widget.js');

      // Wait for debounced reload
      await new Promise((r) => setTimeout(r, 0));
      expect(callback).toHaveBeenCalled();
    });

    it('should support multiple callbacks', async () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      server.onReload(cb1);
      server.onReload(cb2);
      await server.start();
      await server.reload();
      expect(cb1).toHaveBeenCalled();
      expect(cb2).toHaveBeenCalled();
    });
  });

  describe('state before start', () => {
    it('should not be running initially', () => {
      expect(server.isRunning()).toBe(false);
    });

    it('should return undefined manifest before start', () => {
      expect(server.getManifest()).toBeUndefined();
    });

    it('should return empty fixtures before start', () => {
      expect(server.getFixtures()).toEqual({});
    });
  });
});
