const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');
const Influx = require('influx');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Replace these values with your own secret key and IV
const secretKey = 'your-secret-key';
const iv = 'your-iv';

// In a real scenario, store these sensitive information securely
// Initialize the InfluxDB instance
const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'your-database-name',
  schema: [
    {
      measurement: 'data',
      fields: {
        value: Influx.FieldType.FLOAT,
      },
      tags: ['source'],
    },
  ],
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Simulate generating encrypted data
  const originalData = 42;
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encryptedData = cipher.update(String(originalData), 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  // Emit encrypted data to frontend
  socket.emit('encryptedData', encryptedData);

  // Listen for decrypted data from frontend
  socket.on('decryptedData', async (data) => {
    console.log('Received decrypted data:', data);

    // Decode and save to InfluxDB
    const decodedData = parseFloat(data);
    await influx.writePoints([
      {
        measurement: 'data',
        fields: { value: decodedData },
        tags: { source: 'frontend' },
      },
    ]);

    // Emit saved data to frontend
    io.emit('savedData', decodedData);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
