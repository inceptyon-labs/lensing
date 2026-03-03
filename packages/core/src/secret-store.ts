import type { DatabaseInstance } from '@lensing/types';
import { encrypt, decrypt, deriveKey, generateRandomSeed } from './secret-crypto';

/**
 * Secret store for managing encrypted plugin secrets.
 * Handles encryption/decryption and persistence via database.
 */
export interface SecretStore {
  /**
   * Get a decrypted secret for a plugin.
   * Returns undefined if the secret doesn't exist.
   */
  get(pluginId: string, secretKey: string): string | undefined;

  /**
   * Set a secret for a plugin (encrypts before storing).
   * Overwrites existing secret with the same key.
   */
  set(pluginId: string, secretKey: string, plaintext: string): void;

  /**
   * Get all decrypted secrets for a plugin as a record.
   * Returns empty object if plugin has no secrets.
   */
  getAll(pluginId: string): Record<string, string>;

  /**
   * Delete a specific secret for a plugin.
   * Returns true if a secret was deleted, false if it didn't exist.
   */
  delete(pluginId: string, secretKey: string): boolean;

  /**
   * Delete all secrets for a plugin (e.g., when uninstalling).
   * Returns the number of secrets deleted.
   */
  deleteAll(pluginId: string): number;
}

const MASTER_KEY_SETTING = 'secret_store.master_key_seed';

/**
 * Create a secret store that encrypts secrets before persisting to the database.
 * Automatically manages the master key (derives or generates on first use).
 */
export function createSecretStore(db: DatabaseInstance): SecretStore {
  // Get or create the master key seed
  function getMasterKeySeed(): string {
    let seed = db.getSetting(MASTER_KEY_SETTING);
    if (!seed) {
      // First use: generate and save a new seed
      seed = generateRandomSeed();
      db.setSetting(MASTER_KEY_SETTING, seed);
    }
    return seed;
  }

  const masterKey = deriveKey(getMasterKeySeed());

  return {
    get(pluginId: string, secretKey: string): string | undefined {
      const encrypted = db.getPluginSecret(pluginId, secretKey);
      if (!encrypted) return undefined;

      try {
        return decrypt(encrypted, masterKey);
      } catch {
        // Decryption failed (wrong key, corrupted data, etc.)
        // Return undefined rather than throwing
        return undefined;
      }
    },

    set(pluginId: string, secretKey: string, plaintext: string): void {
      const encrypted = encrypt(plaintext, masterKey);
      db.setPluginSecret(pluginId, secretKey, encrypted);
    },

    getAll(pluginId: string): Record<string, string> {
      const encrypted = db.getPluginSecrets(pluginId);
      const result: Record<string, string> = {};

      for (const [key, value] of Object.entries(encrypted)) {
        try {
          result[key] = decrypt(value, masterKey);
        } catch {
          // Skip corrupted secrets
        }
      }

      return result;
    },

    delete(pluginId: string, secretKey: string): boolean {
      return db.deletePluginSecret(pluginId, secretKey);
    },

    deleteAll(pluginId: string): number {
      return db.deleteAllPluginSecrets(pluginId);
    },
  };
}
