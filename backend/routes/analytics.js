const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { asyncHandler, createError } = require("../middleware/errorHandler");
const { getSalesAnalytics, getInventoryAnalytics } = require("../utils/analytics");

// @route   GET /api/analytics/sales
// @desc    Get sales analytics
// @access  Private/Admin
router.get("/sales", protect, authorize("admin"), asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const analytics = await getSalesAnalytics(startDate, endDate);
    res.json({
        status: "success",
        analytics
    });
}));

// @route   GET /api/analytics/inventory
// @desc    Get inventory analytics
// @access  Private/Admin
router.get("/inventory", protect, authorize("admin"), asyncHandler(async (req, res) => {
    const analytics = await getInventoryAnalytics();
    res.json({
        status: "success",
        analytics
    });
}));

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard data (sales + inventory)
// @access  Private/Admin
router.get("/dashboard", protect, authorize("admin"), asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const [salesAnalytics, inventoryAnalytics] = await Promise.all([
        getSalesAnalytics(startDate, endDate),
        getInventoryAnalytics()
    ]);
    
    res.json({
        status: "success",
        analytics: {
            sales: salesAnalytics,
            inventory: inventoryAnalytics
        }
    });
}));

module.exports = router;

