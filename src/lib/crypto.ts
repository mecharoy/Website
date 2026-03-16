// Client-side cryptography utilities using the Web Crypto API.
// All operations run in the browser — the server never sees plaintext.

function b64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const str = atob(b64)
  const buf = new ArrayBuffer(str.length)
  const u8 = new Uint8Array(buf)
  for (let i = 0; i < str.length; i++) u8[i] = str.charCodeAt(i)
  return u8
}

function bytesToB64(bytes: ArrayBuffer | Uint8Array): string {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  return btoa(String.fromCharCode(...u8))
}

export function generateSalt(): Uint8Array<ArrayBuffer> {
  const buf = new ArrayBuffer(16)
  const u8 = new Uint8Array(buf)
  crypto.getRandomValues(u8)
  return u8
}

function generateIv(): Uint8Array<ArrayBuffer> {
  const buf = new ArrayBuffer(12)
  const u8 = new Uint8Array(buf)
  crypto.getRandomValues(u8)
  return u8
}

// Derive an AES-GCM wrapping key from a password using PBKDF2.
export async function deriveWrappingKey(
  password: string,
  salt: Uint8Array | string,
): Promise<CryptoKey> {
  const saltBytes: Uint8Array<ArrayBuffer> =
    typeof salt === 'string'
      ? b64ToBytes(salt)
      : new Uint8Array(salt.buffer as ArrayBuffer, salt.byteOffset, salt.byteLength)
  const enc = new TextEncoder()
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBytes, iterations: 310_000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

// Generate an RSA-OAEP 2048-bit key pair.
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt'],
  )
}

// Generate an AES-GCM 256-bit key for encrypting submission content.
export async function generateAesKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ])
}

// Export a public key as base64-encoded SPKI.
export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const spki = await crypto.subtle.exportKey('spki', key)
  return bytesToB64(spki)
}

// Import a base64-encoded SPKI public key.
export async function importPublicKey(b64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'spki',
    b64ToBytes(b64),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['encrypt'],
  )
}

// Wrap (encrypt) an RSA private key using an AES-GCM wrapping key.
// Returns a JSON string: {"iv":"<b64>","data":"<b64>"}
export async function wrapPrivateKey(
  privateKey: CryptoKey,
  wrappingKey: CryptoKey,
): Promise<string> {
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', privateKey)
  const iv = generateIv()
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, wrappingKey, pkcs8)
  return JSON.stringify({ iv: bytesToB64(iv), data: bytesToB64(ciphertext) })
}

// Unwrap (decrypt) an RSA private key.
// Takes the JSON string produced by wrapPrivateKey.
export async function unwrapPrivateKey(
  wrapped: string,
  wrappingKey: CryptoKey,
): Promise<CryptoKey> {
  const { iv, data } = JSON.parse(wrapped) as { iv: string; data: string }
  const pkcs8 = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: b64ToBytes(iv) },
    wrappingKey,
    b64ToBytes(data),
  )
  return crypto.subtle.importKey(
    'pkcs8',
    pkcs8,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true, // extractable: true so the key can be re-wrapped on password change
    ['decrypt'],
  )
}

// Encrypt a per-submission AES key with an RSA public key.
// Returns base64-encoded ciphertext.
export async function encryptAesKey(aesKey: CryptoKey, publicKey: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey('raw', aesKey)
  const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, raw)
  return bytesToB64(encrypted)
}

// Decrypt a per-submission AES key with an RSA private key.
export async function decryptAesKey(encryptedB64: string, privateKey: CryptoKey): Promise<CryptoKey> {
  const raw = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    b64ToBytes(encryptedB64),
  )
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
}

// Encrypt a plaintext string with an AES-GCM key.
// Returns a JSON string: {"iv":"<b64>","data":"<b64>"}
export async function encryptText(text: string, key: CryptoKey): Promise<string> {
  const enc = new TextEncoder()
  const iv = generateIv()
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(text))
  return JSON.stringify({ iv: bytesToB64(iv), data: bytesToB64(ciphertext) })
}

// Decrypt a ciphertext string produced by encryptText.
export async function decryptText(cipher: string, key: CryptoKey): Promise<string> {
  const { iv, data } = JSON.parse(cipher) as { iv: string; data: string }
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: b64ToBytes(iv) },
    key,
    b64ToBytes(data),
  )
  return new TextDecoder().decode(plaintext)
}

// Encrypt file bytes. Returns ArrayBuffer with 12-byte IV prepended to ciphertext.
export async function encryptFile(data: ArrayBuffer, key: CryptoKey): Promise<ArrayBuffer> {
  const iv = generateIv()
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)
  const result = new Uint8Array(12 + ciphertext.byteLength)
  result.set(iv, 0)
  result.set(new Uint8Array(ciphertext), 12)
  return result.buffer
}

// Decrypt file bytes produced by encryptFile (IV prepended).
export async function decryptFile(data: ArrayBuffer, key: CryptoKey): Promise<ArrayBuffer> {
  const iv = new Uint8Array(data, 0, 12)
  const ciphertext = new Uint8Array(data, 12)
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
}
