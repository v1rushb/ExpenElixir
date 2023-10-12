import express from 'express';
import { CustomError } from '../CustomError.js';
import logger from '../logger.js';

const errorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(statusCode).send(message);
}

export default errorHandler;