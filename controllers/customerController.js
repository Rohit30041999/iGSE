const mongoose = require('mongoose');
const Customer = require('../models/customerModel');
const jwt = require('jsonwebtoken');

// create token
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRETKEY, { expiresIn: '3d' });
}

// login customer
const loginCustomer = async (req, res) => {
    const {customer_id, password} = req.body;

    try {
        const customer = await Customer.login(customer_id, password);

        const authToken = createToken(customer._id);

        res.status(200).json(customer);
    } 
    catch(error) {
        res.status(400).json({ error: error.message });
    }
}

// register customer
const registerCustomer = async (req, res) => {
    const { customer_id, 
        password, 
        address, 
        property_type, 
        bedroom_num, 
        customer_type, 
        evc_code } = req.body;

    try {
        const customer = await Customer.register(customer_id, 
                                                password, 
                                                address, 
                                                property_type, 
                                                bedroom_num, 
                                                customer_type, 
                                                200, 
                                                evc_code);

        const authToken = createToken(customer._id);
            
        res.status(200).json(customer);
    }
    catch(error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { loginCustomer, registerCustomer };