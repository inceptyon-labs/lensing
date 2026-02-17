import { describe, it, expect, beforeEach } from 'vitest';
import { createFixtureLoader, type FixtureLoader } from '../fixture-loader';

describe('FixtureLoader', () => {
  let loader: FixtureLoader;

  const mockFiles: Record<string, string> = {
    'weather.json': JSON.stringify({ temp: 72, humidity: 45 }),
    'calendar.json': JSON.stringify({ events: [{ id: '1', title: 'Meeting' }] }),
    'invalid.txt': 'not a json file',
  };

  const mockReadDir = async (): Promise<string[]> => {
    return Object.keys(mockFiles);
  };

  const mockReadFile = async (path: string): Promise<string> => {
    const filename = path.split('/').pop() ?? path;
    const content = mockFiles[filename];
    if (content === undefined) {
      throw new Error(`ENOENT: no such file: ${path}`);
    }
    return content;
  };

  beforeEach(() => {
    loader = createFixtureLoader({
      fixturesDir: '/mock/fixtures',
      readDir: mockReadDir,
      readFile: mockReadFile,
    });
  });

  describe('list', () => {
    it('should list only JSON fixture files', async () => {
      const files = await loader.list();
      expect(files).toContain('weather.json');
      expect(files).toContain('calendar.json');
      expect(files).not.toContain('invalid.txt');
    });

    it('should return empty array when no JSON files', async () => {
      const emptyLoader = createFixtureLoader({
        fixturesDir: '/mock/fixtures',
        readDir: async () => ['readme.md', 'notes.txt'],
        readFile: mockReadFile,
      });
      const files = await emptyLoader.list();
      expect(files).toEqual([]);
    });

    it('should handle readDir failure gracefully', async () => {
      const failLoader = createFixtureLoader({
        fixturesDir: '/nonexistent',
        readDir: async () => {
          throw new Error('ENOENT');
        },
        readFile: mockReadFile,
      });
      const files = await failLoader.list();
      expect(files).toEqual([]);
    });
  });

  describe('load', () => {
    it('should load and parse a single fixture', async () => {
      const data = await loader.load('weather.json');
      expect(data).toEqual({ temp: 72, humidity: 45 });
    });

    it('should throw for nonexistent fixture', async () => {
      await expect(loader.load('missing.json')).rejects.toThrow();
    });

    it('should throw for invalid JSON', async () => {
      const badLoader = createFixtureLoader({
        fixturesDir: '/mock',
        readDir: mockReadDir,
        readFile: async () => 'not valid json {{{',
      });
      await expect(badLoader.load('weather.json')).rejects.toThrow();
    });
  });

  describe('loadAll', () => {
    it('should load all JSON fixtures as a keyed record', async () => {
      const all = await loader.loadAll();
      expect(Object.keys(all)).toContain('weather');
      expect(Object.keys(all)).toContain('calendar');
      expect(all['weather']).toEqual({ temp: 72, humidity: 45 });
      expect(all['calendar']).toEqual({ events: [{ id: '1', title: 'Meeting' }] });
    });

    it('should strip .json extension from keys', async () => {
      const all = await loader.loadAll();
      expect(Object.keys(all)).not.toContain('weather.json');
    });

    it('should skip files that fail to parse', async () => {
      const mixedLoader = createFixtureLoader({
        fixturesDir: '/mock',
        readDir: async () => ['good.json', 'bad.json'],
        readFile: async (path: string) => {
          if (path.includes('bad.json')) return '{invalid json';
          return '{"valid": true}';
        },
      });
      const all = await mixedLoader.loadAll();
      expect(Object.keys(all)).toEqual(['good']);
      expect(all['good']).toEqual({ valid: true });
    });

    it('should return empty record when no fixtures exist', async () => {
      const emptyLoader = createFixtureLoader({
        fixturesDir: '/empty',
        readDir: async () => [],
        readFile: mockReadFile,
      });
      const all = await emptyLoader.loadAll();
      expect(all).toEqual({});
    });
  });
});
