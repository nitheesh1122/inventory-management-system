const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createError } = require("../utils/errorHandler");

// Verify JWT token
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Get token from header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(createError("Not authorized to access this route", 401));
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from token
            req.user = await User.findById(decoded.id).select("-password");
            
            if (!req.user) {
                return next(createError("User not found", 404));
            }

            if (!req.user.isActive) {
                return next(createError("User account is deactivated", 403));
            }

            next();
        } catch (error) {
            return next(createError("Invalid token", 401));
        }
    } catch (error) {
        next(error);
    }
};

// Role-based access control
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(createError(`User role '${req.user.role}' is not authorized to access this route`, 403));
        }
        next();
    };
};

