/**
 * Server Entry Point
 * Main application file
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// Import configuration
const connectDB = require("./config/database");
const requestLogger = require("./middleware/logger.middleware");
const { errorHandler, notFound } = require("./middleware/error.middleware");

// Import routes
const {
    authRoutes,
    productRoutes,
    saleRoutes,
    supplierRoutes,
    analyticsRoutes
} = require("./routes");

// Connect to database
connectDB();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

// Request logging
app.use(requestLogger);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", productRoutes); // Backward compatibility
app.use("/api/sales", saleRoutes);
app.use("/api/billing", saleRoutes); // Backward compatibility
app.use("/api/suppliers", supplierRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development"
    });
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Inventory Management System API",
        version: "2.0.0",
        status: "running"
    });
});

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5009;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

