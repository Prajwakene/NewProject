// Decryption logic using the Web Crypto API
async function decryptData(encryptedData, privateKey) {
    const encryptedArray = new Uint8Array(
      atob(encryptedData)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
  
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      encryptedArray
    );
  
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }
  