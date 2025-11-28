/**
 * Error Utilities
 * Custom error classes and error handling utilities
 */

/**
 * Custom Application Error Class
 */
class AppError extends Error {
    /**
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Create an application error
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {AppError}
 */
const createError = (message, statusCode = 500) => {
    return new AppError(message, statusCode);
};

/**
 * Async handler wrapper
 * Automatically catches async errors and passes to error middleware
 * @param {Function} fn - Async function
 * @returns {Function} Wrapped function
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * 404 Not Found handler
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Express next
 */
const notFound = (req, res, next) => {
    const error = new AppError(`Not found - ${req.originalUrl}`, 404);
    next(error);
};

module.exports = {
    AppError,
    createError,
    asyncHandler,
    notFound,
};

