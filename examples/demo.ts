import { EasyPQC } from '../src/index';

console.log("=== EasyPQC (ML-KEM/Kyber) Demo ===");

// 1. Alice creates her instance and generates a key pair
const alice = new EasyPQC();
const alicePublicKeyHex = alice.getPublicKey('base64');
console.log("\n[Alice] Generated Key Pair.");
console.log(`[Alice] Public Key (Base64 sample): ${(alicePublicKeyHex as string).substring(0, 40)}...`);

// 2. Bob wants to send a secret to Alice safely.
// He uses Alice's public key to encapsulate a new shared secret.
const bob = new EasyPQC();
const { ciphertext, sharedSecret: bobSecret } = bob.encapsulate(alicePublicKeyHex);
console.log("\n[Bob] Encapsulated a shared secret using Alice's public key.");
console.log(`[Bob] Shared Secret (hex): ${Buffer.from(bobSecret).toString('hex')}`);

// 3. Bob sends ONLY the ciphertext to Alice.
console.log("\n[Network] Bob sends the ciphertext to Alice...");

// 4. Alice receives the ciphertext and decapsulates it using her private key
const aliceSecret = alice.decapsulate(ciphertext);
console.log("\n[Alice] Decapsulated the ciphertext received from Bob.");
console.log(`[Alice] Shared Secret (hex): ${Buffer.from(aliceSecret).toString('hex')}`);

// 5. Verification
console.log("\n=== Result ===");
if (Buffer.from(aliceSecret).equals(Buffer.from(bobSecret))) {
  console.log("✅ Success! Alice and Bob now share the exact same secure secret.");
} else {
  console.log("❌ Failed to match shared secrets.");
}
