const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');
const Influx = require('influx');
const path = require('path');
const { DataController } = require('./controllers/dataController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// InfluxDB setup
const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'your_database_name', // Change this to your InfluxDB database name
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

io.on('connection', (socket) => {
  console.log('Client connected');
  DataController.emitData(socket, influx);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
