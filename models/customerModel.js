const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const vouchersModel = require('./vouchersModel');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    customer_id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    property_type: {
        type: String,
        required: true
    },
    bedroom_num: {
        type: Number,
        required: true
    },
    customer_type: {
        type: String,
        required: true
    },
    energy_credit: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Register the customer with password protection
customerSchema.statics.register = async function(customer_id, password, address, property_type, bedroom_num, customer_type, energy_credit, evc_code) {
    if(!customer_id || !password || !address || !property_type || !bedroom_num) {
        throw Error('Enter all the details.');
    }
    if(!validator.isEmail(customer_id)) {
        throw Error('Provide a valid email address.');
    }
    if(!validator.isStrongPassword(password) && customer_type !== "admin") {
        throw Error('Create a strong password');
    }

    const customer_idExists = await this.findOne({ customer_id });

    if(customer_idExists) {
        throw Error('Cannot register with a used Mail ID');
    }

    const voucher_used = await vouchersModel.findOne({ evc_code });

    if(voucher_used) {
        throw Error('Provide a unused EVC code.');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const customer = await this.create({
        customer_id: customer_id,
        password: hash,
        address: address,
        property_type: property_type,
        bedroom_num: bedroom_num,
        customer_type: customer_type,
        energy_credit: energy_credit
    });

    const voucher = await vouchersModel.create({
        evc_code: evc_code,
        used: true
    });

    return customer;
}

// login the customer
customerSchema.statics.login = async function(customer_id, password) {
    if(!customer_id || !password) {
        throw Error('Enter all details.');
    }

    const customer = await this.findOne({ customer_id });

    if(!customer) {
        throw Error('Provide a valid Mail ID');
    }

    const passwordMatch = await bcrypt.compare(password, customer.password);

    if(!passwordMatch) {
        throw Error('Provide a valid password');
    }

    return customer;
}

module.exports = mongoose.model('Customer', customerSchema);