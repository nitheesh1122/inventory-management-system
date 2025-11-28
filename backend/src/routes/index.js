/**
 * Routes Aggregator
 * Collects all routes and exports them
 */

const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const saleRoutes = require("./sale.routes");
const supplierRoutes = require("./supplier.routes");
const analyticsRoutes = require("./analytics.routes");

module.exports = {
    authRoutes,
    productRoutes,
    saleRoutes,
    supplierRoutes,
    analyticsRoutes
};

