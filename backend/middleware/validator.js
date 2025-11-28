const Joi = require("joi");

// Validation middleware
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

// Schemas
const schemas = {
    // User schemas
    register: Joi.object({
        name: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid("admin", "staff").default("staff")
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    // Inventory schemas
    createInventory: Joi.object({
        name: Joi.string().trim().min(1).max(100).required(),
        category: Joi.string().trim().min(1).max(50).required(),
        quantity: Joi.number().min(0).required(),
        price: Joi.number().min(0).required(),
        supplier: Joi.string().trim().optional(),
        supplierId: Joi.string().optional(),
        reorderLevel: Joi.number().min(0).default(10),
        description: Joi.string().trim().optional(),
        barcode: Joi.string().trim().optional(),
        unit: Joi.string().default("piece"),
        status: Joi.string().valid("active", "discontinued", "out_of_stock").default("active")
    }),

    updateInventory: Joi.object({
        name: Joi.string().trim().min(1).max(100).optional(),
        category: Joi.string().trim().min(1).max(50).optional(),
        quantity: Joi.number().min(0).optional(),
        price: Joi.number().min(0).optional(),
        supplier: Joi.string().trim().optional(),
        supplierId: Joi.string().optional(),
        reorderLevel: Joi.number().min(0).optional(),
        description: Joi.string().trim().optional(),
        barcode: Joi.string().trim().optional(),
        unit: Joi.string().optional(),
        status: Joi.string().valid("active", "discontinued", "out_of_stock").optional()
    }),

    // Sales schemas
    createSale: Joi.object({
        productName: Joi.string().trim().required(),
        productId: Joi.string().optional(),
        category: Joi.string().trim().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
        customerName: Joi.string().trim().default("Walk-in Customer"),
        customerPhone: Joi.string().trim().optional(),
        paymentMethod: Joi.string().valid("cash", "card", "online").default("cash")
    }),

    // Supplier schemas
    createSupplier: Joi.object({
        name: Joi.string().trim().min(1).max(100).required(),
        contactPerson: Joi.string().trim().optional(),
        email: Joi.string().email().optional(),
        phone: Joi.string().trim().required(),
        address: Joi.object({
            street: Joi.string().optional(),
            city: Joi.string().optional(),
            state: Joi.string().optional(),
            zipCode: Joi.string().optional(),
            country: Joi.string().optional()
        }).optional(),
        paymentTerms: Joi.string().default("Net 30"),
        status: Joi.string().valid("active", "inactive").default("active"),
        notes: Joi.string().optional()
    }),

    updateSupplier: Joi.object({
        name: Joi.string().trim().min(1).max(100).optional(),
        contactPerson: Joi.string().trim().optional(),
        email: Joi.string().email().optional(),
        phone: Joi.string().trim().optional(),
        address: Joi.object({
            street: Joi.string().optional(),
            city: Joi.string().optional(),
            state: Joi.string().optional(),
            zipCode: Joi.string().optional(),
            country: Joi.string().optional()
        }).optional(),
        paymentTerms: Joi.string().optional(),
        status: Joi.string().valid("active", "inactive").optional(),
        notes: Joi.string().optional()
    })
};

module.exports = { validate, schemas };

