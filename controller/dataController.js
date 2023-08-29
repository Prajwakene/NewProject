const crypto = require('crypto');

class DataController {
  static emitData(socket, influx) {
    // Generate encrypted data and send it to the client
    setInterval(() => {
      const names = []; // Your array of names
      const cities = []; // Your array of cities

      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];

      const data = { name: randomName, city: randomCity };

      // Encrypt the data
      const cipher = crypto.createCipher('aes-256-cbc', 'your-secret-key');
      let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encryptedData += cipher.final('hex');

      socket.emit('data', encryptedData);

      // Save the data to InfluxDB
      influx.writePoints([
        {
          measurement: 'data',
          fields: { name: randomName, city: randomCity },
        },
      ]);
    }, 5000); // Send data every 5 seconds
  }
}

module.exports = { DataController };
