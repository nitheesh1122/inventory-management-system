/**
 * Application Constants
 * Centralized constants for the application
 */

module.exports = {
    // User Roles
    ROLES: {
        ADMIN: "admin",
        STAFF: "staff",
    },

    // Product Status
    PRODUCT_STATUS: {
        ACTIVE: "active",
        DISCONTINUED: "discontinued",
        OUT_OF_STOCK: "out_of_stock",
    },

    // Sale Status
    SALE_STATUS: {
        COMPLETED: "completed",
        PENDING: "pending",
        CANCELLED: "cancelled",
    },

    // Payment Methods
    PAYMENT_METHODS: {
        CASH: "cash",
        CARD: "card",
        ONLINE: "online",
    },

    // Supplier Status
    SUPPLIER_STATUS: {
        ACTIVE: "active",
        INACTIVE: "inactive",
    },

    // Default Values
    DEFAULTS: {
        LOW_STOCK_THRESHOLD: 10,
        REORDER_LEVEL: 10,
        PAGE_LIMIT: 100,
        ITEM_UNIT: "piece",
    },

    // Messages
    MESSAGES: {
        NOT_FOUND: "Resource not found",
        UNAUTHORIZED: "Not authorized to access this resource",
        INVALID_CREDENTIALS: "Invalid credentials",
        DUPLICATE_EMAIL: "User already exists with this email",
        INSUFFICIENT_STOCK: "Insufficient stock available",
    },
};

