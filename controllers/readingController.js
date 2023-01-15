const mongoose = require('mongoose');
const Reading = require('../models/readingsModel');
const readingsModel = require('../models/readingsModel');

// Get all Readings
const getReadings = async (req, res) => {
    try {
        const readings = await readingsModel.find({}).sort({status: -1});
        res.status(200).json(readings);
    }
    catch(error) {
        res.status(400).json({ error: error.message });
    }
}

// Get all customer Readings
const getCustomerReadings = async (req, res) => {
    const { customer_id } = req.params;
    try {
        const readings = await readingsModel.find({ customer_id: customer_id }).sort({submission_date: -1});
        res.status(200).json(readings);
    }
    catch(error) {
        res.status(400).json({ error: error.message });
    }
}

// Create a new Reading
const submitReading = async (req, res) => {
    const { submission_date, 
        elec_readings_day, 
        elet_reading_night, 
        gas_reading, 
        status, 
        customer_id } = req.body;

    try {
        const reading = await Reading.create({
            submission_date: submission_date,
            elec_readings_day: elec_readings_day,
            elet_reading_night: elet_reading_night,
            gas_reading: gas_reading,
            status: status,
            customer_id: customer_id
        });

        res.status(200).json(reading);
    }
    catch(error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { 
    getReadings, 
    getCustomerReadings, 
    submitReading };