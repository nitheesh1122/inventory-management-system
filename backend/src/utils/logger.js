/**
 * Logger Utility
 * Winston-based logging system
 */

const winston = require("winston");
const path = require("path");
const fs = require("fs");

// Ensure logs directory exists
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: logFormat,
    transports: [
        // Console transport with colors
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Error log file
        new winston.transports.File({
            filename: path.join(logsDir, "error.log"),
            level: "error"
        }),
        // Combined log file
        new winston.transports.File({
            filename: path.join(logsDir, "combined.log")
        })
    ]
});

/**
 * Request logging middleware
 * Logs HTTP requests with timing information
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on("finish", () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip
        });
    });
    
    next();
};

module.exports = logger;
module.exports.requestLogger = requestLogger;

