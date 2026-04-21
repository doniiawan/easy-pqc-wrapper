/**
 * Basic Usage Example for easy-pqc-wrapper
 * 
 * To run this:
 * 1. npm install
 * 2. npx tsx examples/basic.ts
 */

import { EasyPQC, toHex } from '../src';

async function main() {
  console.log('--- Post-Quantum Key Exchange Demo ---');

  // 1. Initialisasi Alice & Bob
  const alice = new EasyPQC();
  const bob = new EasyPQC();

  // 2. Alice membagikan Public Key ke Bob
  const alicePubKey = alice.getPublicKey();
  console.log('Alice Public Key (Hex):', toHex(alicePubKey as Uint8Array).substring(0, 32) + '...');

  // 3. Bob membungkus (encapsulate) Secret Key untuk Alice menggunakan Public Key Alice
  const { ciphertext, sharedSecret: bobSecret } = bob.encapsulate(alicePubKey);
  console.log('Bob generated Shared Secret:', toHex(bobSecret));
  console.log('Ciphertext produced:', toHex(ciphertext).substring(0, 32) + '...');

  // 4. Alice membuka bungkusan (decapsulate) menggunakan Private Key miliknya
  const aliceSecret = alice.decapsulate(ciphertext);
  console.log('Alice recovered Shared Secret:', toHex(aliceSecret));

  // 5. Verifikasi: Apakah keduanya punya Shared Secret yang sama?
  const isMatch = toHex(bobSecret) === toHex(aliceSecret);
  console.log('\nShared Secrets Match?', isMatch ? '✅ YES' : '❌ NO');

  if (isMatch) {
    console.log('Sekarang keduanya bisa menggunakan Shared Secret ini untuk AES-256!');
  }
}

main().catch(console.error);
