const express = require("express");
const router = express.Router();
const Supplier = require("../models/Supplier");
const { protect, authorize } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validator");
const { asyncHandler, createError } = require("../middleware/errorHandler");

// @route   GET /api/suppliers
// @desc    Get all suppliers
// @access  Private
router.get("/", protect, asyncHandler(async (req, res) => {
    const suppliers = await Supplier.find().populate("products");
    res.json({
        status: "success",
        count: suppliers.length,
        suppliers
    });
}));

// @route   GET /api/suppliers/:id
// @desc    Get single supplier
// @access  Private
router.get("/:id", protect, asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id).populate("products");
    if (!supplier) {
        throw createError("Supplier not found", 404);
    }
    res.json({
        status: "success",
        supplier
    });
}));

// @route   POST /api/suppliers
// @desc    Create new supplier
// @access  Private/Admin
router.post("/", protect, authorize("admin"), validate(schemas.createSupplier), asyncHandler(async (req, res) => {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({
        status: "success",
        supplier
    });
}));

// @route   PUT /api/suppliers/:id
// @desc    Update supplier
// @access  Private/Admin
router.put("/:id", protect, authorize("admin"), validate(schemas.updateSupplier), asyncHandler(async (req, res) => {
    const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!supplier) {
        throw createError("Supplier not found", 404);
    }
    res.json({
        status: "success",
        supplier
    });
}));

// @route   DELETE /api/suppliers/:id
// @desc    Delete supplier
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), asyncHandler(async (req, res) => {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
        throw createError("Supplier not found", 404);
    }
    res.json({
        status: "success",
        message: "Supplier deleted successfully"
    });
}));

module.exports = router;

