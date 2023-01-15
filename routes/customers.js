const express = require('express');
const { loginCustomer, registerCustomer } = require('../controllers/customerController');

// Customers Router
const customerRouter = express.Router();

// User Registration
customerRouter.post('/register', registerCustomer);

// User Login
customerRouter.post('/login', loginCustomer);

module.exports = customerRouter;