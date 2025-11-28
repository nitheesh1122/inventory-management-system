/**
 * Supplier Validators
 * Joi validation schemas for supplier endpoints
 */

const Joi = require("joi");

const createSupplierSchema = Joi.object({
    name: Joi.string().trim().min(1).max(200).required(),
    contactPerson: Joi.string().trim().max(100).optional(),
    email: Joi.string().email().max(200).optional(),
    phone: Joi.string().trim().required(),
    address: Joi.object({
        street: Joi.string().trim().max(200).optional(),
        city: Joi.string().trim().max(100).optional(),
        state: Joi.string().trim().max(100).optional(),
        zipCode: Joi.string().trim().max(20).optional(),
        country: Joi.string().trim().max(100).optional()
    }).optional(),
    paymentTerms: Joi.string().default("Net 30"),
    status: Joi.string().valid("active", "inactive").default("active"),
    notes: Joi.string().trim().max(1000).optional()
});

const updateSupplierSchema = Joi.object({
    name: Joi.string().trim().min(1).max(200).optional(),
    contactPerson: Joi.string().trim().max(100).optional(),
    email: Joi.string().email().max(200).optional(),
    phone: Joi.string().trim().optional(),
    address: Joi.object({
        street: Joi.string().trim().max(200).optional(),
        city: Joi.string().trim().max(100).optional(),
        state: Joi.string().trim().max(100).optional(),
        zipCode: Joi.string().trim().max(20).optional(),
        country: Joi.string().trim().max(100).optional()
    }).optional(),
    paymentTerms: Joi.string().optional(),
    status: Joi.string().valid("active", "inactive").optional(),
    notes: Joi.string().trim().max(1000).optional()
});

module.exports = {
    createSupplierSchema,
    updateSupplierSchema
};

