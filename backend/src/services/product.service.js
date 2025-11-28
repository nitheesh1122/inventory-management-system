/**
 * Product Service
 * Handles all product-related business logic
 */

const Product = require("../models/Product");
const { createError } = require("../utils/errors");
const { PRODUCT_STATUS } = require("../config/constants");
const notificationService = require("./notification.service");

/**
 * Get all products with filters
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} Products and pagination info
 */
const getAllProducts = async (filters = {}) => {
    const {
        category,
        status,
        search,
        lowStock,
        limit = 1000,
        page = 1
    } = filters;

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
            { category: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
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
    const products = await Product.find(query)
        .populate("supplierId", "name email phone")
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Product.countDocuments(query);

    return {
        products,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            limit: parseInt(limit)
        }
    };
};

/**
 * Get product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Product
 */
const getProductById = async (productId) => {
    const product = await Product.findById(productId).populate("supplierId");
    if (!product) {
        throw createError("Product not found", 404);
    }
    return product;
};

/**
 * Create new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 */
const createProduct = async (productData) => {
    // Check for duplicate barcode if provided
    if (productData.barcode) {
        const existing = await Product.findOne({ barcode: productData.barcode });
        if (existing) {
            throw createError("Product with this barcode already exists", 400);
        }
    }

    const product = await Product.create(productData);
    
    // Check for low stock
    if (product.quantity <= product.reorderLevel) {
        await notificationService.checkLowStock(product);
    }

    return product;
};

/**
 * Update product
 * @param {string} productId - Product ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated product
 */
const updateProduct = async (productId, updateData) => {
    // Check for duplicate barcode if updating
    if (updateData.barcode) {
        const existing = await Product.findOne({
            barcode: updateData.barcode,
            _id: { $ne: productId }
        });
        if (existing) {
            throw createError("Product with this barcode already exists", 400);
        }
    }

    const product = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true, runValidators: true }
    ).populate("supplierId");

    if (!product) {
        throw createError("Product not found", 404);
    }

    // Check for low stock after update
    await notificationService.checkLowStock(product);

    return product;
};

/**
 * Delete product
 * @param {string} productId - Product ID
 * @returns {Promise<void>}
 */
const deleteProduct = async (productId) => {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
        throw createError("Product not found", 404);
    }
};

/**
 * Update product stock
 * @param {string} productId - Product ID
 * @param {number} quantityChange - Quantity change (positive or negative)
 * @returns {Promise<Object>} Updated product
 */
const updateStock = async (productId, quantityChange) => {
    if (typeof quantityChange !== "number") {
        throw createError("quantityChange must be a number", 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw createError("Product not found", 404);
    }

    // Update stock using model method
    product.updateStock(quantityChange);
    await product.save();

    // Check for low stock
    await notificationService.checkLowStock(product);

    return product;
};

/**
 * Get low stock products
 * @returns {Promise<Array>} Low stock products
 */
const getLowStockProducts = async () => {
    const threshold = process.env.LOW_STOCK_THRESHOLD || 10;
    const products = await Product.find({
        $or: [
            { quantity: { $lte: threshold } },
            { $expr: { $lte: ["$quantity", "$reorderLevel"] } }
        ],
        status: PRODUCT_STATUS.ACTIVE
    }).populate("supplierId");

    return products;
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getLowStockProducts
};

