export interface FixtureLoaderOptions {
  fixturesDir: string;
  readDir: () => Promise<string[]>;
  readFile: (path: string) => Promise<string>;
}

export interface FixtureLoader {
  list(): Promise<string[]>;
  load(name: string): Promise<unknown>;
  loadAll(): Promise<Record<string, unknown>>;
}

export function createFixtureLoader(options: FixtureLoaderOptions): FixtureLoader {
  const { fixturesDir, readDir, readFile } = options;

  async function list(): Promise<string[]> {
    try {
      const files = await readDir();
      return files.filter((f) => f.endsWith('.json'));
    } catch {
      return [];
    }
  }

  async function load(name: string): Promise<unknown> {
    // Prevent path traversal attacks
    if (name.includes('..') || name.includes('/')) {
      throw new Error(`Invalid fixture name: ${name}`);
    }
    const path = `${fixturesDir}/${name}`;
    const content = await readFile(path);
    return JSON.parse(content);
  }

  async function loadAll(): Promise<Record<string, unknown>> {
    const files = await list();
    const result: Record<string, unknown> = {};

    for (const file of files) {
      try {
        const key = file.replace(/\.json$/, '');
        result[key] = await load(file);
      } catch {
        // Skip files that fail to parse
      }
    }

    return result;
  }

  return { list, load, loadAll };
}
