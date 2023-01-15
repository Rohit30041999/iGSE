const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const readingSchema = new Schema({
    submission_date: {
        type: Date,
        required: true
    },
    elec_readings_day: {
        type: Number,
        required: true
    },
    elet_reading_night: {
        type: Number,
        required: true
    },
    gas_reading: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    customer_id: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Reading', readingSchema);