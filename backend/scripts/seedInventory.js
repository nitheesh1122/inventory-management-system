require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

// Verify environment variables are loaded
if (!process.env.MONGO_URI) {
    console.error("❌ Error: MONGO_URI not found in environment variables");
    console.error("Please create a .env file in the backend directory");
    process.exit(1);
}

const mongoose = require("mongoose");
const Inventory = require("../models/Inventory");
const Supplier = require("../models/Supplier");
const connectDB = require("../config/db");

// Sample inventory data
const sampleProducts = [
    {
        name: "Wireless Mouse",
        category: "Electronics",
        quantity: 45,
        price: 899,
        supplier: "Tech Supplies Co.",
        description: "Ergonomic wireless mouse with 2.4GHz connectivity",
        unit: "piece",
        reorderLevel: 10,
        status: "active"
    },
    {
        name: "USB Keyboard",
        category: "Electronics",
        quantity: 32,
        price: 1299,
        supplier: "Tech Supplies Co.",
        description: "Mechanical USB keyboard with RGB backlight",
        unit: "piece",
        reorderLevel: 10,
        status: "active"
    },
    {
        name: "HDMI Cable",
        category: "Accessories",
        quantity: 78,
        price: 499,
        supplier: "Cable Connections Ltd.",
        description: "High-speed HDMI 2.0 cable, 2 meters",
        unit: "piece",
        reorderLevel: 20,
        status: "active"
    },
    {
        name: "Laptop Stand",
        category: "Accessories",
        quantity: 15,
        price: 1499,
        supplier: "Office Solutions Inc.",
        description: "Adjustable aluminum laptop stand",
        unit: "piece",
        reorderLevel: 5,
        status: "active"
    },
    {
        name: "Webcam HD 1080p",
        category: "Electronics",
        quantity: 28,
        price: 2499,
        supplier: "Tech Supplies Co.",
        description: "Full HD 1080p webcam with microphone",
        unit: "piece",
        reorderLevel: 10,
        status: "active"
    },
    {
        name: "USB Hub",
        category: "Accessories",
        quantity: 6,
        price: 799,
        supplier: "Cable Connections Ltd.",
        description: "7-port USB 3.0 hub with power adapter",
        unit: "piece",
        reorderLevel: 5,
        status: "active"
    },
    {
        name: "Laptop Charger",
        category: "Accessories",
        quantity: 8,
        price: 1599,
        supplier: "Power Solutions",
        description: "Universal laptop charger 65W with multiple tips",
        unit: "piece",
        reorderLevel: 5,
        status: "active"
    },
    {
        name: "Wireless Headphones",
        category: "Electronics",
        quantity: 22,
        price: 3999,
        supplier: "Audio Devices Co.",
        description: "Bluetooth 5.0 headphones with noise cancellation",
        unit: "piece",
        reorderLevel: 10,
        status: "active"
    },
    {
        name: "Monitor 27 inch",
        category: "Electronics",
        quantity: 12,
        price: 19999,
        supplier: "Display Tech Ltd.",
        description: "27-inch 4K UHD monitor with HDR",
        unit: "piece",
        reorderLevel: 3,
        status: "active"
    },
    {
        name: "USB-C Cable",
        category: "Accessories",
        quantity: 55,
        price: 399,
        supplier: "Cable Connections Ltd.",
        description: "USB-C to USB-C cable, 1 meter",
        unit: "piece",
        reorderLevel: 15,
        status: "active"
    },
    {
        name: "External Hard Drive 1TB",
        category: "Electronics",
        quantity: 18,
        price: 4499,
        supplier: "Storage Solutions",
        description: "Portable 1TB external hard drive USB 3.0",
        unit: "piece",
        reorderLevel: 5,
        status: "active"
    },
    {
        name: "Mouse Pad",
        category: "Accessories",
        quantity: 42,
        price: 199,
        supplier: "Office Solutions Inc.",
        description: "Large gaming mouse pad with non-slip base",
        unit: "piece",
        reorderLevel: 10,
        status: "active"
    },
    {
        name: "Laptop Sleeve",
        category: "Accessories",
        quantity: 24,
        price: 899,
        supplier: "Office Solutions Inc.",
        description: "Padded laptop sleeve for 15-inch laptops",
        unit: "piece",
        reorderLevel: 10,
        status: "active"
    },
    {
        name: "USB Flash Drive 32GB",
        category: "Electronics",
        quantity: 67,
        price: 499,
        supplier: "Storage Solutions",
        description: "32GB USB 3.0 flash drive",
        unit: "piece",
        reorderLevel: 20,
        status: "active"
    },
    {
        name: "Keyboard Wrist Rest",
        category: "Accessories",
        quantity: 3,
        price: 599,
        supplier: "Office Solutions Inc.",
        description: "Ergonomic gel keyboard wrist rest",
        unit: "piece",
        reorderLevel: 5,
        status: "active"
    }
];

// Create or get suppliers
const createSuppliers = async () => {
    const suppliersMap = {};
    
    const supplierNames = [
        "Tech Supplies Co.",
        "Cable Connections Ltd.",
        "Office Solutions Inc.",
        "Power Solutions",
        "Audio Devices Co.",
        "Display Tech Ltd.",
        "Storage Solutions"
    ];

    for (const supplierName of supplierNames) {
        let supplier = await Supplier.findOne({ name: supplierName });
        
        if (!supplier) {
            supplier = await Supplier.create({
                name: supplierName,
                contactPerson: `${supplierName.split(' ')[0]} Manager`,
                email: `${supplierName.toLowerCase().replace(/\s+/g, '')}@example.com`,
                phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                address: {
                    city: "Mumbai",
                    state: "Maharashtra",
                    country: "India"
                },
                paymentTerms: "Net 30",
                status: "active"
            });
            console.log(`✅ Created supplier: ${supplierName}`);
        } else {
            console.log(`ℹ️  Supplier already exists: ${supplierName}`);
        }
        
        suppliersMap[supplierName] = supplier._id;
    }
    
    return suppliersMap;
};

// Seed inventory
const seedInventory = async () => {
    try {
        // Connect to database
        console.log("🔄 Connecting to database...");
        await connectDB();

        // Create suppliers first
        console.log("\n🔄 Creating suppliers...");
        const suppliersMap = await createSuppliers();

        // Check if products already exist
        const existingProducts = await Inventory.find();
        if (existingProducts.length > 0) {
            console.log(`\n⚠️  Found ${existingProducts.length} existing products in inventory`);
            console.log("Do you want to:");
            console.log("1. Add products anyway (may create duplicates)");
            console.log("2. Skip products that already exist");
            console.log("3. Delete all existing products and start fresh");
            console.log("\nFor now, skipping products that already exist...");
        }

        console.log("\n🔄 Adding products to inventory...");
        let created = 0;
        let skipped = 0;

        for (const productData of sampleProducts) {
            // Check if product already exists
            const existing = await Inventory.findOne({ name: productData.name });
            
            if (existing) {
                console.log(`⏭️  Skipped: ${productData.name} (already exists)`);
                skipped++;
                continue;
            }

            // Link supplier if exists
            if (productData.supplier && suppliersMap[productData.supplier]) {
                productData.supplierId = suppliersMap[productData.supplier];
            }

            // Create product
            const product = await Inventory.create(productData);
            console.log(`✅ Created: ${product.name} - Qty: ${product.quantity}, Price: ₹${product.price}`);
            created++;
        }

        console.log("\n" + "=".repeat(50));
        console.log("📊 Summary:");
        console.log(`✅ Created: ${created} products`);
        console.log(`⏭️  Skipped: ${skipped} products (already exist)`);
        console.log(`📦 Total products in inventory: ${await Inventory.countDocuments()}`);
        
        // Show low stock items
        const lowStockItems = await Inventory.find({
            $or: [
                { quantity: { $lte: 10 } },
                { $expr: { $lte: ["$quantity", "$reorderLevel"] } }
            ]
        });
        
        if (lowStockItems.length > 0) {
            console.log(`\n⚠️  Low Stock Items: ${lowStockItems.length}`);
            lowStockItems.forEach(item => {
                console.log(`   - ${item.name}: ${item.quantity} (reorder at ${item.reorderLevel})`);
            });
        }

        console.log("\n✅ Inventory seeding completed!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding inventory:", error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

// Run the script
seedInventory();

