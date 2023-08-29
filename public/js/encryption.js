// Encryption logic using the Web Crypto API
async function encryptData(data, publicKey) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
  
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      dataBuffer
    );
  
    const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
    return btoa(String.fromCharCode(...encryptedArray));
  }
  