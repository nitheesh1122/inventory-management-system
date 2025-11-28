/**
 * Sale Controller
 * Handles sale-related HTTP requests
 */

const saleService = require("../services/sale.service");
const { asyncHandler } = require("../utils/errors");

/**
 * Get all sales
 * @route GET /api/sales
 * @access Private
 */
const getAllSales = asyncHandler(async (req, res) => {
    const { sales, pagination } = await saleService.getAllSales(req.query);
    res.json({
        status: "success",
        count: sales.length,
        pagination,
        sales
    });
});

/**
 * Get single sale
 * @route GET /api/sales/:id
 * @access Private
 */
const getSaleById = asyncHandler(async (req, res) => {
    const sale = await saleService.getSaleById(req.params.id);
    res.json({
        status: "success",
        sale
    });
});

/**
 * Create sale
 * @route POST /api/sales
 * @access Private
 */
const createSale = asyncHandler(async (req, res) => {
    const sale = await saleService.createSale(req.body);
    res.status(201).json({
        status: "success",
        message: "Sale recorded successfully",
        sale
    });
});

/**
 * Delete sale
 * @route DELETE /api/sales/:id
 * @access Private
 */
const deleteSale = asyncHandler(async (req, res) => {
    await saleService.deleteSale(req.params.id);
    res.json({
        status: "success",
        message: "Sale deleted and stock restored successfully"
    });
});

module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    deleteSale
};

