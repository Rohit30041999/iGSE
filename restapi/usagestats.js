const express = require('express');
const customerModel = require('../models/customerModel');
const taiffsModel = require('../models/taiffsModel');
const readingsModel = require('../models/readingsModel');

// usage statistics rest api router
const usageStatsRouter = express.Router();

usageStatsRouter.get('/:property_type/:bedroom_num', async (req, res) => {
    const { property_type, bedroom_num } = req.params;

    // console.log(req.params.property_type);

    try {
        const customers = await customerModel.find({ 
            property_type: property_type,
            bedroom_num: bedroom_num
        });
        
        const electricity_day = await taiffsModel.findOne({ taiff_type: "electricity_day" });
        const electricity_night = await taiffsModel.findOne({ taiff_type: "electricity_night" });
        const gas = await taiffsModel.findOne({ taiff_type: "gas" });
        const standing_charge = await taiffsModel.findOne({ taiff_type: "standing_charge" });

        let average_electricity_gas_cost_per_day = 0;

        for(const customer of customers) {
            const readings = await readingsModel.find({ customer_id: customer.customer_id }).sort({submission_date: -1});
            
            if(readings.length > 0) {
                const elec_day_reading = readings[0]['elec_readings_day'];
                const elec_night_reading = readings[0]['elet_reading_night'];
                const gas_reading = readings[0]['gas_reading'];

                const bill = ((elec_day_reading) * electricity_day['rate']) +
                                ((elec_night_reading) * electricity_night['rate']) +
                                ((gas_reading) * gas['rate']) +
                                (standing_charge['rate'] * (30 * (readings.length - 1)));

                average_electricity_gas_cost_per_day += (bill / (30 * (readings.length - 1)));
            }
        }

        res.status(200).json({
            type: property_type,
            bedroom: bedroom_num,
            average_electricity_gas_cost_per_day: average_electricity_gas_cost_per_day,
            unit: "pound"
        });
    }
    catch(error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = usageStatsRouter;