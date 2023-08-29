// Import necessary modules
const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const mongoose = require('mongoose'); // Import mongoose for MongoDB
const { Schema } = mongoose;

// Define a MongoDB schema and model
const dataSchema = new Schema({
  name: String,
  city: String,
});

const Data = mongoose.model('Data', dataSchema);

// Route to handle incoming data
router.post('/data', async (req, res) => {
  const { name, city } = req.body;

  try {
    // Create a new data instance using the MongoDB model
    const newData = new Data({
      name,
      city,
    });

    // Save the data to MongoDB
    const savedData = await newData.save();

    // Emit saved data to frontend via Socket.io
    req.app.io.emit('newData', savedData);

    res.json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
