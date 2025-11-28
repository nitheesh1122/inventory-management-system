/**
 * Sale Service
 * Handles all sales-related business logic
 */

const Sale = require("../models/Sale");
const Product = require("../models/Product");
const { createError } = require("../utils/errors");
const { SALE_STATUS, PAYMENT_METHODS } = require("../config/constants");
const notificationService = require("./notification.service");

/**
 * Get all sales with filters
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} Sales and pagination info
 */
const getAllSales = async (filters = {}) => {
    const {
        startDate,
        endDate,
        category,
        status,
        limit = 100,
        page = 1
    } = filters;

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

    // Status filter
    if (status) {
        query.orderStatus = status;
    }

    const skip = (page - 1) * limit;
    const sales = await Sale.find(query)
        .populate("productId")
        .sort({ date: -1 })
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Sale.countDocuments(query);

    return {
        sales,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            limit: parseInt(limit)
        }
    };
};

/**
 * Get sale by ID
 * @param {string} saleId - Sale ID
 * @returns {Promise<Object>} Sale
 */
const getSaleById = async (saleId) => {
    const sale = await Sale.findById(saleId).populate("productId");
    if (!sale) {
        throw createError("Sale not found", 404);
    }
    return sale;
};

/**
 * Create new sale
 * @param {Object} saleData - Sale data
 * @returns {Promise<Object>} Created sale
 */
const createSale = async (saleData) => {
    const {
        productName,
        productId,
        category,
        quantity,
        price,
        customerName,
        customerPhone,
        paymentMethod
    } = saleData;

    // Find product
    let product;
    if (productId) {
        product = await Product.findById(productId);
    } else {
        product = await Product.findOne({ name: productName });
    }

    if (!product) {
        throw createError("Product not found in inventory", 404);
    }

    // Check stock availability
    if (!product.hasSufficientStock(quantity)) {
        throw createError(
            `Insufficient stock! Available: ${product.quantity}`,
            400
        );
    }

    // Calculate total
    const totalAmount = quantity * price;

    // Create sale record
    const sale = await Sale.create({
        productName: product.name,
        productId: product._id,
        category: category || product.category,
        quantity,
        price,
        totalAmount,
        customerName: customerName || "Walk-in Customer",
        customerPhone,
        paymentMethod: paymentMethod || PAYMENT_METHODS.CASH,
        orderStatus: SALE_STATUS.COMPLETED
    });

    // Update product stock
    product.updateStock(-quantity);
    await product.save();

    // Check for low stock
    await notificationService.checkLowStock(product);

    return sale;
};

/**
 * Delete sale and restore stock
 * @param {string} saleId - Sale ID
 * @returns {Promise<void>}
 */
const deleteSale = async (saleId) => {
    const sale = await Sale.findById(saleId);
    if (!sale) {
        throw createError("Sale not found", 404);
    }

    // Restore stock if product exists
    if (sale.productId) {
        const product = await Product.findById(sale.productId);
        if (product) {
            product.updateStock(sale.quantity);
            await product.save();
        }
    }

    // Delete sale
    await Sale.findByIdAndDelete(saleId);
};

module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    deleteSale
};

