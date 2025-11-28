/**
 * Reset Passwords Script
 * Resets admin and staff passwords to default values
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const User = require("../src/models/User");
const connectDB = require("../src/config/database");

const resetPasswords = async () => {
    try {
        // Connect to database
        await connectDB();
        console.log("📦 Connected to database\n");

        // Reset admin password
        const admin = await User.findOne({ email: "admin@inventory.com" });
        if (admin) {
            // Mark password as modified so pre-save hook will hash it
            admin.password = "admin123";
            admin.markModified("password");
            await admin.save();
            console.log("✅ Admin password reset successfully!");
            console.log("   Email: admin@inventory.com");
            console.log("   Password: admin123\n");
        } else {
            // Create admin if it doesn't exist
            await User.create({
                name: "Admin",
                email: "admin@inventory.com",
                password: "admin123",
                role: "admin",
                isActive: true
            });
            console.log("✅ Admin user created!");
            console.log("   Email: admin@inventory.com");
            console.log("   Password: admin123\n");
        }

        // Reset staff password
        const staff = await User.findOne({ email: "staff@inventory.com" });
        if (staff) {
            // Mark password as modified so pre-save hook will hash it
            staff.password = "staff123";
            staff.markModified("password");
            await staff.save();
            console.log("✅ Staff password reset successfully!");
            console.log("   Email: staff@inventory.com");
            console.log("   Password: staff123\n");
        } else {
            // Create staff if it doesn't exist
            await User.create({
                name: "Staff User",
                email: "staff@inventory.com",
                password: "staff123",
                role: "staff",
                isActive: true
            });
            console.log("✅ Staff user created!");
            console.log("   Email: staff@inventory.com");
            console.log("   Password: staff123\n");
        }

        console.log("🎉 All passwords have been reset!");
        console.log("\n📋 Login Credentials:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("ADMIN:");
        console.log("  Email:    admin@inventory.com");
        console.log("  Password: admin123");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("STAFF:");
        console.log("  Email:    staff@inventory.com");
        console.log("  Password: staff123");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error resetting passwords:", error.message);
        console.error(error);
        process.exit(1);
    }
};

// Run the script
resetPasswords();

