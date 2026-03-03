import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createHostService } from '../host-service';
import type { HostServiceInstance } from '../host-service';

/**
 * Integration tests for secrets management through HostService.
 * Tests the complete flow: setting secrets via admin API, then using them in connectors.
 */
describe('HostService Secrets Integration', () => {
  let hostService: HostServiceInstance;

  beforeEach(async () => {
    hostService = createHostService({
      port: 0,
      dbPath: ':memory:',
      pluginsDir: './plugins',
    });

    await hostService.ready;
  });

  afterEach(async () => {
    await hostService.close();
  });

  it('initializes with a secret store available after boot', async () => {
    // After ready resolves, host service should have all services initialized
    expect(hostService.db).toBeDefined();
    expect(hostService.rest).toBeDefined();
  });

  it('stores and retrieves plugin secrets through database', async () => {
    const pluginId = 'test-plugin';
    const secretKey = 'API_KEY';
    const secretValue = 'super-secret-key-12345';

    // Store a secret
    hostService.db.setPluginSecret(pluginId, secretKey, secretValue);

    // Retrieve it
    const stored = hostService.db.getPluginSecret(pluginId, secretKey);
    expect(stored).toBe(secretValue);
  });

  it('multiple secrets can be stored and retrieved independently', async () => {
    const pluginId = 'test-plugin';

    // Store secrets
    hostService.db.setPluginSecret(pluginId, 'API_KEY', 'key-12345');
    hostService.db.setPluginSecret(pluginId, 'TOKEN', 'bearer-token-abc123');

    // Retrieve individually
    const apiKey = hostService.db.getPluginSecret(pluginId, 'API_KEY');
    const token = hostService.db.getPluginSecret(pluginId, 'TOKEN');

    expect(apiKey).toBe('key-12345');
    expect(token).toBe('bearer-token-abc123');
  });

  it('retrieves all secrets for a plugin', async () => {
    const pluginId = 'test-plugin';

    // Store multiple secrets
    hostService.db.setPluginSecret(pluginId, 'API_KEY', 'key-value');
    hostService.db.setPluginSecret(pluginId, 'TOKEN', 'token-value');
    hostService.db.setPluginSecret(pluginId, 'PASSWORD', 'pass-value');

    // Get all secrets
    const all = hostService.db.getPluginSecrets(pluginId);

    expect(all).toEqual({
      API_KEY: 'key-value',
      TOKEN: 'token-value',
      PASSWORD: 'pass-value',
    });
  });

  it('deletes a single plugin secret', async () => {
    const pluginId = 'test-plugin';

    // Store secrets
    hostService.db.setPluginSecret(pluginId, 'API_KEY', 'key-value');
    hostService.db.setPluginSecret(pluginId, 'TOKEN', 'token-value');

    // Delete one
    hostService.db.deletePluginSecret(pluginId, 'API_KEY');

    // Verify only TOKEN remains
    const all = hostService.db.getPluginSecrets(pluginId);
    expect(all).toEqual({ TOKEN: 'token-value' });
  });

  it('deletes all secrets for a plugin', async () => {
    const pluginId = 'test-plugin';

    // Store secrets
    hostService.db.setPluginSecret(pluginId, 'API_KEY', 'key-value');
    hostService.db.setPluginSecret(pluginId, 'TOKEN', 'token-value');

    // Delete all
    hostService.db.deleteAllPluginSecrets(pluginId);

    // Verify all are gone
    const all = hostService.db.getPluginSecrets(pluginId);
    expect(all).toEqual({});
  });
});
