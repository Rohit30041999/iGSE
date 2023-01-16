const express = require('express');
const customerModel = require('../models/customerModel');

// property count rest api router
const propertycountRouter = express.Router();

propertycountRouter.get('/propertycount', async (req, res) => {
    try {
       const detached = await customerModel.find({ property_type: "detached" }); 
       const semi_detached = await customerModel.find({ property_type: "semi-detached" }); 
       const terraced = await customerModel.find({ property_type: "terraced" }); 
       const flat = await customerModel.find({ property_type: "flat" }); 
       const cottage = await customerModel.find({ property_type: "cottage" }); 
       const bungalow = await customerModel.find({ property_type: "bungalow" }); 
       const mansion = await customerModel.find({ property_type: "mansion" });

       res.status(200).json([
        { detached: String(detached.length) },
        { semi_detached: String(semi_detached.length) },
        { terraced: String(terraced.length) },
        { flat: String(flat.length) },
        { cottage: String(cottage.length) },
        { bungalow: String(bungalow.length) },
        { mansion: String(mansion.length) } 
       ]);
    }
    catch(error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = propertycountRouter;