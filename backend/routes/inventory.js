const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const { protect, authorize } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validator");
const { asyncHandler, createError } = require("../middleware/errorHandler");
const { checkLowStock } = require("../utils/notifications");

// @route   GET /api/inventory
// @desc    Get all inventory items
// @access  Private
router.get("/", protect, asyncHandler(async (req, res) => {
    const { category, status, search, lowStock, limit = 1000, page = 1 } = req.query;
    
    let query = {};
    
    // Category filter
    if (category) {
        query.category = category;
    }
    
    // Status filter
    if (status) {
        query.status = status;
    }
    
    // Search filter
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ];
    }
    
    // Low stock filter
    if (lowStock === "true") {
        const threshold = process.env.LOW_STOCK_THRESHOLD || 10;
        query.$or = [
            { quantity: { $lte: threshold } },
            { $expr: { $lte: ["$quantity", "$reorderLevel"] } }
        ];
    }
    
    const skip = (page - 1) * limit;
    const inventoryItems = await Inventory.find(query)
        .populate("supplierId")
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);
    
    const total = await Inventory.countDocuments(query);
    
    res.json({
        status: "success",
        count: inventoryItems.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        inventory: inventoryItems
    });
}));

// @route   GET /api/inventory/:id
// @desc    Get single inventory item
// @access  Private
router.get("/:id", protect, asyncHandler(async (req, res) => {
    const item = await Inventory.findById(req.params.id).populate("supplierId");
    if (!item) {
        throw createError("Inventory item not found", 404);
    }
    res.json({
        status: "success",
        item
    });
}));

// @route   POST /api/inventory
// @desc    Add a new inventory item
// @access  Private/Admin
router.post("/", protect, authorize("admin"), validate(schemas.createInventory), asyncHandler(async (req, res) => {
    const newItem = await Inventory.create(req.body);
    
    // Check for low stock
    await checkLowStock(newItem);
    
    res.status(201).json({
        status: "success",
        item: newItem
    });
}));

// @route   PUT /api/inventory/:id
// @desc    Update inventory item
// @access  Private
router.put("/:id", protect, validate(schemas.updateInventory), asyncHandler(async (req, res) => {
    const item = await Inventory.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate("supplierId");
    
    if (!item) {
        throw createError("Inventory item not found", 404);
    }
    
    // Check for low stock after update
    await checkLowStock(item);
    
    res.json({
        status: "success",
        item
    });
}));

// @route   DELETE /api/inventory/:id
// @desc    Delete inventory item
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), asyncHandler(async (req, res) => {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
        throw createError("Inventory item not found", 404);
    }
    res.json({
        status: "success",
        message: "Inventory item deleted successfully"
    });
}));

// @route   PUT /api/inventory/:id/stock
// @desc    Update stock quantity
// @access  Private
router.put("/:id/stock", protect, asyncHandler(async (req, res) => {
    const { quantityChange, reason } = req.body;
    
    if (typeof quantityChange !== "number") {
        throw createError("quantityChange must be a number", 400);
    }
    
    const item = await Inventory.findById(req.params.id);
    if (!item) {
        throw createError("Inventory item not found", 404);
    }
    
    // Ensure stock doesn't go negative
    if (item.quantity + quantityChange < 0) {
        throw createError(`Not enough stock available. Current stock: ${item.quantity}`, 400);
    }
    
    item.quantity += quantityChange;
    
    // Update status based on quantity
    if (item.quantity === 0) {
        item.status = "out_of_stock";
    } else if (item.status === "out_of_stock" && item.quantity > 0) {
        item.status = "active";
    }
    
    await item.save();
    
    // Check for low stock
    await checkLowStock(item);
    
    res.json({
        status: "success",
        message: "Stock updated successfully",
        item
    });
}));

// @route   GET /api/inventory/low-stock/check
// @desc    Check all items for low stock
// @access  Private
router.get("/low-stock/check", protect, asyncHandler(async (req, res) => {
    const { checkAllLowStock } = require("../utils/notifications");
    const lowStockItems = await checkAllLowStock();
    
    res.json({
        status: "success",
        count: lowStockItems.length,
        items: lowStockItems
    });
}));

module.exports = router;
