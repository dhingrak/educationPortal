const mongoose = require('mongoose');
const config = require('config');
//const logger = require('../utils/logger');
const winston = require('winston');

mongoose.connect(config.get('MONGODB_URL'), {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        winston.info('Successfully connected to the database');
    })
    .catch((error) => {
        winston.error('Unable to connect to the database');
    })