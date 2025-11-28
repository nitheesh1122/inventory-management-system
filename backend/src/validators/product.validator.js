/**
 * Product Validators
 * Joi validation schemas for product endpoints
 */

const Joi = require("joi");

const createProductSchema = Joi.object({
    name: Joi.string().trim().min(1).max(200).required(),
    category: Joi.string().trim().min(1).max(100).required(),
    quantity: Joi.number().min(0).required(),
    price: Joi.number().min(0).required(),
    supplier: Joi.string().trim().max(200).optional(),
    supplierId: Joi.string().optional(),
    reorderLevel: Joi.number().min(0).default(10),
    description: Joi.string().trim().max(1000).optional(),
    barcode: Joi.string().trim().optional(),
    unit: Joi.string().default("piece"),
    status: Joi.string().valid("active", "discontinued", "out_of_stock").default("active")
});

const updateProductSchema = Joi.object({
    name: Joi.string().trim().min(1).max(200).optional(),
    category: Joi.string().trim().min(1).max(100).optional(),
    quantity: Joi.number().min(0).optional(),
    price: Joi.number().min(0).optional(),
    supplier: Joi.string().trim().max(200).optional(),
    supplierId: Joi.string().optional(),
    reorderLevel: Joi.number().min(0).optional(),
    description: Joi.string().trim().max(1000).optional(),
    barcode: Joi.string().trim().optional(),
    unit: Joi.string().optional(),
    status: Joi.string().valid("active", "discontinued", "out_of_stock").optional()
});

const updateStockSchema = Joi.object({
    quantityChange: Joi.number().required(),
    reason: Joi.string().trim().optional()
});

module.exports = {
    createProductSchema,
    updateProductSchema,
    updateStockSchema
};

