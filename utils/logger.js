const fs = require('fs');
var dir = 'logs';

class Logger {
    infoStream;
    debugStream;
    errorStream;

    constructor(){
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }

    getDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date().toLocaleDateString(undefined, options);
        const time = new Date().toLocaleTimeString();
        return `${date} ${time}`;
    }

    info(message) {
        this.infoStream = fs.createWriteStream("logs/info.txt", { flags: 'a' });
        message = `${this.getDate()} | INFO | ${message} \n`;
        this.infoStream.write(message);
    }

    debug(message) {
        this.debugStream = fs.createWriteStream("logs/debug.txt", { flags: 'a' });
        message = `${this.getDate()}| DEBUG | ${message} \n`;
        this.debugStream.write(message);
    }

    error(message) {
        this.errorStream = fs.createWriteStream("logs/error.txt", { flags: 'a' });
        message = `${this.getDate()} | ERROR | ${message} \n`;
        this.errorStream.write(message);
    }
}

const logger = new Logger();

module.exports = logger;