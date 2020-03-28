const logger = require('../startup/logger');


module.exports = function (error, req, res, next) {
    logger(error.message);
    res.status(500).send({ message: 'Internal server error' });
};
