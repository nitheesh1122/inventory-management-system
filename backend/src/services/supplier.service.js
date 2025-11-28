/**
 * Supplier Service
 * Handles all supplier-related business logic
 */

const Supplier = require("../models/Supplier");
const { createError } = require("../utils/errors");

/**
 * Get all suppliers
 * @returns {Promise<Array>} Suppliers
 */
const getAllSuppliers = async () => {
    const suppliers = await Supplier.find()
        .populate("products")
        .sort({ name: 1 });
    return suppliers;
};

/**
 * Get supplier by ID
 * @param {string} supplierId - Supplier ID
 * @returns {Promise<Object>} Supplier
 */
const getSupplierById = async (supplierId) => {
    const supplier = await Supplier.findById(supplierId).populate("products");
    if (!supplier) {
        throw createError("Supplier not found", 404);
    }
    return supplier;
};

/**
 * Create new supplier
 * @param {Object} supplierData - Supplier data
 * @returns {Promise<Object>} Created supplier
 */
const createSupplier = async (supplierData) => {
    const supplier = await Supplier.create(supplierData);
    return supplier;
};

/**
 * Update supplier
 * @param {string} supplierId - Supplier ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated supplier
 */
const updateSupplier = async (supplierId, updateData) => {
    const supplier = await Supplier.findByIdAndUpdate(
        supplierId,
        updateData,
        { new: true, runValidators: true }
    );
    if (!supplier) {
        throw createError("Supplier not found", 404);
    }
    return supplier;
};

/**
 * Delete supplier
 * @param {string} supplierId - Supplier ID
 * @returns {Promise<void>}
 */
const deleteSupplier = async (supplierId) => {
    const supplier = await Supplier.findByIdAndDelete(supplierId);
    if (!supplier) {
        throw createError("Supplier not found", 404);
    }
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};

