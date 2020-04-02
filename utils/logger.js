const fs = require('fs');
var Logger = {};
var infoStream = fs.createWriteStream("logs/info.txt", { flags: 'a' });
var debugStream = fs.createWriteStream("logs/debug.txt", { flags: 'a' });
var errorStream = fs.createWriteStream("logs/error.txt", { flags: 'a' });

Logger.info = function (msg, errorStack) {
    var message = new Date().toUTCString() + " | " + "INFO"  + " | " +  msg + "\n";
    infoStream.write(message);
}

Logger.debug = function (msg, errorStack) {
    var message = new Date().toUTCString() + " | " + "DEBUG" + " | " + msg + "\n";
    debugStream.write(message);
}

Logger.error = function (msg, errorStack) {
    var message = new Date().toUTCString() + " | " + "ERROR" + " | " +  msg + " | " + errorStack + "\n";
    errorStream.write(message);
 }

module.exports = Logger;
  
