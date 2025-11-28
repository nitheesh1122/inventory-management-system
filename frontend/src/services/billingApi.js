// Updated to use centralized API configuration
import { billingAPI, inventoryAPI } from "./api";

// Fetch all sales (from billing endpoint for backward compatibility)
export const getSales = async () => {
    try {
        const response = await billingAPI.getAll();
        return response.data.sales || response.data || [];
    } catch (error) {
        console.error("Error fetching sales:", error);
        return [];
    }
};

// Add a sale
export const addSale = async (saleData) => {
    try {
        const response = await billingAPI.create(saleData);
        return response.data.sale || response.data;
    } catch (error) {
        console.error("Error adding sale:", error);
        throw error;
    }
};

// Delete a sale
export const deleteSale = async (id) => {
    try {
        await billingAPI.delete(id);
        return true;
    } catch (error) {
        console.error("Error deleting sale:", error);
        throw error;
    }
};

// Fetch inventory data
export const getInventory = async () => {
    try {
        const response = await inventoryAPI.getAll();
        return response.data.inventory || response.data || [];
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return [];
    }
};

// Update inventory stock (positive = add, negative = reduce)
export const updateStock = async (id, quantityChange, reason) => {
    try {
        const response = await inventoryAPI.updateStock(id, { quantityChange, reason });
        return response.data.item || response.data;
    } catch (error) {
        console.error("Error updating stock:", error);
        throw error;
    }
};
