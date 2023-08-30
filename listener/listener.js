// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const crypto = require('crypto');
// const mongoose = require('mongoose');
// // const data = require('./data.json');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// const PORT = process.env.PORT || 3001; // Change the port number to 8001 or any other available port

// mongoose.connect('mongodb://127.0.0.1:27017/time_series_db', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const timeseriesSchema = new mongoose.Schema({
//   name: String,
//   origin: String,
//   destination: String,
//   secret_key: String,
//   timestamp: Date,
// });

// const TimeSeriesModel = mongoose.model('TimeSeries', timeseriesSchema);

// io.on('connection', (socket) => {
//   console.log('Listener connected to Emitter');

//   socket.on('data-stream', (encryptedDataStream) => {
//     const messages = encryptedDataStream.split('|');
  
//     messages.forEach(async (message) => {
//       const parsedMessage = JSON.parse(message);
  
//       // Extract the IV from the message
//       const iv = Buffer.from(parsedMessage.iv, 'hex');
  
//       // Decrypt the message using aes-256-ctr with the pass key and IV
//       const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(encryptionKey, 'hex'), iv);
//       const decryptedMessage = Buffer.concat([decipher.update(Buffer.from(parsedMessage.message, 'hex')), decipher.final()]);
  
//       // Convert the decrypted message to a string
//       const decryptedMessageString = decryptedMessage.toString('utf8');
  
//       // Validate the secret_key to ensure data integrity
//       const secretKey = crypto.createHash('sha256').update(decryptedMessageString).digest('hex');
//       if (secretKey === parsedMessage.secret_key) {
//         parsedMessage.timestamp = new Date();
//         const timeseriesData = new TimeSeriesModel(JSON.parse(decryptedMessageString));
//         await timeseriesData.save();
//       }
//     });
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Listener listening on port ${PORT}`);
// });

