/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

const logger = require("../utils/logger");
const { AppError } = require("../utils/errors");

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    // Log error
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    if (process.env.NODE_ENV === "development") {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Production error response
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            // Programming or unknown error
            logger.error(`ERROR: ${err}`);
            res.status(500).json({
                status: "error",
                message: "Something went wrong"
            });
        }
    }
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res, next) => {
    const error = new AppError(`Not found - ${req.originalUrl}`, 404);
    next(error);
};

module.exports = {
    errorHandler,
    notFound
};

