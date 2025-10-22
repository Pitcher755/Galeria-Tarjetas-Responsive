/**
 * @file dataLoader.js
 * @description Módulo para cargar datos desde la API y proporcionar fallback local
 * @version 1.0.0
 * @author PitcherDev
 */

import { Logger } from '../core/logger.js';
import { AppState } from '../core/state.js';
import { ApiService } from './apiService.js';

/**
 * Servicio para cargar datos con fallback local
 * @namespace DataLoader
 */
export const DataLoader = {

    /**
     * Carga productos desde API o fallback local
     * @param {Object} [params={}] - Parámetros de filtrado
     * @returns {Promise<Array>} Lista de productos
     */
    async loadProducts(params = {}) {
        try {
            const response = await ApiService.getProducts(params);
            if (response?.success) {
                AppState.products = response.data;
                Logger.info(`✅ Productos cargados: ${AppState.products.length}`);
                return AppState.products;
            } else {
                throw new Error('API Response invalid');
            }
        } catch (error) {
            Logger.warn('⚠️ Fallback a productos locales', error);
            return AppState.products; // Retorna datos locales en caso de fallo
        }
    },

    /**
     * Carga categorías desde API o fallback local
     * @returns {Promise<Array>} Lista de categorías
     */
    async loadCategories() {
        try {
            const response = await ApiService.getCategories();
            if (response?.success) {
                AppState.categories = response.data;
                Logger.info(`✅ Categorías cargadas: ${AppState.categories.length}`);
                return AppState.categories;
            } else {
                throw new Error('API Response invalid');
            }
        } catch (error) {
            Logger.warn('⚠️ Fallback a categorías locales', error);
            return AppState.categories;
        }
    },

    /**
     * Carga opciones de filtros desde API o fallback local
     * @returns {Promise<Object>} Opciones de filtros
     */
    async loadFilterOptions() {
        try {
            const response = await ApiService.getFilterOptions();
            if (response?.success) {
                AppState.filters = response.data;
                Logger.info('✅ Filtros cargados desde API');
                return AppState.filters;
            } else {
                throw new Error('API Response invalid');
            }
        } catch (error) {
            Logger.warn('⚠️ Fallback a filtros locales', error);
            return AppState.filters;
        }
    },

    /**
     * Carga todos los datos iniciales (productos, categorías, filtros)
     * @returns {Promise<void>}
     */
    async loadAllData() {
        await Promise.all([
            this.loadProducts(),
            this.loadCategories(),
            this.loadFilterOptions()
        ]);
        Logger.info('📦 Todos los datos iniciales cargados');
    }
};
