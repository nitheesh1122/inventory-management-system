/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */

const authService = require("../services/auth.service");
const { asyncHandler } = require("../utils/errors");

/**
 * Register new user
 * @route POST /api/auth/register
 * @access Public (or Admin only in production)
 */
const register = asyncHandler(async (req, res) => {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({
        status: "success",
        token,
        user
    });
});

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({
        status: "success",
        token,
        user
    });
});

/**
 * Get current user
 * @route GET /api/auth/me
 * @access Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user._id);
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
});

/**
 * Get all users (Admin only)
 * @route GET /api/auth/users
 * @access Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await authService.getAllUsers();
    res.json({
        status: "success",
        count: users.length,
        users
    });
});

module.exports = {
    register,
    login,
    getCurrentUser,
    getAllUsers
};
