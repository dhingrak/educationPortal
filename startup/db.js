const mongoose = require('mongoose');
const config = require('config');
const logger = require('../utils/logger');

mongoose.connect(config.get('MONGODB_URL'), {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex: true})
    .then(() => {
        logger.info('Successfully connected to the database');
    })
    .catch((error) => {
        logger.error('Unable to connect to the database');
    })