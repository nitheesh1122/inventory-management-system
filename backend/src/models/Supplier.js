/**
 * Supplier Model
 * Handles supplier information and management
 */

const mongoose = require("mongoose");
const { SUPPLIER_STATUS } = require("../config/constants");

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Supplier name is required"],
        trim: true,
        maxlength: [200, "Supplier name cannot exceed 200 characters"]
    },
    contactPerson: {
        type: String,
        trim: true,
        maxlength: [100, "Contact person name cannot exceed 100 characters"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        maxlength: [200, "Email cannot exceed 200 characters"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        maxlength: [20, "Phone number cannot exceed 20 characters"]
    },
    address: {
        street: {
            type: String,
            trim: true,
            maxlength: [200, "Street address cannot exceed 200 characters"]
        },
        city: {
            type: String,
            trim: true,
            maxlength: [100, "City cannot exceed 100 characters"]
        },
        state: {
            type: String,
            trim: true,
            maxlength: [100, "State cannot exceed 100 characters"]
        },
        zipCode: {
            type: String,
            trim: true,
            maxlength: [20, "Zip code cannot exceed 20 characters"]
        },
        country: {
            type: String,
            trim: true,
            maxlength: [100, "Country cannot exceed 100 characters"],
            default: "India"
        }
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    paymentTerms: {
        type: String,
        default: "Net 30",
        maxlength: [100, "Payment terms cannot exceed 100 characters"]
    },
    status: {
        type: String,
        enum: Object.values(SUPPLIER_STATUS),
        default: SUPPLIER_STATUS.ACTIVE
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, "Notes cannot exceed 1000 characters"]
    }
}, {
    timestamps: true
});

// Indexes for faster queries
supplierSchema.index({ name: 1 });
supplierSchema.index({ email: 1 });
supplierSchema.index({ status: 1 });
supplierSchema.index({ phone: 1 });

// Compound index
supplierSchema.index({ status: 1, name: 1 });

module.exports = mongoose.model("Supplier", supplierSchema);

