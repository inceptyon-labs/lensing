import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Sports Plugin Integration', () => {
  it('should export createSportsServer from @lensing/core', async () => {
    const { createSportsServer } = await import('@lensing/core');
    expect(typeof createSportsServer).toBe('function');
  });

  it('should export sports constants from @lensing/core', async () => {
    const core = await import('@lensing/core');
    expect(core.DEFAULT_SPORTS_MAX_STALE_MS).toBe(120_000);
    expect(Array.isArray(core.DEFAULT_SPORTS_LEAGUES)).toBe(true);
  });

  it('should have plugin.json for sports plugin', () => {
    const manifestPath = join(__dirname, '../../src/plugins/sports/plugin.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    expect(manifest.id).toBe('sports-server');
    expect(manifest.version).toBeTruthy();
    expect(manifest.widget_sizes).toBeDefined();
  });

  it('should have sports plugin.json with allowed_domains permissions', () => {
    const manifestPath = join(__dirname, '../../src/plugins/sports/plugin.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    expect(manifest.permissions).toBeDefined();
    expect(Array.isArray(manifest.permissions.allowed_domains)).toBe(true);
  });
});
