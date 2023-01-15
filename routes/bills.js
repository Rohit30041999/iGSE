const express = require('express');
const { generateCustomerBill, payBill } = require('../controllers/billsController');

// Bills Router
const billsRouter = express.Router();


// Generate the latest bill for the Customer
billsRouter.get('/:customer_id', generateCustomerBill);

// payment for the bill generated
billsRouter.post('/', payBill);

module.exports = { billsRouter };