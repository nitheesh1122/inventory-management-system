const express = require("express");
const router = express.Router();
const Sales = require("../models/Sales");
const Inventory = require("../models/Inventory");
const { protect } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validator");
const { asyncHandler, createError } = require("../middleware/errorHandler");
const { checkLowStock } = require("../utils/notifications");

// @route   GET /api/sales
// @desc    Get all sales
// @access  Private
router.get("/", protect, asyncHandler(async (req, res) => {
    const { startDate, endDate, category, limit = 100, page = 1 } = req.query;
    
    let query = {};
    
    // Date range filter
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Category filter
    if (category) {
        query.category = category;
    }
    
    const skip = (page - 1) * limit;
    const sales = await Sales.find(query)
        .sort({ date: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .populate("productId");
    
    const total = await Sales.countDocuments(query);
    
    res.json({
        status: "success",
        count: sales.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        sales
    });
}));

// @route   GET /api/sales/:id
// @desc    Get single sale
// @access  Private
router.get("/:id", protect, asyncHandler(async (req, res) => {
    const sale = await Sales.findById(req.params.id).populate("productId");
    if (!sale) {
        throw createError("Sale not found", 404);
    }
    res.json({
        status: "success",
        sale
    });
}));

// @route   POST /api/sales
// @desc    Create new sale (with stock validation and reduction)
// @access  Private
router.post("/", protect, validate(schemas.createSale), asyncHandler(async (req, res) => {
    const { productName, productId, category, quantity, price, customerName, customerPhone, paymentMethod } = req.body;
    
    // Find product in inventory by name or ID
    let inventoryItem;
    if (productId) {
        inventoryItem = await Inventory.findById(productId);
    } else {
        inventoryItem = await Inventory.findOne({ name: productName });
    }
    
    if (!inventoryItem) {
        throw createError("Product not found in inventory", 404);
    }
    
    // Check if stock is sufficient
    if (!inventoryItem.hasSufficientStock(quantity)) {
        throw createError(`Insufficient stock! Available: ${inventoryItem.quantity}`, 400);
    }
    
    // Reduce stock
    inventoryItem.quantity -= quantity;
    
    // Update status if out of stock
    if (inventoryItem.quantity === 0) {
        inventoryItem.status = "out_of_stock";
    }
    
    await inventoryItem.save();
    
    // Calculate total
    const totalAmount = quantity * price;
    
    // Create sale record
    const newSale = await Sales.create({
        productName: inventoryItem.name,
        productId: inventoryItem._id,
        category: category || inventoryItem.category,
        quantity,
        price,
        totalAmount,
        customerName: customerName || "Walk-in Customer",
        customerPhone,
        paymentMethod: paymentMethod || "cash",
        orderStatus: "completed"
    });
    
    // Check for low stock after sale
    await checkLowStock(inventoryItem);
    
    res.status(201).json({
        status: "success",
        message: "Sale recorded successfully",
        sale: newSale
    });
}));

// @route   DELETE /api/sales/:id
// @desc    Delete sale (and restore stock)
// @access  Private/Admin
router.delete("/:id", protect, asyncHandler(async (req, res) => {
    const sale = await Sales.findById(req.params.id);
    if (!sale) {
        throw createError("Sale not found", 404);
    }
    
    // Restore stock if product exists
    if (sale.productId) {
        const inventoryItem = await Inventory.findById(sale.productId);
        if (inventoryItem) {
            inventoryItem.quantity += sale.quantity;
            if (inventoryItem.status === "out_of_stock" && inventoryItem.quantity > 0) {
                inventoryItem.status = "active";
            }
            await inventoryItem.save();
        }
    }
    
    await Sales.findByIdAndDelete(req.params.id);
    
    res.json({
        status: "success",
        message: "Sale deleted and stock restored successfully"
    });
}));

module.exports = router;

