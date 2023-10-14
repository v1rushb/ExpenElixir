import { CustomError } from '../CustomError.js';
import logger from '../logger.js';
const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(err.statusCode).send(err.message);
    }
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(500).send(`Internal Server Error`);
};
export default errorHandler;
//# sourceMappingURL=ErrorHandler.js.map