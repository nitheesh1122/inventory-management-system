/**
 * Supplier Routes
 * Handles supplier endpoints
 */

const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplier.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
    createSupplierSchema,
    updateSupplierSchema
} = require("../validators/supplier.validator");

// All routes require authentication
router.use(protect);

// Public routes (authenticated)
router.get("/", supplierController.getAllSuppliers);
router.get("/:id", supplierController.getSupplierById);

// Admin-only routes
router.post("/", authorize("admin"), validate(createSupplierSchema), supplierController.createSupplier);
router.put("/:id", authorize("admin"), validate(updateSupplierSchema), supplierController.updateSupplier);
router.delete("/:id", authorize("admin"), supplierController.deleteSupplier);

module.exports = router;

