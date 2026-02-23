import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('PIR Sensor Plugin Integration', () => {
  it('should export createPIRServer from @lensing/core', async () => {
    const { createPIRServer } = await import('@lensing/core');
    expect(typeof createPIRServer).toBe('function');
  });

  it('should export PIR constants from @lensing/types', async () => {
    const types = await import('@lensing/types');
    expect(types.DEFAULT_PIR_IDLE_TIMEOUT_MS).toBe(5 * 60_000);
    expect(types.DEFAULT_PIR_GPIO_PIN).toBe(17);
  });

  it('should have plugin.json for pir-sensor plugin', () => {
    const manifestPath = join(__dirname, '../../src/plugins/pir-sensor/plugin.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    expect(manifest.id).toBe('pir-sensor');
    expect(manifest.version).toBeTruthy();
  });

  it('should export createPresenceStore from @lensing/ui', async () => {
    const { createPresenceStore } = await import('@lensing/ui');
    expect(typeof createPresenceStore).toBe('function');
  });
});
