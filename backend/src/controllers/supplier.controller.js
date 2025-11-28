/**
 * Supplier Controller
 * Handles supplier-related HTTP requests
 */

const supplierService = require("../services/supplier.service");
const { asyncHandler } = require("../utils/errors");

/**
 * Get all suppliers
 * @route GET /api/suppliers
 * @access Private
 */
const getAllSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await supplierService.getAllSuppliers();
    res.json({
        status: "success",
        count: suppliers.length,
        suppliers
    });
});

/**
 * Get single supplier
 * @route GET /api/suppliers/:id
 * @access Private
 */
const getSupplierById = asyncHandler(async (req, res) => {
    const supplier = await supplierService.getSupplierById(req.params.id);
    res.json({
        status: "success",
        supplier
    });
});

/**
 * Create supplier
 * @route POST /api/suppliers
 * @access Private/Admin
 */
const createSupplier = asyncHandler(async (req, res) => {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json({
        status: "success",
        supplier
    });
});

/**
 * Update supplier
 * @route PUT /api/suppliers/:id
 * @access Private/Admin
 */
const updateSupplier = asyncHandler(async (req, res) => {
    const supplier = await supplierService.updateSupplier(req.params.id, req.body);
    res.json({
        status: "success",
        supplier
    });
});

/**
 * Delete supplier
 * @route DELETE /api/suppliers/:id
 * @access Private/Admin
 */
const deleteSupplier = asyncHandler(async (req, res) => {
    await supplierService.deleteSupplier(req.params.id);
    res.json({
        status: "success",
        message: "Supplier deleted successfully"
    });
});

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};

