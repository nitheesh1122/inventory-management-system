/**
 * Products API Service
 * Handles all product-related API calls
 */

import apiClient from "./api.client";
import { API_ENDPOINTS } from "../config/api.config";

export const productsAPI = {
  /**
   * Get all products
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Products and pagination
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BASE, { params });
    return response.data;
  },

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product
   */
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  },

  /**
   * Create product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  create: async (productData) => {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.BASE, productData);
    return response.data;
  },

  /**
   * Update product
   * @param {string} id - Product ID
   * @param {Object} productData - Update data
   * @returns {Promise<Object>} Updated product
   */
  update: async (id, productData) => {
    const response = await apiClient.put(API_ENDPOINTS.PRODUCTS.BY_ID(id), productData);
    return response.data;
  },

  /**
   * Delete product
   * @param {string} id - Product ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  /**
   * Update product stock
   * @param {string} id - Product ID
   * @param {Object} stockData - { quantityChange, reason }
   * @returns {Promise<Object>} Updated product
   */
  updateStock: async (id, stockData) => {
    const response = await apiClient.put(API_ENDPOINTS.PRODUCTS.STOCK(id), stockData);
    return response.data;
  },

  /**
   * Get low stock products
   * @returns {Promise<Object>} Low stock products
   */
  getLowStock: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.LOW_STOCK);
    return response.data;
  },
};

export default productsAPI;

