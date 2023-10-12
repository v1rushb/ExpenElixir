import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;
const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});
const logger = createLogger({
    level: 'info',
    format: combine(timestamp(), customFormat),
    transports: [
        new transports.File({ filename: 'errors.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    ]
});
export default logger;
