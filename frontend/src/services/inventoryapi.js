// Updated to use centralized API configuration
import { inventoryAPI } from "./api";

// GET all inventory items
export const getInventory = async (params) => {
    try {
        const response = await inventoryAPI.getAll(params);
        return response.data.inventory || response.data || [];
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return [];
    }
};

// ADD a new inventory item
export const addInventory = async (item) => {
    try {
        const response = await inventoryAPI.create(item);
        return response.data.item || response.data;
    } catch (error) {
        console.error("Error adding inventory item:", error);
        throw error;
    }
};

// UPDATE an inventory item
export const updateInventory = async (id, updatedItem) => {
    try {
        const response = await inventoryAPI.update(id, updatedItem);
        return response.data.item || response.data;
    } catch (error) {
        console.error("Error updating inventory item:", error);
        throw error;
    }
};

// DELETE an inventory item
export const deleteInventory = async (id) => {
    try {
        await inventoryAPI.delete(id);
        return true;
    } catch (error) {
        console.error("Error deleting inventory item:", error);
        throw error;
    }
};
