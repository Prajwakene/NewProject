const socket = io();

socket.on('data', (data) => {
  // Decrypt and process the data here
  // You'll need to use the same secret key and decryption algorithm
  // that you used in the server to decrypt the data
  const decipher = crypto.createDecipher('aes-256-cbc', 'your-secret-key');
  let decryptedData = decipher.update(data, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');

  // Process the decrypted data and update your frontend
  console.log(JSON.parse(decryptedData));
});
