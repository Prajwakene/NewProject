const express = require('express');
const http = require('http');
const mongoose =require('mongoose')
const socketIo = require('socket.io');
const crypto = require('crypto');
const Influx = require('influx');
const path = require('path');
// const { DataController } = require('./controllers/dataController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// InfluxDB setup
const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'your_database_name',
  schema: [
    {
      measurement: 'data',
      fields: {
        // Define your fields here
        name: Influx.FieldType.STRING,
        city: Influx.FieldType.STRING,
      },
      tags: [],
    },
  ],
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

// MongoDB connection setup
mongoose.connect('mongodb://127.0.0.1:27017/time_series_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Socket.io setup
io.on('connection', (socket) => {
  console.log('Client connected');
  DataController.emitData(socket, influx);
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
