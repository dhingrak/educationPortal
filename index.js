require('express-async-errors');
const express = require('express');
const app = express();
const logger = require('./utils/logger');
const config = require('config');


require('./startup/routes')(app);
require('./startup/db');
require('./utils/logger');

try{
    config.get('jwtPrivateKey');
}
catch(ex){
    logger.error(ex.stack);
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => {
    console.log(`Server is up on port ${PORT} `);
    logger.info(`Server is up on port ${PORT} `);
});