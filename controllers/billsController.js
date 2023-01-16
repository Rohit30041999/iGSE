const customerModel = require("../models/customerModel");
const readingsModel = require("../models/readingsModel");
const taiffsModel = require("../models/taiffsModel");

// generate the bill
const generateCustomerBill = async (req, res) => {
    const { customer_id } = req.params;
    try {
        const readings = await readingsModel.find({ customer_id: customer_id }).sort({submission_date: -1});
        
        const electricity_day = await taiffsModel.findOne({ taiff_type: "electricity_day" });
        const electricity_night = await taiffsModel.findOne({ taiff_type: "electricity_night" });
        const gas = await taiffsModel.findOne({ taiff_type: "gas" });
        const standing_charge = await taiffsModel.findOne({ taiff_type: "standing_charge" });
        
        let bill = 0.0;

        if(readings.length > 0) {

            if(readings[0]['status'] === 'unpaid') {

                const elec_day_reading_unpaid = readings[0]['elec_readings_day'];
                const elec_night_reading_unpaid = readings[0]['elet_reading_night'];
                const gas_reading_unpaid = readings[0]['gas_reading'];

                // console.log(elec_day_reading_unpaid, elec_night_reading_unpaid, gas_reading_unpaid)
                let months = 0;
                let noPaidReadings = true;

                for(let reading of readings) {
                    if(reading['status'] === "paid") {
                        const elec_day_reading_paid = reading['elec_readings_day'];
                        const elec_night_reading_paid = reading['elet_reading_night'];
                        const gas_reading_paid = reading['gas_reading'];

                        bill = ((elec_day_reading_unpaid - elec_day_reading_paid) * electricity_day['rate']) +
                                ((elec_night_reading_unpaid - elec_night_reading_paid) * electricity_night['rate']) +
                                ((gas_reading_unpaid - gas_reading_paid) * gas['rate']) +
                                (standing_charge['rate'] * (30 * months));
                        
                        // console.log(elec_day_reading_paid, elec_night_reading_paid, gas_reading_paid)
                        // console.log(bill);
                        noPaidReadings = false;
                        break;
                    }
                    months = months + 1;
                }

                if(noPaidReadings) {
                    bill = ((elec_day_reading_unpaid) * electricity_day['rate']) +
                            ((elec_night_reading_unpaid) * electricity_night['rate']) +
                            ((gas_reading_unpaid) * gas['rate']) +
                            (standing_charge['rate'] * (30 * months));
                }
            }
        }

        res.status(200).json({ bill: bill });
    }
    catch(error) {
        res.status(400).json({ error: error.message });
    }
}

// bill payment
const payBill = async (req, res) => {
    const { customer_id, energy_credit } = req.body

    try {
        const readings = await readingsModel.find({ customer_id: customer_id }).sort({submission_date: -1});
        
        const electricity_day = await taiffsModel.findOne({ taiff_type: "electricity_day" });
        const electricity_night = await taiffsModel.findOne({ taiff_type: "electricity_night" });
        const gas = await taiffsModel.findOne({ taiff_type: "gas" });
        const standing_charge = await taiffsModel.findOne({ taiff_type: "standing_charge" });
        
        let bill = 0.0;

        if(readings.length > 0) {

            if(readings[0]['status'] === 'unpaid') {

                const elec_day_reading_unpaid = readings[0]['elec_readings_day'];
                const elec_night_reading_unpaid = readings[0]['elet_reading_night'];
                const gas_reading_unpaid = readings[0]['gas_reading'];

                // console.log(elec_day_reading_unpaid, elec_night_reading_unpaid, gas_reading_unpaid)
                let months = 0;
                let noPaidReadings = true;

                for(let reading of readings) {
                    if(reading['status'] === "paid") {
                        const elec_day_reading_paid = reading['elec_readings_day'];
                        const elec_night_reading_paid = reading['elet_reading_night'];
                        const gas_reading_paid = reading['gas_reading'];

                        bill = ((elec_day_reading_unpaid - elec_day_reading_paid) * electricity_day['rate']) +
                                ((elec_night_reading_unpaid - elec_night_reading_paid) * electricity_night['rate']) +
                                ((gas_reading_unpaid - gas_reading_paid) * gas['rate']) +
                                (standing_charge['rate'] * (30 * months));
                        
                        // console.log(elec_day_reading_paid, elec_night_reading_paid, gas_reading_paid)
                        // console.log(bill);
                        noPaidReadings = false;
                        break;
                    }
                    months = months + 1;
                }

                if(noPaidReadings) {
                    bill = ((elec_day_reading_unpaid) * electricity_day['rate']) +
                            ((elec_night_reading_unpaid) * electricity_night['rate']) +
                            ((gas_reading_unpaid) * gas['rate']) +
                            (standing_charge['rate'] * (30 * months));
                }
            }
        } else {
            throw Error('Payment is Up to date');
        }

        if(bill <= 0.0) {
            throw Error('No Payment Required As of now');
        }

        if(energy_credit < bill) {
            throw Error('Low on Energy Credit. Please make sure you have enough money.');
        } 

        const filter = { customer_id: customer_id };
        const change = { energy_credit: energy_credit - bill };

        const updatedCustomer = await customerModel.findOneAndUpdate(filter, change);

        const customer = await customerModel.findOne(filter);

        // Mark all readings as paid.
        for(const reading of readings) {
            if(reading['status'] === 'unpaid') {
                const filter = { _id: reading['_id'] }
                const change = { status: 'paid' }
                const updatedReading = await readingsModel.findOneAndUpdate(filter, change);
            }
        }

        res.status(200).json(customer);
    }
    catch(error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { generateCustomerBill, payBill };