import type { DatabaseInstance } from '@lensing/types';
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
/**
 * Create a secret store that encrypts secrets before persisting to the database.
 * Automatically manages the master key (derives or generates on first use).
 */
export declare function createSecretStore(db: DatabaseInstance): SecretStore;
//# sourceMappingURL=secret-store.d.ts.map