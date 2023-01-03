require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 8080;

// Application
const application = express();

application.use(express.json());

// middleware helpful for logging the request or response details
application.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// requests
application.get('/', (req, res) => {
    res.status(200).json({message: "Hello iGSE"});
});

// Serving port for the App
application.listen(PORT, () => {
    console.log(`Server running on post ${PORT}`);
});
