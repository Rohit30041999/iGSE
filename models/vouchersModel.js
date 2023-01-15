const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const voucherSchema = new Schema({
    evc_code: {
        type: String,
        required: true,
        unique: true
    },
    used: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Voucher', voucherSchema);