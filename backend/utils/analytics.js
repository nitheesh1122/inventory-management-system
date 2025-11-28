const Sales = require("../models/Sales");
const Inventory = require("../models/Inventory");

// Get sales analytics
const getSalesAnalytics = async (startDate, endDate) => {
    try {
        const query = {};
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const sales = await Sales.find(query);
        
        // Calculate totals
        const totalSales = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
        
        // Group by category
        const categoryStats = sales.reduce((acc, sale) => {
            if (!acc[sale.category]) {
                acc[sale.category] = { count: 0, revenue: 0, quantity: 0 };
            }
            acc[sale.category].count++;
            acc[sale.category].revenue += sale.totalAmount;
            acc[sale.category].quantity += sale.quantity;
            return acc;
        }, {});
        
        // Top selling products
        const productStats = sales.reduce((acc, sale) => {
            const key = sale.productName;
            if (!acc[key]) {
                acc[key] = { count: 0, revenue: 0, quantity: 0 };
            }
            acc[key].count++;
            acc[key].revenue += sale.totalAmount;
            acc[key].quantity += sale.quantity;
            return acc;
        }, {});
        
        const topProducts = Object.entries(productStats)
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
        
        // Low performing products (products with fewer sales)
        const lowProducts = Object.entries(productStats)
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => a.revenue - b.revenue)
            .slice(0, 10);
        
        // Daily sales breakdown
        const dailySales = sales.reduce((acc, sale) => {
            const date = sale.date.toISOString().split("T")[0];
            if (!acc[date]) {
                acc[date] = { count: 0, revenue: 0, quantity: 0 };
            }
            acc[date].count++;
            acc[date].revenue += sale.totalAmount;
            acc[date].quantity += sale.quantity;
            return acc;
        }, {});
        
        const dailyBreakdown = Object.entries(dailySales)
            .map(([date, stats]) => ({ date, ...stats }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return {
            totalSales,
            totalRevenue,
            totalQuantity,
            categoryStats,
            topProducts,
            lowProducts,
            dailyBreakdown
        };
    } catch (error) {
        throw new Error(`Error getting sales analytics: ${error.message}`);
    }
};

// Get inventory analytics
const getInventoryAnalytics = async () => {
    try {
        const inventory = await Inventory.find();
        
        const totalItems = inventory.length;
        const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
        
        // Low stock items
        const threshold = process.env.LOW_STOCK_THRESHOLD || 10;
        const lowStockItems = inventory.filter(item => 
            item.quantity <= item.reorderLevel || item.quantity <= threshold
        );
        
        // Out of stock items
        const outOfStockItems = inventory.filter(item => item.quantity === 0);
        
        // Category breakdown
        const categoryStats = inventory.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = { count: 0, totalValue: 0, totalQuantity: 0 };
            }
            acc[item.category].count++;
            acc[item.category].totalValue += (item.quantity * item.price);
            acc[item.category].totalQuantity += item.quantity;
            return acc;
        }, {});
        
        return {
            totalItems,
            totalValue,
            totalQuantity,
            lowStockCount: lowStockItems.length,
            outOfStockCount: outOfStockItems.length,
            lowStockItems: lowStockItems.slice(0, 10),
            outOfStockItems: outOfStockItems.slice(0, 10),
            categoryStats
        };
    } catch (error) {
        throw new Error(`Error getting inventory analytics: ${error.message}`);
    }
};

module.exports = {
    getSalesAnalytics,
    getInventoryAnalytics
};

