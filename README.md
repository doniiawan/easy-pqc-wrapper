# easy-pqc-wrapper

A simple, user-friendly wrapper for Post-Quantum Cryptography (PQC), specifically targeting the **ML-KEM (Kyber)** key encapsulation mechanism. Powered by the reliable [`@noble/post-quantum`](https://github.com/paulmillr/noble-post-quantum) library.

## Features

- **Easy to use**: Intuitive API for generating key pairs, encapsulating secrets, and decapsulating secrets.
- **Post-Quantum Secure**: Uses ML-KEM-768 (standardized to FIPS 203).
- **Flexible Encodings**: Built-in support for `Buffer` / `Uint8Array`, `base64`, and `hex` strings so you can easily send data over the network.
- **Modern TypeScript**: Fully typed for a great DX.

## Installation

You need to install this wrapper along with its peer/underlying library.

```bash
npm install easy-pqc-wrapper
```

## Quick Start (Alice & Bob)

The Key Encapsulation Mechanism (KEM) is designed to let two parties (Alice and Bob) exchange a secure `Shared Secret` over a public network.

```typescript
import { EasyPQC } from 'easy-pqc-wrapper';

// ---------------------------------------------------------
// 1. ALICE
// ---------------------------------------------------------
// Alice generates her key pair (automatically on instantiation)
const alice = new EasyPQC();

// She exports her public key to send to Bob. 
// Options: 'buffer' (default), 'base64', or 'hex'
const alicePublicKey = alice.getPublicKey('base64');


// ---------------------------------------------------------
// 2. BOB
// ---------------------------------------------------------
// Bob receives Alice's public key. 
// He uses it to generate a shared secret AND a ciphertext.
const bob = new EasyPQC();

// We must tell the encapsulate method what encoding the public key uses.
const { ciphertext, sharedSecret: bobSecret } = bob.encapsulate(alicePublicKey, 'base64');

// Bob sends the `ciphertext` back to Alice over the network...


// ---------------------------------------------------------
// 3. ALICE
// ---------------------------------------------------------
// Alice receives the ciphertext from Bob.
// She uses her private key to decapsulate it and recover the exact same secret.
// Because the ciphertext returned by encapsulate is a Uint8Array, we don't need
// to provide an encoding parameter to decapsulate here unless we encode it first.
const aliceSecret = alice.decapsulate(ciphertext);

// Proof that the secrets match:
console.log(Buffer.from(aliceSecret).equals(Buffer.from(bobSecret))); // true
```

## API Reference

### `new EasyPQC(keys?: KeyPair)`
Creates a new instance. If you don't supply a `KeyPair`, it automatically generates one for you using ML-KEM-768.

### `getPublicKey(format: 'buffer' | 'base64' | 'hex' = 'buffer')`
Returns the generated public key in your desired format. Note: `'buffer'` actually returns a `Uint8Array`.

### `encapsulate(publicKey: string | Uint8Array, encoding?: 'base64' | 'hex')`
Generate a newly encapsulated shared secret using someone else's public key.
Returns an object: `{ ciphertext: Uint8Array, sharedSecret: Uint8Array }`.

### `decapsulate(ciphertext: string | Uint8Array, encoding?: 'base64' | 'hex')`
Decapsulate a received ciphertext using your own private key.
Returns the `sharedSecret: Uint8Array`.

### `EasyPQC.encapsulate(publicKey, encoding?)`
A static helper method if you just want to act like "Bob" (generating the shared secret from a public key) without needing to instantiate a full object for yourself.

## License

MIT
