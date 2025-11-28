/**
 * Product Model
 * Handles product/inventory management
 * Renamed from Inventory for better clarity
 */

const mongoose = require("mongoose");
const { PRODUCT_STATUS } = require("../config/constants");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        maxlength: [200, "Product name cannot exceed 200 characters"]
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
        min: [0, "Quantity cannot be negative"],
        default: 0
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    supplier: {
        type: String,
        trim: true,
        maxlength: [200, "Supplier name cannot exceed 200 characters"]
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        default: null
    },
    reorderLevel: {
        type: Number,
        default: 10,
        min: [0, "Reorder level cannot be negative"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    barcode: {
        type: String,
        trim: true,
        sparse: true, // Allows null values but ensures uniqueness if provided
        unique: true // unique: true automatically creates an index, so don't create a separate one
    },
    unit: {
        type: String,
        default: "piece",
        maxlength: [50, "Unit cannot exceed 50 characters"]
    },
    status: {
        type: String,
        enum: Object.values(PRODUCT_STATUS),
        default: PRODUCT_STATUS.ACTIVE
    }
}, {
    timestamps: true
});

// Indexes for faster queries
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ quantity: 1 });
productSchema.index({ supplierId: 1 });
productSchema.index({ status: 1 });
// Note: barcode index is automatically created by unique: true, so no need for separate index

// Compound index for common queries
productSchema.index({ category: 1, status: 1 });
productSchema.index({ status: 1, quantity: 1 }); // For low stock queries

// Virtual for low stock status
productSchema.virtual("isLowStock").get(function() {
    const threshold = process.env.LOW_STOCK_THRESHOLD || 10;
    return this.quantity <= this.reorderLevel || this.quantity <= threshold;
});

// Instance method to check if stock is sufficient
productSchema.methods.hasSufficientStock = function(requiredQuantity) {
    return this.quantity >= requiredQuantity && this.status === PRODUCT_STATUS.ACTIVE;
};

// Instance method to update stock
productSchema.methods.updateStock = function(quantityChange) {
    this.quantity += quantityChange;
    if (this.quantity < 0) {
        this.quantity = 0;
    }
    
    // Update status based on quantity
    if (this.quantity === 0 && this.status !== PRODUCT_STATUS.DISCONTINUED) {
        this.status = PRODUCT_STATUS.OUT_OF_STOCK;
    } else if (this.quantity > 0 && this.status === PRODUCT_STATUS.OUT_OF_STOCK) {
        this.status = PRODUCT_STATUS.ACTIVE;
    }
    
    return this;
};

// Ensure virtual fields are included in JSON
productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);

