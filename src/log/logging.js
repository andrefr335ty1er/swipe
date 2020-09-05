const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(({level, message, timestamp }) => {
    message = message.replace("\n", "");
    return `${timestamp}  ${level} :: ${message}`;
});

var options = {
    file: {
        level: 'info',
        filename: `./application.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: true,
    },
    console: {
        level: 'info',
        handleExceptions: true,
        json: true,
        colorize: true,
    },
};

const logger = createLogger({
    transports: [
        new transports.Console(options.console),
        new transports.File(options.file)
    ],
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat
    )
})

module.exports = logger;