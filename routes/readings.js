const express = require('express');
const { submitReading, getReadings, getCustomerReadings } = require('../controllers/readingController');

// Readings Router
const readingsRouter = express.Router();

// GET all readings
readingsRouter.get('/', getReadings);

// GET all readings for a customer
readingsRouter.get('/:customer_id', getCustomerReadings);

// Reading Submission
readingsRouter.post('/', submitReading);

// Reading Payment
readingsRouter.put('/:id', (req, res) => {
    res.status(200).json({message: 'payment done for reading'});
});

module.exports = readingsRouter;
