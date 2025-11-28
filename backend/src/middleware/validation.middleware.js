/**
 * Validation Middleware
 * Request validation using Joi schemas
 */

const Joi = require("joi");

/**
 * Validate request data against schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join("."),
                message: detail.message
            }));
            return res.status(400).json({
                status: "error",
                message: "Validation error",
                errors
            });
        }
        next();
    };
};

module.exports = {
    validate
};

