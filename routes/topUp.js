const express = require('express');
const vouchersModel = require('../models/vouchersModel');
const customerModel = require('../models/customerModel');


// top up router
const topUpRouter = express.Router();

// top up the customers energy credit
topUpRouter.post('/', async (req, res) => {
    const { customer_id, evc_code } = req.body;

    try {
        const evc_code_exists = await vouchersModel.findOne({ evc_code: evc_code });

        if(evc_code_exists) {
            throw Error('Voucher has been used already');
        }
        
        const customer = await customerModel.findOne({ customer_id: customer_id });

        const filter = { customer_id: customer_id };
        const change = { energy_credit: customer['energy_credit'] + 200 };

        await customerModel.findOneAndUpdate(filter, change);

        await vouchersModel.create({ 
            evc_code: evc_code, 
            used: true 
        });

        res.status(200).json({ customer_id: customer_id, energy_credit: customer['energy_credit'] + 200 });
    }
    catch(error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = topUpRouter;