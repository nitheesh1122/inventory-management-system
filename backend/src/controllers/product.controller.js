/**
 * Product Controller
 * Handles product-related HTTP requests
 */

const productService = require("../services/product.service");
const { asyncHandler } = require("../utils/errors");

/**
 * Get all products
 * @route GET /api/products
 * @access Private
 */
const getAllProducts = asyncHandler(async (req, res) => {
    const { products, pagination } = await productService.getAllProducts(req.query);
    res.json({
        status: "success",
        count: products.length,
        pagination,
        products
    });
});

/**
 * Get single product
 * @route GET /api/products/:id
 * @access Private
 */
const getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.json({
        status: "success",
        product
    });
});

/**
 * Create product
 * @route POST /api/products
 * @access Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
        status: "success",
        product
    });
});

/**
 * Update product
 * @route PUT /api/products/:id
 * @access Private
 */
const updateProduct = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({
        status: "success",
        product
    });
});

/**
 * Delete product
 * @route DELETE /api/products/:id
 * @access Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    res.json({
        status: "success",
        message: "Product deleted successfully"
    });
});

/**
 * Update product stock
 * @route PUT /api/products/:id/stock
 * @access Private
 */
const updateStock = asyncHandler(async (req, res) => {
    const { quantityChange } = req.body;
    const product = await productService.updateStock(req.params.id, quantityChange);
    res.json({
        status: "success",
        message: "Stock updated successfully",
        product
    });
});

/**
 * Get low stock products
 * @route GET /api/products/low-stock/check
 * @access Private
 */
const getLowStockProducts = asyncHandler(async (req, res) => {
    const products = await productService.getLowStockProducts();
    res.json({
        status: "success",
        count: products.length,
        products
    });
});

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getLowStockProducts
};

