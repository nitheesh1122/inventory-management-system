/**
 * Suppliers API Service
 * Handles all supplier-related API calls
 */

import apiClient from "./api.client";
import { API_ENDPOINTS } from "../config/api.config";

export const suppliersAPI = {
  /**
   * Get all suppliers
   * @returns {Promise<Object>} Suppliers
   */
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.SUPPLIERS.BASE);
    return response.data;
  },

  /**
   * Get supplier by ID
   * @param {string} id - Supplier ID
   * @returns {Promise<Object>} Supplier
   */
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.SUPPLIERS.BY_ID(id));
    return response.data;
  },

  /**
   * Create supplier
   * @param {Object} supplierData - Supplier data
   * @returns {Promise<Object>} Created supplier
   */
  create: async (supplierData) => {
    const response = await apiClient.post(API_ENDPOINTS.SUPPLIERS.BASE, supplierData);
    return response.data;
  },

  /**
   * Update supplier
   * @param {string} id - Supplier ID
   * @param {Object} supplierData - Update data
   * @returns {Promise<Object>} Updated supplier
   */
  update: async (id, supplierData) => {
    const response = await apiClient.put(API_ENDPOINTS.SUPPLIERS.BY_ID(id), supplierData);
    return response.data;
  },

  /**
   * Delete supplier
   * @param {string} id - Supplier ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await apiClient.delete(API_ENDPOINTS.SUPPLIERS.BY_ID(id));
  },
};

export default suppliersAPI;

