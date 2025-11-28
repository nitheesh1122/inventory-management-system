/**
 * Sale Routes
 * Handles sales endpoints
 */

const express = require("express");
const router = express.Router();
const saleController = require("../controllers/sale.controller");
const { protect } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const { createSaleSchema } = require("../validators/sale.validator");

// All routes require authentication
router.use(protect);

// Routes
router.get("/", saleController.getAllSales);
router.get("/:id", saleController.getSaleById);
router.post("/", validate(createSaleSchema), saleController.createSale);
router.delete("/:id", saleController.deleteSale);

module.exports = router;

