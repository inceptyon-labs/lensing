import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('News Plugin Integration', () => {
  it('should export createNewsServer from @lensing/core', async () => {
    const { createNewsServer } = await import('@lensing/core');
    expect(typeof createNewsServer).toBe('function');
  });

  it('should export news types from @lensing/core', async () => {
    const core = await import('@lensing/core');
    expect(core.DEFAULT_NEWS_MAX_ITEMS).toBe(20);
    expect(core.DEFAULT_NEWS_MAX_STALE_MS).toBe(600_000);
  });

  it('should have plugin.json for news plugin', () => {
    const manifestPath = join(
      __dirname,
      '../../src/plugins/news/plugin.json'
    );
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    expect(manifest.id).toBe('news-server');
    expect(manifest.version).toBeTruthy();
    expect(manifest.widget_sizes).toBeDefined();
  });

  it('should have news plugin.json with allowed_domains permissions', () => {
    const manifestPath = join(
      __dirname,
      '../../src/plugins/news/plugin.json'
    );
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    expect(manifest.permissions).toBeDefined();
    expect(Array.isArray(manifest.permissions.allowed_domains)).toBe(true);
  });
});
