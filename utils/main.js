// Import the encryption and decryption functions
import { encryptData } from './encryption.js';
import { decryptData } from './decryption.js';

// Example usage
const publicKey = /* Get the public key */;
const privateKey = /* Get the private key */;

const originalData = "Hello, world!";
encryptData(originalData, publicKey)
  .then((encryptedData) => {
    console.log("Encrypted Data:", encryptedData);
    return decryptData(encryptedData, privateKey);
  })
  .then((decryptedData) => {
    console.log("Decrypted Data:", decryptedData);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
