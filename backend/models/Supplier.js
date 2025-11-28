const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Supplier name is required"],
        trim: true
    },
    contactPerson: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory"
    }],
    paymentTerms: {
        type: String,
        default: "Net 30"
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Index for faster queries
supplierSchema.index({ name: 1 });
supplierSchema.index({ email: 1 });
supplierSchema.index({ status: 1 });

module.exports = mongoose.model("Supplier", supplierSchema);

