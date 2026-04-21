/**
 * Branded types to prevent accidental mixing of different cryptographic buffers.
 */

export type Brand<K, T> = K & { __brand: T };

/**
 * Public key used for encapsulation.
 */
export type PublicKey = Brand<Uint8Array, 'PublicKey'>;

/**
 * Private key used for decapsulation.
 */
export type PrivateKey = Brand<Uint8Array, 'PrivateKey'>;

/**
 * Encapsulated shared secret (what's sent over the wire).
 */
export type Ciphertext = Brand<Uint8Array, 'Ciphertext'>;

/**
 * The final shared secret used for symmetric encryption (e.g. AES).
 */
export type SharedSecret = Brand<Uint8Array, 'SharedSecret'>;

/**
 * Key pair containing both Public and Private keys.
 */
export interface KeyPair {
  publicKey: PublicKey;
  privateKey: PrivateKey;
}

/**
 * Result of encapsulation.
 */
export interface EncapResult {
  ciphertext: Ciphertext;
  sharedSecret: SharedSecret;
}
