/**
 * Sales API Service
 * Handles all sales-related API calls
 */

import apiClient from "./api.client";
import { API_ENDPOINTS } from "../config/api.config";

export const salesAPI = {
  /**
   * Get all sales
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Sales and pagination
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.SALES.BASE, { params });
    return response.data;
  },

  /**
   * Get sale by ID
   * @param {string} id - Sale ID
   * @returns {Promise<Object>} Sale
   */
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.SALES.BY_ID(id));
    return response.data;
  },

  /**
   * Create sale
   * @param {Object} saleData - Sale data
   * @returns {Promise<Object>} Created sale
   */
  create: async (saleData) => {
    const response = await apiClient.post(API_ENDPOINTS.SALES.BASE, saleData);
    return response.data;
  },

  /**
   * Delete sale
   * @param {string} id - Sale ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await apiClient.delete(API_ENDPOINTS.SALES.BY_ID(id));
  },
};

export default salesAPI;

