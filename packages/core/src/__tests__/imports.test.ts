import { describe, it, expect } from 'vitest';
import type { PluginManifest, PluginStatus } from '@lensing/core';

describe('@lensing/core cross-package imports', () => {
  it('re-exports PluginManifest from @lensing/types', () => {
    const manifest: PluginManifest = {
      id: 'test-plugin',
      name: 'Test Plugin',
      version: '0.1.0',
    };
    expect(manifest.id).toBe('test-plugin');
  });

  it('re-exports PluginStatus from @lensing/types', () => {
    const status: PluginStatus = 'active';
    expect(status).toBe('active');
  });
});
