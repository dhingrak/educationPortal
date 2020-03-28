const express = require('express');
const app = express();
//const logger = require('./utils/logger');
const wisnton = require('winston');


require('./startup/routes')(app);
require('./startup/db');
require('./utils/logger');

const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => {
    wisnton.info(`Server is up on port ${PORT} `);
});