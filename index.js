const express = require('express');
const app = express();
const logger = require('./utils/logger');


require('./startup/routes')(app);
require('./startup/db');
require('./utils/logger');

const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => {
    logger.info(`Server is up on port ${PORT} `);
});