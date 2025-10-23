import { AppConfig } from '../config/AppConfig.js';
import { AppState } from '../state/AppState.js';
import { Logger } from '../utils/Logger.js';
import { ApiService, MockConfig } from './ApiService.js'; // Importamos MockConfig

/**
 * @file ProductService.js
 * @description Maneja la carga inicial de datos de productos y categorías, priorizando Mock/Fallback en desarrollo.
 */

/**
 * @async
 * @function loadFallbackData
 * @description Carga datos directamente desde el archivo JSON local de fallback.
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
 * @description Carga los datos de productos, usando Mock local si está habilitado o la API real si no.
 * @returns {Promise<void>}
 */
export async function loadProductData() {
    Logger.info("📥 Cargando datos de productos...");

    try {
        let productsData, categoriesData;

        // **CORRECCIÓN DE CORS/MOCK:** Si MockConfig está habilitado, forzamos la carga local de JSON.
        if (MockConfig.enabled) {
            Logger.info('Modo desarrollo (Mock): Usando datos locales para evitar CORS.');

            // Usamos la misma lógica que loadFallbackData para cargar el archivo JSON local
            const response = await fetch(AppConfig.endpoints.products);

            if (!response.ok) {
                // Si el archivo local no existe, pasamos al bloque catch para intentar el fallback
                throw new Error(`Error HTTP: ${response.status} al cargar datos locales.`);
            }

            const localData = await response.json();
            productsData = localData.products;
            categoriesData = localData.categories;

        } else {
            // Modo Producción: Llamar a la API real
            const [productsResponse, categoriesResponse] = await Promise.all([
                ApiService.getProducts(),
                ApiService.getCategories(),
            ]);

            productsData = productsResponse.data;
            categoriesData = categoriesResponse.data;
        }

        if (!productsData || !Array.isArray(productsData)) {
            throw new Error(`Estructura de datos inválida.`);
        }

        AppState.products = productsData;
        AppState.categories = categoriesData || [];
        AppState.filteredProducts = [...productsData];

        Logger.info(`${productsData.length} productos cargados correctamente`);
        Logger.info(`${categoriesData?.length || 0} categorías cargadas`);

    } catch (error) {
        Logger.error("Error cargando datos de productos:", error);
        // Si falla la API real, o si falla la carga local (en modo mock), intentar el fallback.
        await loadFallbackData();
    }
}