const logger = require('../utils/logger');

// Logging errors
module.exports = function (error, req, res, next) {
    logger.error(error);
    res.status(500).send({ message: 'Internal server error' });
};
