import { describe, it, expect } from 'vitest';
import { EasyPQC } from '../src';
import { toBase64, toHex } from '../src/utils';

describe('EasyPQC', () => {
  it('should generate distinct key pairs for different instances', () => {
    const alice = new EasyPQC();
    const bob = new EasyPQC();
    
    expect(alice.getPublicKey()).not.toEqual(bob.getPublicKey());
  });

  it('should successfully perform key exchange (Alice & Bob)', () => {
    const alice = new EasyPQC();
    const bob = new EasyPQC();
    const alicePubKey = alice.getPublicKey();

    const { ciphertext, sharedSecret: bobSecret } = bob.encapsulate(alicePubKey);
    const aliceSecret = alice.decapsulate(ciphertext);

    expect(aliceSecret).toEqual(bobSecret);
  });

  it('should work with Base64 encoded strings', () => {
    const alice = new EasyPQC();
    const alicePubKeyB64 = alice.getPublicKey('base64') as string;
    
    expect(typeof alicePubKeyB64).toBe('string');

    // Bob encapsulates using Base64 string
    const { ciphertext, sharedSecret: bobSecret } = EasyPQC.encapsulate(alicePubKeyB64);
    
    // Alice decapsulates using Base64 string
    const ciphertextB64 = toBase64(ciphertext);
    const aliceSecret = alice.decapsulate(ciphertextB64);

    expect(aliceSecret).toEqual(bobSecret);
  });

  it('should work with Hex encoded strings via utils', () => {
    const alice = new EasyPQC();
    const alicePubKeyHex = typeof alice.getPublicKey() === 'object' 
      ? toHex(alice.getPublicKey() as Uint8Array) 
      : alice.getPublicKey();
    
    // Manual encapsulate testing with hex conversion simulation
    const { ciphertext, sharedSecret: bobSecret } = EasyPQC.encapsulate(alicePubKeyHex as string, 'hex');
    const aliceSecret = alice.decapsulate(toHex(ciphertext), 'hex');

    expect(aliceSecret).toEqual(bobSecret);
  });

  it('should throw error when decapsulating without key pair', () => {
    const epqc = new EasyPQC();
    // @ts-ignore: force clear keys for testing
    epqc.keyPair = undefined;
    
    expect(() => epqc.decapsulate(new Uint8Array(1088))).toThrow('Key pair missing');
  });
});
