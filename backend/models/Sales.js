const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
        required: false
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    totalAmount: {
        type: Number,
        required: true,
        min: [0, "Total amount cannot be negative"]
    },
    customerName: {
        type: String,
        trim: true,
        default: "Walk-in Customer"
    },
    customerPhone: {
        type: String,
        trim: true
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "online"],
        default: "cash"
    },
    orderStatus: {
        type: String,
        enum: ["completed", "pending", "cancelled"],
        default: "completed"
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
salesSchema.index({ date: -1 });
salesSchema.index({ productId: 1 });
salesSchema.index({ customerName: 1 });

module.exports = mongoose.model("Sales", salesSchema);
