/**
 * Authentication Routes
 * Handles authentication endpoints
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

// Public routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

// Protected routes
router.get("/me", protect, authController.getCurrentUser);
router.get("/users", protect, authorize("admin"), authController.getAllUsers);

module.exports = router;

