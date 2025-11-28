const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
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
        trim: true
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier"
    },
    reorderLevel: {
        type: Number,
        default: 10,
        min: [0, "Reorder level cannot be negative"]
    },
    description: {
        type: String,
        trim: true
    },
    barcode: {
        type: String,
        trim: true,
        sparse: true // Allows null values but ensures uniqueness if provided
    },
    unit: {
        type: String,
        default: "piece"
    },
    status: {
        type: String,
        enum: ["active", "discontinued", "out_of_stock"],
        default: "active"
    }
}, {
    timestamps: true
});

// Index for faster queries
inventorySchema.index({ name: 1 });
inventorySchema.index({ category: 1 });
inventorySchema.index({ quantity: 1 });
inventorySchema.index({ supplierId: 1 });
inventorySchema.index({ status: 1 });

// Virtual for low stock status
inventorySchema.virtual("isLowStock").get(function() {
    return this.quantity <= this.reorderLevel;
});

// Method to check if stock is sufficient
inventorySchema.methods.hasSufficientStock = function(requiredQuantity) {
    return this.quantity >= requiredQuantity;
};

module.exports = mongoose.model("Inventory", inventorySchema);
