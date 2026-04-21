import { Brand } from './types';

/**
 * Converts a Uint8Array to a Hex string.
 */
export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Converts a Hex string to a Uint8Array.
 */
export function fromHex<T extends Uint8Array>(hex: string): T {
  if (hex.length % 2 !== 0) throw new Error("Hex string must have an even length");

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes as T;
}

/**
 * Converts a Uint8Array to a Base64 string.
 */
export function toBase64(bytes: Uint8Array): string {
  if (typeof btoa !== 'undefined') {
    // Browser
    return btoa(String.fromCharCode(...bytes));
  } else {
    // Node.js
    return Buffer.from(bytes).toString('base64');
  }
}

/**
 * Converts a Base64 string to a Uint8Array.
 */
export function fromBase64<T extends Uint8Array>(base64: string): T {
  if (typeof atob !== 'undefined') {
    // Browser
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes as T;
  } else {
    // Node.js
    return new Uint8Array(Buffer.from(base64, 'base64')) as T;
  }
}

/**
 * Ensures data is returned as Uint8Array (branded if needed).
 */
export function ensureUint8Array<T extends Uint8Array>(input: string | Uint8Array, encoding: 'hex' | 'base64' = 'base64'): T {
  if (typeof input === 'string') {
    return encoding === 'hex' ? fromHex<T>(input) : fromBase64<T>(input);
  }
  return input as T;
}
