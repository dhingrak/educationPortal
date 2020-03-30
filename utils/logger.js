// const winston = require('winston');

// // Logs the messages to the console as well as in the file
// module.exports = function(message){

//    //winston.add(winston.transports.File, { filename: 'logfile.log' });
//     winston.log(message);
//    // winston.Console(`${new Date()} : ${message}`)
// }

const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });

  winston.add(logger);
  
