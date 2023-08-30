const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');
const mongoose = require('mongoose');
// const data = require('./data.json');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 4000;

mongoose.connect('mongodb://127.0.0.1:27017/time_series_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const timeseriesSchema = new mongoose.Schema({
  name: String,
  origin: String,
  destination: String,
  secret_key: String,
  timestamp: Date,
});

const TimeSeriesModel = mongoose.model('TimeSeries', timeseriesSchema);

io.on('connection', (socket) => {
  console.log('Listener connected to Emitter');

  socket.on('data-stream', (encryptedDataStream) => {
    const messages = encryptedDataStream.split('|');

    messages.forEach(async (message) => {
      // Decrypt the message using aes-256-ctr with the same pass key
      const decipher = crypto.createDecipher('aes-256-ctr', 'yourPassKey');
      let decryptedMessage = decipher.update(message, 'hex', 'utf8');
      decryptedMessage += decipher.final('utf8');

      const parsedMessage = JSON.parse(decryptedMessage);

      // Validate the secret_key to ensure data integrity
      const secretKey = crypto.createHash('sha256').update(JSON.stringify(parsedMessage)).digest('hex');
      if (secretKey === parsedMessage.secret_key) {
        parsedMessage.timestamp = new Date();
        const timeseriesData = new TimeSeriesModel(parsedMessage);
        await timeseriesData.save();
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Listener listening on port ${PORT}`);
});
