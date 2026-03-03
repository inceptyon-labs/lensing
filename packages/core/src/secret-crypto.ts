import { randomBytes, createCipheriv, createDecipheriv, createHash, pbkdf2Sync } from 'crypto';

/**
 * Secret encryption/decryption utility using AES-256-GCM.
 * Each encryption generates a random IV and includes an authentication tag.
 * Format: "iv:ciphertext:tag" (all base64-encoded)
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // bytes
const TAG_LENGTH = 16; // bytes
const SALT = 'lensing-secret-store'; // fixed salt for PBKDF2
const KEY_LENGTH = 32; // 256 bits
const ITERATIONS = 100_000; // PBKDF2 iterations

/**
 * Derive a consistent 256-bit key from a seed using PBKDF2.
 * Used to generate the master key from a device identifier.
 */
export function deriveKey(seed: string): Buffer {
  return pbkdf2Sync(seed, SALT, ITERATIONS, KEY_LENGTH, 'sha256');
}

/**
 * Encrypt plaintext using AES-256-GCM.
 * Returns: "base64(iv):base64(ciphertext):base64(tag)"
 */
export function encrypt(plaintext: string, key: Buffer): string {
  // Generate a random IV for this encryption
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  // Encrypt the plaintext
  let encrypted = cipher.update(plaintext, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Get the authentication tag
  const tag = cipher.getAuthTag();

  // Return in format: iv:ciphertext:tag (base64)
  return `${iv.toString('base64')}:${encrypted.toString('base64')}:${tag.toString('base64')}`;
}

/**
 * Decrypt a secret in "iv:ciphertext:tag" format using AES-256-GCM.
 * Returns the plaintext or throws if authentication fails.
 */
export function decrypt(encrypted: string, key: Buffer): string {
  const parts = encrypted.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted format: expected "iv:ciphertext:tag"');
  }

  const iv = Buffer.from(parts[0], 'base64');
  const ciphertext = Buffer.from(parts[1], 'base64');
  const tag = Buffer.from(parts[2], 'base64');

  // Validate buffer sizes
  if (iv.length !== IV_LENGTH) {
    throw new Error(`Invalid IV length: expected ${IV_LENGTH}, got ${iv.length}`);
  }
  if (tag.length !== TAG_LENGTH) {
    throw new Error(`Invalid tag length: expected ${TAG_LENGTH}, got ${tag.length}`);
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  try {
    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    // Auth tag verification failed — indicates tampering or wrong key
    throw new Error(`Decryption failed: authentication tag verification failed`);
  }
}

/**
 * Generate a random hex string suitable for use as a master key seed.
 * Used when device-specific seed is unavailable.
 */
export function generateRandomSeed(): string {
  return randomBytes(32).toString('hex');
}
