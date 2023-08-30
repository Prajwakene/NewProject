const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');
// const data = require('./data.json');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomMessage = () => {
  const name = data.names[getRandomInt(0, data.names.length - 1)];
  const origin = data.cities[getRandomInt(0, data.cities.length - 1)];
  const destination = data.cities[getRandomInt(0, data.cities.length - 1)];

  const originalMessage = { name, origin, destination };
  const secretKey = crypto.createHash('sha256').update(JSON.stringify(originalMessage)).digest('hex');
  originalMessage.secret_key = secretKey;

  // Encrypt the payload using aes-256-ctr with a pass key (replace 'yourPassKey' with your actual key)
  const cipher = crypto.createCipher('aes-256-ctr', 'yourPassKey');
  let encryptedMessage = cipher.update(JSON.stringify(originalMessage), 'utf8', 'hex');
  encryptedMessage += cipher.final('hex');

  return encryptedMessage;
};

io.on('connection', (socket) => {
  console.log('Emitter connected to Listener');

  setInterval(() => {
    const messageStream = [];
    const numberOfMessages = getRandomInt(49, 499);

    for (let i = 0; i < numberOfMessages; i++) {
      messageStream.push(generateRandomMessage());
    }

    socket.emit('data-stream', messageStream.join('|'));
  }, 10000); // Send a new message stream every 10 seconds
});

server.listen(PORT, () => {
  console.log(`Emitter listening on port ${PORT}`);
});
