//const logger = require('../utils/logger');
const winston = require('winston');

module.exports = function (error, req, res, next) {
    winston.error(error.message);
    res.status(500).send({ message: 'Internal server error' });
};
