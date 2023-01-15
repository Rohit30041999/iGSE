require('dotenv').config();

const express = require('express');
const customerRouter = require('./routes/customers');
const readingsRouter = require('./routes/readings');
const PORT = process.env.PORT || 8080;

// DataBase
const mongoose = require('mongoose');
const taiffRouter = require('./routes/taiffs');
const { billsRouter } = require('./routes/bills');
const topUpRouter = require('./routes/topUp');

// Application
const application = express();

application.use(express.json());

// middleware helpful for logging the request or response details
application.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

/* 
    API routes
*/
// Customer Routes
application.use('/api/igse/customers', customerRouter);

// Reading Routes
application.use('/api/igse/readings', readingsRouter);

// Taiff Routes
application.use('/api/igse/taiffs', taiffRouter);

// Bills Routes
application.use('/api/igse/bills', billsRouter);

// Top Ups Routes
application.use('/api/igse/topup', topUpRouter);

// connect to database
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Serving port for the App
        application.listen(PORT, () => {
            console.log(`Connected to DB and Server running on post ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
