const mongoose = require('mongoose');
const Taiff = require('../models/taiffsModel');

// Add a Taiff
const addTaiff = async (req, res) => {
    const { taiff_type, rate } = req.body;

    try {
        const taiff = await Taiff.create({
            taiff_type: taiff_type,
            rate: rate
        });
    
        res.status(200).json(taiff);
    }
    catch(error) {
        res.status(400).json({ error: error.message });
    }
}

// Update a Taiff
const updateTaiff = async (req, res) => {
    const { taiff_type, rate } = req.body;

    const filter = { taiff_type: taiff_type };
    const update = { rate: rate };

    try {
        const taiff = await Taiff.findOneAndUpdate(filter, update);

        res.status(200).json(taiff);
    }
    catch(error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { addTaiff, updateTaiff };