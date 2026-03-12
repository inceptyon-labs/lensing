/**
 * Derive a consistent 256-bit key from a seed using PBKDF2.
 * Used to generate the master key from a device identifier.
 */
export declare function deriveKey(seed: string): Buffer;
/**
 * Encrypt plaintext using AES-256-GCM.
 * Returns: "base64(iv):base64(ciphertext):base64(tag)"
 */
export declare function encrypt(plaintext: string, key: Buffer): string;
/**
 * Decrypt a secret in "iv:ciphertext:tag" format using AES-256-GCM.
 * Returns the plaintext or throws if authentication fails.
 */
export declare function decrypt(encrypted: string, key: Buffer): string;
/**
 * Generate a random hex string suitable for use as a master key seed.
 * Used when device-specific seed is unavailable.
 */
export declare function generateRandomSeed(): string;
//# sourceMappingURL=secret-crypto.d.ts.map