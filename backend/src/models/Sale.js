/**
 * Sale Model
 * Handles sales transactions
 * Renamed from Sales for better clarity (singular)
 */

const mongoose = require("mongoose");
const { SALE_STATUS, PAYMENT_METHODS } = require("../config/constants");

const saleSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        maxlength: [200, "Product name cannot exceed 200 characters"]
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: false
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
        maxlength: [100, "Category cannot exceed 100 characters"]
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
        default: "Walk-in Customer",
        maxlength: [200, "Customer name cannot exceed 200 characters"]
    },
    customerPhone: {
        type: String,
        trim: true,
        maxlength: [20, "Phone number cannot exceed 20 characters"]
    },
    paymentMethod: {
        type: String,
        enum: Object.values(PAYMENT_METHODS),
        default: PAYMENT_METHODS.CASH
    },
    orderStatus: {
        type: String,
        enum: Object.values(SALE_STATUS),
        default: SALE_STATUS.COMPLETED
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for faster queries
saleSchema.index({ date: -1 }); // Most recent first
saleSchema.index({ productId: 1 });
saleSchema.index({ customerName: 1 });
saleSchema.index({ orderStatus: 1 });
saleSchema.index({ category: 1 });
saleSchema.index({ paymentMethod: 1 });

// Compound indexes for analytics queries
saleSchema.index({ date: -1, orderStatus: 1 });
saleSchema.index({ category: 1, date: -1 });
saleSchema.index({ productId: 1, date: -1 });

// Virtual for sale number (for display)
saleSchema.virtual("saleNumber").get(function() {
    return `SALE-${this._id.toString().slice(-6).toUpperCase()}`;
});

// Ensure virtual fields are included in JSON
saleSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Sale", saleSchema);

