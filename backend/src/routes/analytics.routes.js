/**
 * Analytics Routes
 * Handles analytics endpoints
 */

const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// All routes require admin authentication
router.use(protect);
router.use(authorize("admin"));

// Routes
router.get("/sales", analyticsController.getSalesAnalytics);
router.get("/inventory", analyticsController.getInventoryAnalytics);
router.get("/dashboard", analyticsController.getDashboardAnalytics);

module.exports = router;

