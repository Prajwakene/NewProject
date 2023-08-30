const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const crypto = require('crypto');
const data = require('./data.json');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


// MongoDB connection setup
mongoose.connect("mongodb://127.0.0.1:27017/time_series_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;


// Listen for the MongoDB connection event
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});
// Define a MongoDB schema and model for your timeseries data
const timeseriesSchema = new mongoose.Schema({
  name: String,
  origin: String,
  destination: String,
  secret_key: String,
  timestamp: Date,
});

const TimeseriesModel = mongoose.model('Timeseries', timeseriesSchema);

// Function to generate a secret key
function generateSecretKey(obj) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(obj));
  return hash.digest('hex');
}

// Periodically emit encrypted data to clients
io.on('connection', (socket) => {
  setInterval(() => {
    const numMessages = Math.floor(Math.random() * 451) + 49; // Random number of messages
    const messages = [];

    for (let i = 0; i < numMessages; i++) {
      const randomName = data.names[Math.floor(Math.random() * data.names.length)];
      const randomOrigin = data.cities[Math.floor(Math.random() * data.cities.length)];
      const randomDestination = data.cities[Math.floor(Math.random() * data.cities.length)];

      const originalMessage = {
        name: randomName,
        origin: randomOrigin,
        destination: randomDestination,
      };

      const secret_key = generateSecretKey(originalMessage);
      const encryptedMessage = encryptMessage(JSON.stringify(originalMessage), '7f371d3b93863e513087c19a353db55ce9fabb43d34a895e3783afaef6662b15'); // Change this key

      messages.push({ ...originalMessage, secret_key, encryptedMessage });
    }

    socket.emit('data', messages.join('|'));
  }, 10000); // Send data every 10 seconds
});

// Function to encrypt a message
function encryptMessage(message, secretKey) {
  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(16);

  // Create a Cipher using AES-256-CTR
  const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(secretKey), iv);

  // Encrypt the message
  const encrypted = Buffer.concat([iv, cipher.update(message, 'utf-8'), cipher.final()]);

  // Return the encrypted message as a hexadecimal string
  return encrypted.toString('hex');
}

server.listen(8000, () => {
  console.log('Server is running on port 8000');
});
