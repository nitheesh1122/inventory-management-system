const express = require("express");
const router = express.Router();
const Sales = require("../models/Sales");
const Inventory = require("../models/Inventory");
const { protect } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validator");
const { asyncHandler, createError } = require("../middleware/errorHandler");
const { checkLowStock } = require("../utils/notifications");

// Note: Billing routes for backward compatibility
// New code should use /api/sales routes

// @route   GET /api/billing
// @desc    Get all sales (backward compatibility)
// @access  Private
router.get("/", protect, asyncHandler(async (req, res) => {
    const sales = await Sales.find().sort({ date: -1 }).populate("productId").limit(100);
    res.json({
        status: "success",
        sales
    });
}));

// @route   POST /api/billing
// @desc    Add a new sale (backward compatibility - with stock validation)
// @access  Private
router.post("/", protect, validate(schemas.createSale), asyncHandler(async (req, res) => {
    const { productName, productId, category, quantity, price, customerName, customerPhone, paymentMethod } = req.body;
    
    // Find product in inventory
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

// @route   GET /api/billing/:id
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

// @route   DELETE /api/billing/:id
// @desc    Delete sale (and restore stock)
// @access  Private
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
