import { CustomError } from '../CustomError.js';
import logger from '../logger.js';
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(statusCode).send(message);
};
export default errorHandler;
