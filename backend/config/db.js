const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Check if MONGO_URI is defined
        if (!process.env.MONGO_URI) {
            console.error("❌ MongoDB Connection Error: MONGO_URI is not defined in environment variables");
            console.error("Please create a .env file in the backend directory with MONGO_URI set");
            process.exit(1);
        }

        // Validate connection string format
        let mongoUri = process.env.MONGO_URI.trim();
        
        // Check if MONGO_URI has duplicate prefix (common mistake in .env file)
        if (mongoUri.startsWith("MONGO_URI=")) {
            console.error("❌ MongoDB Connection Error: MONGO_URI contains duplicate prefix");
            console.error("Your .env file has: MONGO_URI=MONGO_URI=...");
            console.error("It should be: MONGO_URI=mongodb+srv://...");
            console.error("Please fix your .env file - remove the duplicate 'MONGO_URI=' prefix");
            process.exit(1);
        }
        
        if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
            console.error("❌ MongoDB Connection Error: Invalid connection string format");
            console.error("Connection string must start with 'mongodb://' or 'mongodb+srv://'");
            console.error("Current MONGO_URI value:", mongoUri ? `${mongoUri.substring(0, 50)}...` : "undefined");
            console.error("\nPlease check your .env file. The MONGO_URI line should be:");
            console.error("MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority");
            process.exit(1);
        }

        // Check if password placeholder is still in the connection string
        if (mongoUri.includes("<db_password>")) {
            console.error("❌ MongoDB Connection Error: Please replace <db_password> with your actual MongoDB Atlas password");
            console.error("In your .env file, update MONGO_URI with your actual password");
            process.exit(1);
        }

        const conn = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on("error", (err) => {
            console.error(`❌ MongoDB Connection Error: ${err.message}`);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("⚠️ MongoDB disconnected. Reconnecting...");
        });

        // Graceful shutdown
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("MongoDB connection closed due to app termination");
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
