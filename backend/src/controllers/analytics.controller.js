/**
 * Analytics Controller
 * Handles analytics-related HTTP requests
 */

const analyticsService = require("../services/analytics.service");
const { asyncHandler } = require("../utils/errors");

/**
 * Get sales analytics
 * @route GET /api/analytics/sales
 * @access Private/Admin
 */
const getSalesAnalytics = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const analytics = await analyticsService.getSalesAnalytics(startDate, endDate);
    res.json({
        status: "success",
        analytics
    });
});

/**
 * Get inventory analytics
 * @route GET /api/analytics/inventory
 * @access Private/Admin
 */
const getInventoryAnalytics = asyncHandler(async (req, res) => {
    const analytics = await analyticsService.getInventoryAnalytics();
    res.json({
        status: "success",
        analytics
    });
});

/**
 * Get dashboard analytics (combined)
 * @route GET /api/analytics/dashboard
 * @access Private/Admin
 */
const getDashboardAnalytics = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const [salesAnalytics, inventoryAnalytics] = await Promise.all([
        analyticsService.getSalesAnalytics(startDate, endDate),
        analyticsService.getInventoryAnalytics()
    ]);
    
    res.json({
        status: "success",
        analytics: {
            sales: salesAnalytics,
            inventory: inventoryAnalytics
        }
    });
});

module.exports = {
    getSalesAnalytics,
    getInventoryAnalytics,
    getDashboardAnalytics
};

