const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validate, schemas } = require("../middleware/validator");
const { protect, authorize } = require("../middleware/auth");
const { asyncHandler, createError } = require("../middleware/errorHandler");

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d"
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public (or Admin only in production)
router.post("/register", validate(schemas.register), asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createError("User already exists with this email", 400);
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || "staff"
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
        status: "success",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", validate(schemas.login), asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw createError("Invalid credentials", 401);
    }

    // Check if user is active
    if (!user.isActive) {
        throw createError("Account is deactivated", 403);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw createError("Invalid credentials", 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
        status: "success",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}));

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({
        status: "success",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin
        }
    });
}));

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get("/users", protect, authorize("admin"), asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.json({
        status: "success",
        count: users.length,
        users
    });
}));

module.exports = router;

