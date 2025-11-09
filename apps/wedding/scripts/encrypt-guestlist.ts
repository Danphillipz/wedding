import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

function encrypt(text: string, password: string): string {
  // Generate random salt and IV
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);

  // Derive key from password
  const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');

  // Encrypt
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Combine salt + iv + tag + encrypted
  const result = Buffer.concat([salt, iv, tag, encrypted]);
  return result.toString('base64');
}

function decrypt(encryptedData: string, password: string): string {
  const buffer = Buffer.from(encryptedData, 'base64');

  // Extract components
  const salt = buffer.subarray(0, SALT_LENGTH);
  const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = buffer.subarray(
    SALT_LENGTH + IV_LENGTH,
    SALT_LENGTH + IV_LENGTH + TAG_LENGTH
  );
  const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

  // Derive key from password
  const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');

  // Decrypt
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString('utf8');
}

// Main execution
const password = process.argv[2];
if (!password) {
  console.error('Usage: ts-node encrypt-guestlist.ts <password>');
  process.exit(1);
}

const guestlistPath = path.join(__dirname, '..', 'src', 'data', 'guestlist.json');
const encryptedPath = path.join(__dirname, '..', 'src', 'data', 'guestlist.encrypted.json');

// Read original guestlist
const guestlistData = fs.readFileSync(guestlistPath, 'utf8');

// Encrypt
const encrypted = encrypt(guestlistData, password);

// Save encrypted version
fs.writeFileSync(
  encryptedPath,
  JSON.stringify({ encrypted, version: 1 }, null, 2)
);

console.log('✅ Guestlist encrypted successfully');
console.log(`   Output: ${encryptedPath}`);
console.log(`   Size: ${guestlistData.length} → ${encrypted.length} bytes`);

// Test decryption
try {
  const decrypted = decrypt(encrypted, password);
  const matches = decrypted === guestlistData;
  console.log(`   Test: ${matches ? '✅ Decryption verified' : '❌ Decryption failed'}`);
} catch (e) {
  console.error('❌ Decryption test failed:', e);
  process.exit(1);
}
