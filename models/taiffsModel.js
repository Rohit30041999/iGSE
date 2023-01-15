const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taiffSchema = new Schema({
    taiff_type: {
        type: String,
        required: true,
        unique: true
    },
    rate: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Taiff', taiffSchema);