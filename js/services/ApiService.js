import { AppConfig } from '../config/AppConfig.js';
import { AppState } from '../state/AppState.js';
import { Logger } from '../utils/Logger.js';

/**
 * @file ApiService.js
 * @description Servicio para manejar todas las comunicaciones con el backend, incluyendo mocks.
 */

/**
 * @constant
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
 * @constant
 * @type {Object}
 * @property {boolean} enabled - Si el mock está habilitado (debe ser true en dev local)
 * @property {number} delay - Simulación de latencia de red (ms)
 * @property {number} failRate - Porcentaje de fallos simulados
 */
export const MockConfig = { // Exportamos MockConfig
    enabled: true,
    delay: 300,
    failRate: 0.1
};

/**
 * @constant
 * @type {Object}
 */
export const ApiService = {

    /**
     * @async
     * @function request
     * @description Realiza una petición HTTP, usando mock si está habilitado.
     * @param {string} url - URL del endpoint
     * @param {Object} [options={}] - Opciones de fetch
     * @returns {Promise<Object>} Respuesta de la API
     */
    async request(url, options = {}) {
        const startTime = Date.now();
        try {
            // Cuando MockConfig.enabled es TRUE, no queremos intentar acceder a la URL real
            // Sin embargo, esta función está diseñada para manejar peticiones de prod.

            // Si la URL NO incluye 'http' (es decir, es un endpoint interno de Mock), la tratamos como mock.
            // NOTA: Como 'ProductService.js' ahora decide si usar la API o no, 
            // dejaremos esta lógica interna de 'request' intacta para URLs que no sean http,
            // pero el ProductService evitará llamarla con URLs de prod si MockConfig.enabled es true.
            if (MockConfig.enabled && !url.includes('http')) {
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
     * @async
     * @function mockRequest
     * @description Simula una petición a la API.
     * @param {string} endpoint - Endpoint a simular
     * @param {Object} [options={}] - Opciones de la petición
     * @returns {Promise<Object>} Datos mock
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

    /**
     * @async
     * @function getProducts
     * @description Construye la URL de productos para la API real.
     * @param {Object} [params={}] - Parámetros de filtrado
     * @returns {Promise<Object>} Lista de productos
     */
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = `${ApiConfig.baseURL}${ApiConfig.endpoints.products}?${queryString}`;
        return await this.request(url);
    },

    /**
     * @async
     * @function getCategories
     * @description Construye la URL de categorías para la API real.
     * @returns {Promise<Object>} Lista de categorías
     */
    async getCategories() {
        const url = `${ApiConfig.baseURL}${ApiConfig.endpoints.categories}`;
        return await this.request(url);
    },

    /**
     * @async
     * @function searchProducts
     * @description Busca productos en la API real.
     * @param {string} query - Término de búsqueda
     * @param {Object} [filters={}] - Filtros adicionales
     * @returns {Promise<Object>} Productos encontrados
     */
    async searchProducts(query, filters = {}) {
        const url = `${ApiConfig.baseURL}${ApiConfig.endpoints.search}`;
        return await this.request(url, {
            method: 'POST',
            body: JSON.stringify({ query, filters })
        });
    },

    /**
     * @async
     * @function getFilterOptions
     * @description Obtiene opciones de filtrado.
     * @returns {Promise<Object>} Opciones de filtrado disponibles
     */
    async getFilterOptions() {
        const url = `${ApiConfig.baseURL}${ApiConfig.endpoints.filters}`;
        return await this.request(url);
    },

    /**
     * @function handleError
     * @description Formatea errores de fetch y timeout.
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

    /**
     * @function getMockProducts
     * @description Retorna datos mock de productos.
     * @returns {Object} Datos mock
     */
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

    /**
     * @function getMockCategories
     * @description Retorna datos mock de categorías.
     * @returns {Object} Datos mock
     */
    getMockCategories() {
        return {
            success: true,
            data: AppState.categories,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * @function getMockSearch
     * @param {string} body - JSON string con la consulta
     * @returns {Object} Datos mock
     */
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

    /**
     * @function getMockFilters
     * @returns {Object} Datos mock
     */
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