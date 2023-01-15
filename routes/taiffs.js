const express = require('express');
const { addTaiff, updateTaiff } = require('../controllers/taiffController');

// taiffs Router
const taiffRouter = express.Router();

// Add Taiffs
taiffRouter.post('/', addTaiff);

// Update Taiffs
taiffRouter.put('/:id', updateTaiff);

module.exports = taiffRouter;