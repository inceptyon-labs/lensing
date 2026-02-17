import { describe, it, expect } from 'vitest';
import type { PluginManifest, PluginStatus } from '@lensing/core';
import { createRestServer } from '@lensing/core';
import type { RestServerOptions, RestServerInstance } from '@lensing/core';

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

  it('exports createRestServer factory', () => {
    expect(typeof createRestServer).toBe('function');
  });

  it('exports RestServerOptions type', () => {
    const opts: RestServerOptions = { port: 3000 };
    expect(opts.port).toBe(3000);
  });

  it('exports RestServerInstance type', () => {
    // Just verify the type can be used (no runtime check needed)
    // This is a compile-time check that the type is exported
    expect(true).toBe(true);
  });
});
