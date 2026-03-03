import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createDatabase } from '../database';
import type { DatabaseInstance } from '@lensing/types';

describe('database secrets', () => {
  let db: DatabaseInstance;

  beforeEach(() => {
    db = createDatabase({ path: ':memory:' });
  });

  afterEach(() => {
    db.close();
  });

  describe('migration v3', () => {
    it('should create plugin_secrets table', () => {
      const version = db.getSchemaVersion();
      expect(version).toBe(3);

      const migrations = db.getMigrations();
      expect(migrations.length).toBe(3);
      expect(migrations[2]?.description).toBe('add plugin secrets table');
    });
  });

  describe('setPluginSecret / getPluginSecret', () => {
    it('should store and retrieve a secret', () => {
      const pluginId = 'test-plugin';
      const secretKey = 'API_KEY';
      const encryptedValue = 'iv:ciphertext:tag';

      db.setPluginSecret(pluginId, secretKey, encryptedValue);
      const retrieved = db.getPluginSecret(pluginId, secretKey);

      expect(retrieved).toBe(encryptedValue);
    });

    it('should return undefined for non-existent secret', () => {
      const retrieved = db.getPluginSecret('non-existent', 'KEY');
      expect(retrieved).toBeUndefined();
    });

    it('should update an existing secret', () => {
      const pluginId = 'test-plugin';
      const secretKey = 'API_KEY';

      db.setPluginSecret(pluginId, secretKey, 'old-value');
      db.setPluginSecret(pluginId, secretKey, 'new-value');

      const retrieved = db.getPluginSecret(pluginId, secretKey);
      expect(retrieved).toBe('new-value');
    });

    it('should store multiple secrets for the same plugin', () => {
      const pluginId = 'test-plugin';

      db.setPluginSecret(pluginId, 'API_KEY', 'encrypted-api-key');
      db.setPluginSecret(pluginId, 'AUTH_TOKEN', 'encrypted-token');
      db.setPluginSecret(pluginId, 'PASSWORD', 'encrypted-password');

      expect(db.getPluginSecret(pluginId, 'API_KEY')).toBe('encrypted-api-key');
      expect(db.getPluginSecret(pluginId, 'AUTH_TOKEN')).toBe('encrypted-token');
      expect(db.getPluginSecret(pluginId, 'PASSWORD')).toBe('encrypted-password');
    });

    it('should isolate secrets between plugins', () => {
      db.setPluginSecret('plugin-1', 'API_KEY', 'secret-1');
      db.setPluginSecret('plugin-2', 'API_KEY', 'secret-2');

      expect(db.getPluginSecret('plugin-1', 'API_KEY')).toBe('secret-1');
      expect(db.getPluginSecret('plugin-2', 'API_KEY')).toBe('secret-2');
    });
  });

  describe('getPluginSecrets', () => {
    it('should return all secrets for a plugin', () => {
      const pluginId = 'test-plugin';

      db.setPluginSecret(pluginId, 'API_KEY', 'encrypted-key');
      db.setPluginSecret(pluginId, 'TOKEN', 'encrypted-token');

      const secrets = db.getPluginSecrets(pluginId);

      expect(secrets).toEqual({
        API_KEY: 'encrypted-key',
        TOKEN: 'encrypted-token',
      });
    });

    it('should return empty object for plugin with no secrets', () => {
      const secrets = db.getPluginSecrets('no-secrets-plugin');
      expect(secrets).toEqual({});
    });

    it('should return secrets only for the specified plugin', () => {
      db.setPluginSecret('plugin-1', 'API_KEY', 'secret-1');
      db.setPluginSecret('plugin-2', 'API_KEY', 'secret-2');
      db.setPluginSecret('plugin-2', 'TOKEN', 'token-2');

      const secrets1 = db.getPluginSecrets('plugin-1');
      const secrets2 = db.getPluginSecrets('plugin-2');

      expect(secrets1).toEqual({ API_KEY: 'secret-1' });
      expect(secrets2).toEqual({ API_KEY: 'secret-2', TOKEN: 'token-2' });
    });
  });

  describe('deletePluginSecret', () => {
    it('should delete a specific secret', () => {
      const pluginId = 'test-plugin';
      const secretKey = 'API_KEY';

      db.setPluginSecret(pluginId, secretKey, 'encrypted-value');
      const deleted = db.deletePluginSecret(pluginId, secretKey);

      expect(deleted).toBe(true);
      expect(db.getPluginSecret(pluginId, secretKey)).toBeUndefined();
    });

    it('should return false when deleting non-existent secret', () => {
      const deleted = db.deletePluginSecret('plugin', 'non-existent');
      expect(deleted).toBe(false);
    });

    it('should only delete the specified secret', () => {
      const pluginId = 'test-plugin';

      db.setPluginSecret(pluginId, 'API_KEY', 'key-value');
      db.setPluginSecret(pluginId, 'TOKEN', 'token-value');

      db.deletePluginSecret(pluginId, 'API_KEY');

      expect(db.getPluginSecret(pluginId, 'API_KEY')).toBeUndefined();
      expect(db.getPluginSecret(pluginId, 'TOKEN')).toBe('token-value');
    });

    it('should not affect other plugins', () => {
      db.setPluginSecret('plugin-1', 'API_KEY', 'key-1');
      db.setPluginSecret('plugin-2', 'API_KEY', 'key-2');

      db.deletePluginSecret('plugin-1', 'API_KEY');

      expect(db.getPluginSecret('plugin-1', 'API_KEY')).toBeUndefined();
      expect(db.getPluginSecret('plugin-2', 'API_KEY')).toBe('key-2');
    });
  });

  describe('deleteAllPluginSecrets', () => {
    it('should delete all secrets for a plugin', () => {
      const pluginId = 'test-plugin';

      db.setPluginSecret(pluginId, 'API_KEY', 'key-value');
      db.setPluginSecret(pluginId, 'TOKEN', 'token-value');
      db.setPluginSecret(pluginId, 'PASSWORD', 'password-value');

      const deleted = db.deleteAllPluginSecrets(pluginId);

      expect(deleted).toBe(3);
      expect(db.getPluginSecrets(pluginId)).toEqual({});
    });

    it('should return 0 when plugin has no secrets', () => {
      const deleted = db.deleteAllPluginSecrets('plugin-with-no-secrets');
      expect(deleted).toBe(0);
    });

    it('should only affect the specified plugin', () => {
      db.setPluginSecret('plugin-1', 'API_KEY', 'key-1');
      db.setPluginSecret('plugin-2', 'API_KEY', 'key-2');
      db.setPluginSecret('plugin-2', 'TOKEN', 'token-2');

      db.deleteAllPluginSecrets('plugin-1');

      expect(db.getPluginSecrets('plugin-1')).toEqual({});
      expect(db.getPluginSecrets('plugin-2')).toEqual({
        API_KEY: 'key-2',
        TOKEN: 'token-2',
      });
    });
  });
});
