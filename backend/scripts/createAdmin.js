require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

// Verify environment variables are loaded
if (!process.env.MONGO_URI) {
    console.error("❌ Error: MONGO_URI not found in environment variables");
    console.error("Please create a .env file in the backend directory");
    console.error("Example .env file content:");
    console.error("MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory?retryWrites=true&w=majority");
    process.exit(1);
}

const mongoose = require("mongoose");
const User = require("../src/models/User");
const connectDB = require("../src/config/database");

// Create default admin user
const createAdmin = async () => {
    try {
        // Connect to database
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "admin@inventory.com" });
        if (existingAdmin) {
            console.log("❌ Admin user already exists");
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: "Admin",
            email: "admin@inventory.com",
            password: "admin123", // Change this in production!
            role: "admin",
            isActive: true
        });

        console.log("✅ Admin user created successfully!");
        console.log("Email: admin@inventory.com");
        console.log("Password: admin123");
        console.log("⚠️  Please change the password after first login!");

        // Create a staff user
        const staff = await User.create({
            name: "Staff User",
            email: "staff@inventory.com",
            password: "staff123", // Change this in production!
            role: "staff",
            isActive: true
        });

        console.log("\n✅ Staff user created successfully!");
        console.log("Email: staff@inventory.com");
        console.log("Password: staff123");
        console.log("⚠️  Please change the password after first login!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin user:", error.message);
        process.exit(1);
    }
};

// Run the script
createAdmin();

