import { encrypt, decrypt, deriveKey, generateRandomSeed } from './secret-crypto';
const MASTER_KEY_SETTING = 'secret_store.master_key_seed';
/**
 * Create a secret store that encrypts secrets before persisting to the database.
 * Automatically manages the master key (derives or generates on first use).
 */
export function createSecretStore(db) {
    // Get or create the master key seed
    function getMasterKeySeed() {
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
        get(pluginId, secretKey) {
            const encrypted = db.getPluginSecret(pluginId, secretKey);
            if (!encrypted)
                return undefined;
            try {
                return decrypt(encrypted, masterKey);
            }
            catch {
                // Decryption failed (wrong key, corrupted data, etc.)
                // Return undefined rather than throwing
                return undefined;
            }
        },
        set(pluginId, secretKey, plaintext) {
            const encrypted = encrypt(plaintext, masterKey);
            db.setPluginSecret(pluginId, secretKey, encrypted);
        },
        getAll(pluginId) {
            const encrypted = db.getPluginSecrets(pluginId);
            const result = {};
            for (const [key, value] of Object.entries(encrypted)) {
                try {
                    result[key] = decrypt(value, masterKey);
                }
                catch {
                    // Skip corrupted secrets
                }
            }
            return result;
        },
        delete(pluginId, secretKey) {
            return db.deletePluginSecret(pluginId, secretKey);
        },
        deleteAll(pluginId) {
            return db.deleteAllPluginSecrets(pluginId);
        },
    };
}
//# sourceMappingURL=secret-store.js.map