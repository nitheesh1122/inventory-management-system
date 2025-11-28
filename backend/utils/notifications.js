const Inventory = require("../models/Inventory");
const Supplier = require("../models/Supplier");
const logger = require("../middleware/logger");

// Check for low stock and send notifications
const checkLowStock = async (inventoryItem) => {
    try {
        const threshold = process.env.LOW_STOCK_THRESHOLD || 10;
        
        // Check if item is low on stock
        if (inventoryItem.quantity <= inventoryItem.reorderLevel || inventoryItem.quantity <= threshold) {
            logger.warn(`Low stock alert: ${inventoryItem.name} - Current quantity: ${inventoryItem.quantity}, Reorder level: ${inventoryItem.reorderLevel}`);
            
            // Get supplier if exists
            if (inventoryItem.supplierId) {
                const supplier = await Supplier.findById(inventoryItem.supplierId);
                if (supplier && supplier.status === "active") {
                    // TODO: Send notification to supplier
                    logger.info(`Low stock notification should be sent to supplier: ${supplier.name}`);
                    // await sendSupplierNotification(supplier, inventoryItem);
                }
            }
            
            // TODO: Send notification to admin
            logger.info(`Low stock notification should be sent to admin for product: ${inventoryItem.name}`);
            // await sendAdminNotification(inventoryItem);
            
            return true;
        }
        return false;
    } catch (error) {
        logger.error(`Error checking low stock: ${error.message}`);
        return false;
    }
};

// Check all inventory for low stock items
const checkAllLowStock = async () => {
    try {
        const threshold = process.env.LOW_STOCK_THRESHOLD || 10;
        const lowStockItems = await Inventory.find({
            $or: [
                { quantity: { $lte: threshold } },
                { quantity: { $lte: "$reorderLevel" } }
            ],
            status: "active"
        }).populate("supplierId");
        
        logger.info(`Found ${lowStockItems.length} items with low stock`);
        return lowStockItems;
    } catch (error) {
        logger.error(`Error checking all low stock: ${error.message}`);
        return [];
    }
};

// Send email notification (placeholder - implement with nodemailer)
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

// Send SMS notification (placeholder - implement with Twilio)
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

