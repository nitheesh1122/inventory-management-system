/**
 * Product Routes
 * Handles product/inventory endpoints
 */

const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
    createProductSchema,
    updateProductSchema,
    updateStockSchema
} = require("../validators/product.validator");

// All routes require authentication
router.use(protect);

// Public routes (authenticated)
router.get("/", productController.getAllProducts);
router.get("/low-stock/check", productController.getLowStockProducts);
router.get("/:id", productController.getProductById);

// Admin-only routes
router.post("/", authorize("admin"), validate(createProductSchema), productController.createProduct);
router.delete("/:id", authorize("admin"), productController.deleteProduct);

// Authenticated routes
router.put("/:id", validate(updateProductSchema), productController.updateProduct);
router.put("/:id/stock", validate(updateStockSchema), productController.updateStock);

module.exports = router;

