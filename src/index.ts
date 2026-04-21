import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';
import {
  KeyPair,
  PublicKey,
  PrivateKey,
  Ciphertext,
  SharedSecret,
  EncapResult
} from './types';
import { toBase64, ensureUint8Array } from './utils';

/**
 * EasyPQC provides a simple interface for Post-Quantum Cryptography (ML-KEM/Kyber).
 */
export class EasyPQC {
  private keyPair?: KeyPair;

  /**
   * Initializes EasyPQC. If no keys are provided, you can call generateKeyPair().
   */
  constructor(keys?: KeyPair) {
    if (keys) {
      this.keyPair = keys;
    } else {
      this.generateKeyPair();
    }
  }

  /**
   * Generates a new ML-KEM-768 key pair.
   */
  generateKeyPair(): KeyPair {
    const pair = ml_kem768.keygen();
    this.keyPair = {
      publicKey: pair.publicKey as PublicKey,
      privateKey: pair.secretKey as PrivateKey,
    };
    return this.keyPair;
  }

  /**
   * Returns the public key in the specified format.
   */
  getPublicKey(format: 'buffer' | 'base64' = 'buffer'): PublicKey | string {
    if (!this.keyPair) {
      throw new Error('Key pair not generated. Call generateKeyPair() first.');
    }
    return format === 'base64' ? toBase64(this.keyPair.publicKey) : this.keyPair.publicKey;
  }

  /**
   * Encapsulates a shared secret using a provided public key.
   * This is typically used by the sender ("Bob") to create a secret for the receiver ("Alice").
   */
  encapsulate(publicKeyInput: string | Uint8Array, encoding: 'hex' | 'base64' = 'base64'): EncapResult {
    const publicKey = ensureUint8Array<PublicKey>(publicKeyInput, encoding);
    const { cipherText, sharedSecret } = ml_kem768.encapsulate(publicKey);

    return {
      ciphertext: cipherText as Ciphertext,
      sharedSecret: sharedSecret as SharedSecret,
    };
  }

  /**
   * Decapsulates a ciphertext using the internal private key to recover the shared secret.
   * This is used by the receiver ("Alice") to recover the secret sent by "Bob".
   */
  decapsulate(ciphertextInput: string | Uint8Array, encoding?: 'hex' | 'base64'): SharedSecret {
    if (!this.keyPair) {
      throw new Error('Key pair missing. Private key is required for decapsulation.');
    }

    const ciphertext = ensureUint8Array<Ciphertext>(ciphertextInput, encoding);
    const sharedSecret = ml_kem768.decapsulate(ciphertext, this.keyPair.privateKey);

    return sharedSecret as SharedSecret;
  }

  /**
   * Static helper to perform encapsulation without an instance.
   */
  static encapsulate(publicKey: string | Uint8Array, encoding?: 'hex' | 'base64'): EncapResult {
    const epqc = new EasyPQC(); // Temporary instance, pair won't be used
    return epqc.encapsulate(publicKey, encoding);
  }
}

// Export everything for the library
export * from './types';
export * from './utils';
