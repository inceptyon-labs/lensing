import { describe, it, expect } from 'vitest';
import { encrypt, decrypt, deriveKey, generateRandomSeed } from '../secret-crypto';
describe('secret-crypto', () => {
    describe('encrypt/decrypt', () => {
        it('should encrypt and decrypt plaintext', () => {
            const key = deriveKey('test-seed');
            const plaintext = 'my-secret-api-key';
            const encrypted = encrypt(plaintext, key);
            const decrypted = decrypt(encrypted, key);
            expect(decrypted).toBe(plaintext);
        });
        it('should produce different ciphertexts for the same plaintext (random IV)', () => {
            const key = deriveKey('test-seed');
            const plaintext = 'my-secret-api-key';
            const encrypted1 = encrypt(plaintext, key);
            const encrypted2 = encrypt(plaintext, key);
            // Ciphertexts should be different due to random IV
            expect(encrypted1).not.toBe(encrypted2);
            // But both should decrypt to the same plaintext
            expect(decrypt(encrypted1, key)).toBe(plaintext);
            expect(decrypt(encrypted2, key)).toBe(plaintext);
        });
        it('should handle empty strings', () => {
            const key = deriveKey('test-seed');
            const plaintext = '';
            const encrypted = encrypt(plaintext, key);
            const decrypted = decrypt(encrypted, key);
            expect(decrypted).toBe(plaintext);
        });
        it('should handle long secrets', () => {
            const key = deriveKey('test-seed');
            const plaintext = 'x'.repeat(10_000);
            const encrypted = encrypt(plaintext, key);
            const decrypted = decrypt(encrypted, key);
            expect(decrypted).toBe(plaintext);
        });
        it('should handle special characters and Unicode', () => {
            const key = deriveKey('test-seed');
            const plaintext = '🔐 secret: "p@ss!word" ñoño';
            const encrypted = encrypt(plaintext, key);
            const decrypted = decrypt(encrypted, key);
            expect(decrypted).toBe(plaintext);
        });
        it('should throw on decryption with wrong key', () => {
            const key1 = deriveKey('seed-1');
            const key2 = deriveKey('seed-2');
            const plaintext = 'my-secret';
            const encrypted = encrypt(plaintext, key1);
            expect(() => decrypt(encrypted, key2)).toThrow('authentication tag verification failed');
        });
        it('should throw on invalid encrypted format', () => {
            const key = deriveKey('test-seed');
            expect(() => decrypt('invalid', key)).toThrow('Invalid encrypted format');
            expect(() => decrypt('a:b', key)).toThrow('Invalid encrypted format');
            expect(() => decrypt('a:b:c:d', key)).toThrow('Invalid encrypted format');
        });
        it('should throw on corrupted ciphertext', () => {
            const key = deriveKey('test-seed');
            const plaintext = 'secret';
            const encrypted = encrypt(plaintext, key);
            const parts = encrypted.split(':');
            // Corrupt the ciphertext part
            const corrupted = `${parts[0]}:${Buffer.from('corrupted').toString('base64')}:${parts[2]}`;
            expect(() => decrypt(corrupted, key)).toThrow('authentication tag verification failed');
        });
        it('should throw on corrupted tag', () => {
            const key = deriveKey('test-seed');
            const plaintext = 'secret';
            const encrypted = encrypt(plaintext, key);
            const parts = encrypted.split(':');
            // Corrupt the tag (flip bytes in the tag)
            const originalTag = Buffer.from(parts[2], 'base64');
            const corruptedTag = Buffer.from(originalTag);
            corruptedTag[0] ^= 0xff; // flip all bits in first byte
            const corrupted = `${parts[0]}:${parts[1]}:${corruptedTag.toString('base64')}`;
            expect(() => decrypt(corrupted, key)).toThrow('authentication tag verification failed');
        });
    });
    describe('deriveKey', () => {
        it('should derive the same key from the same seed', () => {
            const seed = 'my-device-id';
            const key1 = deriveKey(seed);
            const key2 = deriveKey(seed);
            expect(key1).toEqual(key2);
        });
        it('should derive different keys from different seeds', () => {
            const key1 = deriveKey('seed-1');
            const key2 = deriveKey('seed-2');
            expect(key1).not.toEqual(key2);
        });
        it('should produce a 32-byte key', () => {
            const key = deriveKey('test-seed');
            expect(key.length).toBe(32);
        });
    });
    describe('generateRandomSeed', () => {
        it('should generate a 64-character hex string', () => {
            const seed = generateRandomSeed();
            expect(seed).toMatch(/^[0-9a-f]{64}$/);
        });
        it('should generate different seeds', () => {
            const seed1 = generateRandomSeed();
            const seed2 = generateRandomSeed();
            expect(seed1).not.toBe(seed2);
        });
    });
});
//# sourceMappingURL=secret-crypto.test.js.map