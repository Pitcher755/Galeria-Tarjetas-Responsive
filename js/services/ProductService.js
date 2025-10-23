import { AppConfig } from '../config/AppConfig.js';
import { AppState } from '../state/AppState.js';
import { Logger } from '../utils/Logger.js';
import { ApiService } from './ApiService.js';

/**
 * @file ProductService.js
 * @description Maneja la carga inicial de datos de productos y categorías.
 */

/**
 * @async
 * @function loadFallbackData
 * @returns {Promise<void>}
 */
export async function loadFallbackData() {
    try {
        Logger.info('🛡️ Intentando cargar datos de fallback...');
        const response = await fetch(AppConfig.endpoints.products);

        if (!response.ok) {
            throw new Error('Fallback también falló');
        }

        const data = await response.json();

        if (!data.products || !Array.isArray(data.products)) {
            throw new Error('Datos de fallback inválidos');
        }

        AppState.products = data.products;
        AppState.categories = data.categories || [];
        AppState.filteredProducts = [...data.products];

        Logger.info(`🛡️ ${data.products.length} productos cargados desde fallback`);
    } catch (fallbackError) {
        Logger.error('❌ Error crítico: Fallback también falló', fallbackError);
        throw new Error('No se pudieron cargar los productos. Verifica tu conexión y recarga la página.');
    }
}

/**
 * @async
 * @function loadProductData
 * @description Carga los datos de productos, usando la API o el mock, y actualiza el estado.
 * @returns {Promise<void>}
 */
export async function loadProductData() {
    Logger.info("📥 Cargando datos de productos...");

    try {
        let productsData, categoriesData;

        // Modo producción (usando ApiService)
        // Nota: Asumimos que ApiService.MockConfig.enabled controla si es mock o real
        const [productsResponse, categoriesResponse] = await Promise.all([
            ApiService.getProducts(),
            ApiService.getCategories(),
        ]);

        productsData = productsResponse.data;
        categoriesData = categoriesResponse.data;

        if (!productsData || !Array.isArray(productsData)) {
            throw new Error(`Estructura de datos inválida desde la API`);
        }

        AppState.products = productsData;
        AppState.categories = categoriesData || [];
        AppState.filteredProducts = [...productsData];

        Logger.info(`${productsData.length} productos cargados correctamente`);
        Logger.info(`${categoriesData?.length || 0} categorías cargadas`);

    } catch (error) {
        Logger.error("Error cargando datos de productos:", error);
        // Si falla la API/Mock, intentar cargar el fallback local (siempre disponible)
        await loadFallbackData();
    }
}