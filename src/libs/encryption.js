// libs/encryption.js
import crypto from 'crypto';

// Secret key for encryption - Ensure to store it securely (like in environment variables)
const secretKey = process.env.ENCRYPTION_SECRET_KEY || 'mySuperSecretKey1234567890';

// Encryption function using AES-256-CTR algorithm
// Encryption function for strings
export const encryptVote = (data) => {
  const cipher = crypto.createCipher('aes-256-ctr', secretKey);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Decryption function for strings
export const decryptVote = (encryptedData) => {
  try {
    const decipher = crypto.createDecipher('aes-256-ctr', secretKey);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    console.log('Decrypted data:', decrypted); // Debugging output

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};