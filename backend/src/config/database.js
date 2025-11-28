/**
 * Database Configuration
 * Handles MongoDB connection with proper error handling and reconnection logic
 */

const mongoose = require("mongoose");
const logger = require("../utils/logger");

/**
 * Connect to MongoDB database
 * @returns {Promise<mongoose.Connection>} Database connection
 */
const connectDB = async () => {
    try {
        // Validate environment variables
        if (!process.env.MONGO_URI) {
            logger.error("MONGO_URI is not defined in environment variables");
            process.exit(1);
        }

        let mongoUri = process.env.MONGO_URI.trim();
        
        // Check for duplicate prefix (common .env mistake)
        if (mongoUri.startsWith("MONGO_URI=")) {
            logger.error("MONGO_URI contains duplicate prefix. Check your .env file.");
            process.exit(1);
        }
        
        // Validate connection string format
        if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
            logger.error("Invalid MongoDB connection string format");
            process.exit(1);
        }
        
        // Check for password placeholder
        if (mongoUri.includes("<db_password>")) {
            logger.error("Please replace <db_password> with your actual MongoDB Atlas password");
            process.exit(1);
        }

        // Connect to MongoDB
        // Note: useNewUrlParser and useUnifiedTopology are deprecated in Mongoose 6+
        // They are automatically enabled and can be safely removed
        const conn = await mongoose.connect(mongoUri);

        logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on("error", (err) => {
            logger.error(`MongoDB Connection Error: ${err.message}`);
        });

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected. Reconnecting...");
        });

        // Graceful shutdown
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            logger.info("MongoDB connection closed due to app termination");
            process.exit(0);
        });

        return conn;
    } catch (error) {
        logger.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;

