// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const crypto = require('crypto');
// // const data = require('./data.json');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// const PORT = process.env.PORT || 3001; // Change the port number to 8001 or any other available port

// const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// // In emitter.js and listener.js
// const encryptionKey = '7f371d3b93863e513087c19a353db55ce9fabb43d34a895e3783afaef6662b15'; // Replace with the generated key

// function generateRandomMessage(iv) {
//   const name = data.names[getRandomInt(0, data.names.length - 1)];
//   const origin = data.cities[getRandomInt(0, data.cities.length - 1)];
//   const destination = data.cities[getRandomInt(0, data.cities.length - 1)];

//   const originalMessage = { name, origin, destination };
//   const secretKey = crypto.createHash('sha256').update(JSON.stringify(originalMessage)).digest('hex');
//   originalMessage.secret_key = secretKey;

//   // Encrypt the payload using aes-256-ctr with the pass key and IV
//   const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(encryptionKey, 'hex'), iv);
//   const encryptedMessage = Buffer.concat([cipher.update(JSON.stringify(originalMessage), 'utf8'), cipher.final()]);
  
//   // encryptedMessage += cipher.final('hex');

//   return {
//     message: encryptedMessage.toString('hex'), // Convert to a hexadecimal string
//     iv: iv.toString('hex'), // Include the IV in the message
//   };
// };

// io.on('connection', (socket) => {
//   console.log('Emitter connected to Listener');

//   setInterval(() => {
//     const messageStream = [];
//     const numberOfMessages = getRandomInt(49, 499);

//     for (let i = 0; i < numberOfMessages; i++) {
//       messageStream.push(generateRandomMessage());
//     }

//     socket.emit('data-stream', messageStream.join('|'));
//   }, 5000); // Send a new message stream every 10 seconds
// });

// server.listen(PORT, () => {
//   console.log(`Emitter listening on port ${PORT}`);
// });
