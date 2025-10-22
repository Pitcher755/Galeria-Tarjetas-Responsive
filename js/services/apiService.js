/**
 * @file apiService.js
 * @description Servicio para manejar todas las comunicaciones con el backend,
 *              incluyendo soporte para mocks y manejo de errores.
 * @version 1.0.0
 * @author PitcherDev
 */

import { AppConfig } from '../config/appConfig.js';
import { Logger } from '../core/logger.js';
import { AppState } from '../core/state.js';

/**
 * Configuración principal de la API
 * @type {Object}
 */
const ApiConfig = {
    baseURL: 'https://api.tutienda.com/v1',
    timeout: 10000,
    endpoints: {
        products: '/products',
        categories: '/categories',
        search: '/products/search',
        filters: '/products/filters'
    },
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

/**
 * Configuración de desarrollo con mocks
 * @type {Object}
 */
const MockConfig = {
    enabled: true,   // Cambiar a false en producción
    delay: 300,      // Latencia simulada
    failRate: 0.1    // % de requests que fallan
};

/**
 * Servicio de API
 * @namespace ApiService
 */
export const ApiService = {

    /**
     * Realiza una petición HTTP
     * @param {string} url - URL completa o endpoint
     * @param {Object} [options={}] - Opciones de fetch
     * @returns {Promise<Object>} Respuesta de la API
     */
    async request(url, options = {}) {
        const startTime = Date.now();

        try {
            if (MockConfig.enabled && !url.startsWith('http')) {
                return await this.mockRequest(url, options);
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), ApiConfig.timeout);

            const response = await fetch(url, {
                ...options,
                headers: { ...ApiConfig.headers, ...options.headers },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const duration = Date.now() - startTime;
            Logger.info(`🌐 API Request: ${url} (${duration}ms)`);

            return data;
        } catch (error) {
            Logger.error(`❌ API Error: ${url}`, error);
            throw this.handleError(error);
        }
    },

    /**
     * Simula una petición para desarrollo
     * @param {string} endpoint - Endpoint a simular
     * @param {Object} options - Opciones de la petición
     * @returns {Promise<Object>} Datos simulados
     */
    async mockRequest(endpoint, options = {}) {
        await new Promise(resolve => setTimeout(resolve, MockConfig.delay));

        if (Math.random() < MockConfig.failRate) {
            throw new Error('Mock API Error: Simulated network failure');
        }

        const method = options.method || 'GET';
        Logger.info(`🎭 Mock API: ${method} ${endpoint}`);

        switch (endpoint) {
            case ApiConfig.endpoints.products:
                return this.getMockProducts();
            case ApiConfig.endpoints.categories:
                return this.getMockCategories();
            case ApiConfig.endpoints.search:
                return this.getMockSearch(options.body);
            case ApiConfig.endpoints.filters:
                return this.getMockFilters();
            default:
                throw new Error(`Mock endpoint not found: ${endpoint}`);
        }
    },

    /** Obtiene productos desde la API */
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = `${ApiConfig.baseURL}${ApiConfig.endpoints.products}?${queryString}`;
        return await this.request(url);
    },

    /** Obtiene categorías desde la API */
    async getCategories() {
        const url = `${ApiConfig.baseURL}${ApiConfig.endpoints.categories}`;
        return await this.request(url);
    },

    /** Buscar productos con query y filtros */
    async searchProducts(query, filters = {}) {
        const url = `${ApiConfig.baseURL}${ApiConfig.endpoints.search}`;
        return await this.request(url, {
            method: 'POST',
            body: JSON.stringify({ query, filters })
        });
    },

    /** Obtiene opciones de filtros */
    async getFilterOptions() {
        const url = `${ApiConfig.baseURL}${ApiConfig.endpoints.filters}`;
        return await this.request(url);
    },

    /**
     * Manejo de errores formateados
     * @param {Error} error - Error original
     * @returns {Error} Error formateado
     */
    handleError(error) {
        if (error.name === 'AbortError') {
            return new Error('Request timeout: La conexión tardó demasiado tiempo');
        }
        if (error.message.includes('Failed to fetch')) {
            return new Error('Error de conexión: Verifica tu conexión a internet');
        }
        return error;
    },

    /** Datos mock para desarrollo */
    getMockProducts() {
        return {
            success: true,
            data: AppState.products,
            pagination: {
                total: AppState.products.length,
                page: 1,
                pages: 1,
                limit: 50
            },
            timestamp: new Date().toISOString()
        };
    },

    getMockCategories() {
        return {
            success: true,
            data: AppState.categories,
            timestamp: new Date().toISOString()
        };
    },

    getMockSearch(body) {
        const searchParams = JSON.parse(body || '{}');
        const query = searchParams.query?.toLowerCase() || '';

        const filteredProducts = AppState.products.filter(product =>
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );

        return {
            success: true,
            data: filteredProducts,
            query: searchParams.query,
            total: filteredProducts.length,
            timestamp: new Date().toISOString()
        };
    },

    getMockFilters() {
        return {
            success: true,
            data: {
                status: AppConfig.filters.statusOptions,
                tags: AppConfig.filters.tagOptions,
                priceRanges: [
                    { min: 0, max: 50, label: 'Menos de €50' },
                    { min: 50, max: 100, label: '€50 - €100' },
                    { min: 100, max: 200, label: '€100 - €200' },
                    { min: 200, max: null, label: 'Más de €200' }
                ]
            },
            timestamp: new Date().toISOString()
        };
    }
};
