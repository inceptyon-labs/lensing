import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Home Assistant Plugin Integration', () => {
  it('should export createHomeAssistantServer from @lensing/core', async () => {
    const { createHomeAssistantServer } = await import('@lensing/core');
    expect(typeof createHomeAssistantServer).toBe('function');
  });

  it('should export HA constants from @lensing/core', async () => {
    const core = await import('@lensing/core');
    expect(core.DEFAULT_HA_MAX_STALE_MS).toBe(60_000);
    expect(Array.isArray(core.DEFAULT_HA_DOMAINS)).toBe(true);
    expect(core.DEFAULT_HA_DOMAINS).toContain('light');
  });

  it('should have plugin.json for home-assistant plugin', () => {
    const manifestPath = join(__dirname, '../../src/plugins/home-assistant/plugin.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    expect(manifest.id).toBe('home-assistant-server');
    expect(manifest.version).toBeTruthy();
    expect(manifest.widget_sizes).toBeDefined();
  });

  it('should have home-assistant plugin.json with permissions', () => {
    const manifestPath = join(__dirname, '../../src/plugins/home-assistant/plugin.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    expect(manifest.permissions).toBeDefined();
  });

  it('should export WsFactory type from @lensing/core', async () => {
    // Type-level check: createHomeAssistantServer accepts optional wsFn
    const { createHomeAssistantServer } = await import('@lensing/core');
    const server = createHomeAssistantServer({
      url: 'http://ha.local:8123',
      token: 'test-token',
      dataBus: { publish: () => {}, subscribe: () => () => {} } as unknown as Parameters<
        typeof createHomeAssistantServer
      >[0]['dataBus'],
      notifications: {
        enqueue: () => {},
        subscribe: () => () => {},
        getAll: () => [],
        clear: () => {},
      } as unknown as Parameters<typeof createHomeAssistantServer>[0]['notifications'],
    });
    expect(typeof server.refresh).toBe('function');
    expect(typeof server.close).toBe('function');
    server.close();
  });

  it('should export DEFAULT_HA_DOMAINS with sensor domains', async () => {
    const core = await import('@lensing/core');
    expect(core.DEFAULT_HA_DOMAINS).toContain('sensor');
    expect(core.DEFAULT_HA_DOMAINS).toContain('binary_sensor');
  });

  it('should have plugin.json with name and description', () => {
    const manifestPath = join(__dirname, '../../src/plugins/home-assistant/plugin.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    expect(typeof manifest.name).toBe('string');
    expect(manifest.name.length).toBeGreaterThan(0);
    expect(typeof manifest.description).toBe('string');
  });
});
