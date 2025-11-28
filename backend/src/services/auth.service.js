/**
 * Authentication Service
 * Handles authentication and authorization business logic
 */

const User = require("../models/User");
const { createError } = require("../utils/errors");
const { generateToken } = require("../utils/jwt");

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User and token
 */
const register = async (userData) => {
    const { name, email, password, role } = userData;

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

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        },
        token
    };
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User and token
 */
const login = async (email, password) => {
    // Get user with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw createError("Invalid credentials", 401);
    }

    // Check if user is active
    if (!user.isActive) {
        throw createError("Account is deactivated", 403);
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw createError("Invalid credentials", 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(user._id);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin
        },
        token
    };
};

/**
 * Get current user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User
 */
const getCurrentUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw createError("User not found", 404);
    }
    return user;
};

/**
 * Get all users
 * @returns {Promise<Array>} Users
 */
const getAllUsers = async () => {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return users;
};

module.exports = {
    register,
    login,
    getCurrentUser,
    getAllUsers
};

