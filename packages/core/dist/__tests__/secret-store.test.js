import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createDatabase } from '../database';
import { createSecretStore } from '../secret-store';
describe('secret-store', () => {
    let db;
    let store;
    beforeEach(() => {
        db = createDatabase({ path: ':memory:' });
        store = createSecretStore(db);
    });
    afterEach(() => {
        db.close();
    });
    describe('set / get', () => {
        it('should encrypt and store a secret', () => {
            store.set('plugin-id', 'API_KEY', 'secret-value');
            const retrieved = store.get('plugin-id', 'API_KEY');
            expect(retrieved).toBe('secret-value');
        });
        it('should return undefined for non-existent secret', () => {
            const retrieved = store.get('plugin-id', 'non-existent');
            expect(retrieved).toBeUndefined();
        });
        it('should update an existing secret', () => {
            store.set('plugin-id', 'API_KEY', 'old-value');
            store.set('plugin-id', 'API_KEY', 'new-value');
            expect(store.get('plugin-id', 'API_KEY')).toBe('new-value');
        });
        it('should handle empty string secrets', () => {
            store.set('plugin-id', 'EMPTY', '');
            expect(store.get('plugin-id', 'EMPTY')).toBe('');
        });
        it('should handle special characters and Unicode', () => {
            const plaintext = '🔐 "p@ss!word" ñoño: 测试';
            store.set('plugin-id', 'SPECIAL', plaintext);
            expect(store.get('plugin-id', 'SPECIAL')).toBe(plaintext);
        });
        it('should store multiple secrets for the same plugin', () => {
            store.set('plugin-id', 'API_KEY', 'key-value');
            store.set('plugin-id', 'TOKEN', 'token-value');
            store.set('plugin-id', 'PASSWORD', 'password-value');
            expect(store.get('plugin-id', 'API_KEY')).toBe('key-value');
            expect(store.get('plugin-id', 'TOKEN')).toBe('token-value');
            expect(store.get('plugin-id', 'PASSWORD')).toBe('password-value');
        });
        it('should isolate secrets between plugins', () => {
            store.set('plugin-1', 'API_KEY', 'secret-1');
            store.set('plugin-2', 'API_KEY', 'secret-2');
            expect(store.get('plugin-1', 'API_KEY')).toBe('secret-1');
            expect(store.get('plugin-2', 'API_KEY')).toBe('secret-2');
        });
    });
    describe('master key persistence', () => {
        it('should derive the same master key on subsequent store creations', () => {
            store.set('plugin-id', 'API_KEY', 'secret-value');
            // Create a new store with the same database
            const store2 = createSecretStore(db);
            const retrieved = store2.get('plugin-id', 'API_KEY');
            expect(retrieved).toBe('secret-value');
        });
        it('should persist master key seed in database', () => {
            store.set('plugin-id', 'KEY', 'value');
            const seed = db.getSetting('secret_store.master_key_seed');
            expect(seed).toBeDefined();
            expect(seed).toMatch(/^[0-9a-f]{64}$/); // hex string, 32 bytes
        });
    });
    describe('getAll', () => {
        it('should return all decrypted secrets for a plugin', () => {
            store.set('plugin-id', 'API_KEY', 'key-value');
            store.set('plugin-id', 'TOKEN', 'token-value');
            const secrets = store.getAll('plugin-id');
            expect(secrets).toEqual({
                API_KEY: 'key-value',
                TOKEN: 'token-value',
            });
        });
        it('should return empty object for plugin with no secrets', () => {
            const secrets = store.getAll('no-secrets-plugin');
            expect(secrets).toEqual({});
        });
        it('should return secrets only for the specified plugin', () => {
            store.set('plugin-1', 'API_KEY', 'secret-1');
            store.set('plugin-2', 'API_KEY', 'secret-2');
            store.set('plugin-2', 'TOKEN', 'token-2');
            const secrets1 = store.getAll('plugin-1');
            const secrets2 = store.getAll('plugin-2');
            expect(secrets1).toEqual({ API_KEY: 'secret-1' });
            expect(secrets2).toEqual({ API_KEY: 'secret-2', TOKEN: 'token-2' });
        });
    });
    describe('delete', () => {
        it('should delete a specific secret', () => {
            store.set('plugin-id', 'API_KEY', 'key-value');
            const deleted = store.delete('plugin-id', 'API_KEY');
            expect(deleted).toBe(true);
            expect(store.get('plugin-id', 'API_KEY')).toBeUndefined();
        });
        it('should return false when deleting non-existent secret', () => {
            const deleted = store.delete('plugin-id', 'non-existent');
            expect(deleted).toBe(false);
        });
        it('should only delete the specified secret', () => {
            store.set('plugin-id', 'API_KEY', 'key-value');
            store.set('plugin-id', 'TOKEN', 'token-value');
            store.delete('plugin-id', 'API_KEY');
            expect(store.get('plugin-id', 'API_KEY')).toBeUndefined();
            expect(store.get('plugin-id', 'TOKEN')).toBe('token-value');
        });
        it('should not affect other plugins', () => {
            store.set('plugin-1', 'API_KEY', 'key-1');
            store.set('plugin-2', 'API_KEY', 'key-2');
            store.delete('plugin-1', 'API_KEY');
            expect(store.get('plugin-1', 'API_KEY')).toBeUndefined();
            expect(store.get('plugin-2', 'API_KEY')).toBe('key-2');
        });
    });
    describe('deleteAll', () => {
        it('should delete all secrets for a plugin', () => {
            store.set('plugin-id', 'API_KEY', 'key-value');
            store.set('plugin-id', 'TOKEN', 'token-value');
            store.set('plugin-id', 'PASSWORD', 'password-value');
            const deleted = store.deleteAll('plugin-id');
            expect(deleted).toBe(3);
            expect(store.getAll('plugin-id')).toEqual({});
        });
        it('should return 0 when plugin has no secrets', () => {
            const deleted = store.deleteAll('plugin-with-no-secrets');
            expect(deleted).toBe(0);
        });
        it('should only affect the specified plugin', () => {
            store.set('plugin-1', 'API_KEY', 'key-1');
            store.set('plugin-2', 'API_KEY', 'key-2');
            store.set('plugin-2', 'TOKEN', 'token-2');
            store.deleteAll('plugin-1');
            expect(store.getAll('plugin-1')).toEqual({});
            expect(store.getAll('plugin-2')).toEqual({
                API_KEY: 'key-2',
                TOKEN: 'token-2',
            });
        });
    });
    describe('encryption reliability', () => {
        it('should survive round-trip with long secrets', () => {
            const longSecret = 'x'.repeat(100_000);
            store.set('plugin-id', 'LONG_SECRET', longSecret);
            expect(store.get('plugin-id', 'LONG_SECRET')).toBe(longSecret);
        });
        it('should handle rapid set/get cycles', () => {
            for (let i = 0; i < 100; i++) {
                const value = `secret-${i}`;
                store.set('plugin-id', `KEY_${i}`, value);
                expect(store.get('plugin-id', `KEY_${i}`)).toBe(value);
            }
        });
        it('should gracefully handle corrupted encrypted data', () => {
            // Manually set a corrupted encrypted value in the database
            db.setPluginSecret('plugin-id', 'CORRUPTED', 'invalid:data:format');
            // getAll should skip corrupted entries
            const secrets = store.getAll('plugin-id');
            expect(secrets).toEqual({});
            // get should return undefined for corrupted entry
            expect(store.get('plugin-id', 'CORRUPTED')).toBeUndefined();
        });
    });
});
//# sourceMappingURL=secret-store.test.js.map