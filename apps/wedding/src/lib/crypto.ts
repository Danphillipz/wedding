const ITERATIONS = 100000;
const SALT_LENGTH = 64;
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

interface EncryptedData {
  encrypted: string;
  version: number;
}

export async function decryptGuestlist(
  encryptedData: EncryptedData,
  password: string
): Promise<string> {
  const buffer = base64ToBuffer(encryptedData.encrypted);

  // Extract components
  const salt = buffer.slice(0, SALT_LENGTH);
  const iv = buffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = buffer.slice(
    SALT_LENGTH + IV_LENGTH,
    SALT_LENGTH + IV_LENGTH + TAG_LENGTH
  );
  const encrypted = buffer.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

  // Derive key from password using PBKDF2
  const key = await deriveKey(password, salt);

  // Decrypt using AES-GCM
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128,
    },
    key,
    new Uint8Array([...encrypted, ...tag])
  );

  return new TextDecoder().decode(decrypted);
}

async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
}

function base64ToBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
