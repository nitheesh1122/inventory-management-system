/**
 * Sale Validators
 * Joi validation schemas for sale endpoints
 */

const Joi = require("joi");

const createSaleSchema = Joi.object({
    productName: Joi.string().trim().required(),
    productId: Joi.string().optional(),
    category: Joi.string().trim().required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(0).required(),
    customerName: Joi.string().trim().default("Walk-in Customer"),
    customerPhone: Joi.string().trim().optional(),
    paymentMethod: Joi.string().valid("cash", "card", "online").default("cash")
});

module.exports = {
    createSaleSchema
};

