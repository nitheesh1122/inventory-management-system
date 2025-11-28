/**
 * Notification Service
 * Handles notifications (low stock alerts, etc.)
 */

const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const logger = require("../utils/logger");
const { PRODUCT_STATUS } = require("../config/constants");

/**
 * Check for low stock and trigger notifications
 * @param {Object} product - Product object
 * @returns {Promise<boolean>} Whether low stock was detected
 */
const checkLowStock = async (product) => {
    try {
        const threshold = process.env.LOW_STOCK_THRESHOLD || 10;
        
        // Check if item is low on stock
        if (product.quantity <= product.reorderLevel || product.quantity <= threshold) {
            logger.warn(`Low stock alert: ${product.name} - Current: ${product.quantity}, Reorder: ${product.reorderLevel}`);
            
            // Get supplier if exists
            if (product.supplierId) {
                const supplier = await Supplier.findById(product.supplierId);
                if (supplier && supplier.status === "active") {
                    // TODO: Send notification to supplier
                    logger.info(`Low stock notification should be sent to supplier: ${supplier.name}`);
                    // await sendSupplierNotification(supplier, product);
                }
            }
            
            // TODO: Send notification to admin
            logger.info(`Low stock notification should be sent to admin for product: ${product.name}`);
            // await sendAdminNotification(product);
            
            return true;
        }
        return false;
    } catch (error) {
        logger.error(`Error checking low stock: ${error.message}`);
        return false;
    }
};

/**
 * Check all products for low stock
 * @returns {Promise<Array>} Low stock items
 */
const checkAllLowStock = async () => {
    try {
        const threshold = process.env.LOW_STOCK_THRESHOLD || 10;
        const lowStockItems = await Product.find({
            $or: [
                { quantity: { $lte: threshold } },
                { $expr: { $lte: ["$quantity", "$reorderLevel"] } }
            ],
            status: PRODUCT_STATUS.ACTIVE
        }).populate("supplierId");

        logger.info(`Found ${lowStockItems.length} items with low stock`);
        return lowStockItems;
    } catch (error) {
        logger.error(`Error checking all low stock: ${error.message}`);
        return [];
    }
};

/**
 * Send email notification (placeholder - implement with nodemailer)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} message - Email message
 * @returns {Promise<boolean>} Success status
 */
const sendEmailNotification = async (to, subject, message) => {
    try {
        // TODO: Implement email sending with nodemailer
        logger.info(`Email notification should be sent to: ${to}, Subject: ${subject}`);
        return true;
    } catch (error) {
        logger.error(`Error sending email notification: ${error.message}`);
        return false;
    }
};

/**
 * Send SMS notification (placeholder - implement with Twilio)
 * @param {string} to - Recipient phone
 * @param {string} message - SMS message
 * @returns {Promise<boolean>} Success status
 */
const sendSMSNotification = async (to, message) => {
    try {
        // TODO: Implement SMS sending with Twilio
        logger.info(`SMS notification should be sent to: ${to}`);
        return true;
    } catch (error) {
        logger.error(`Error sending SMS notification: ${error.message}`);
        return false;
    }
};

module.exports = {
    checkLowStock,
    checkAllLowStock,
    sendEmailNotification,
    sendSMSNotification
};

