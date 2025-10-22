import { AppConfig } from '../config/AppConfig.js';
import { AppState } from '../state/AppState.js';
import { Logger } from '../utils/Logger.js';
// Importación simulada de API Service y MockConfig si fueran necesarios en producción
// import { ApiService } from './ApiService.js'; 
// import { MockConfig } from '../config/MockConfig.js'; 

/**
 * CARGA DE DATOS DE PRODUCTOS
 */
export async function loadProductData() {
    Logger.info("📥 Cargando datos de productos..."); // [17]
    try {
        let productsData, categoriesData;

        // **NOTA:** El código original incluye lógica para Modo Producción/Desarrollo [17, 18],
        // pero solo se mantiene la lógica de carga local (fallback) para simplificar la extracción
        // del código fuente proporcionado, asumiendo que es el modo de desarrollo/fallback.

        Logger.info('Modo desarrollo: usando datos locales'); // [18]
        const response = await fetch(AppConfig.endpoints.products);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const localData = await response.json();
        productsData = localData.products;
        categoriesData = localData.categories; // [18]

        // Validación [19]
        if (!productsData || !Array.isArray(productsData)) {
            throw new Error(`Estructura de datos inválida desde la API`);
        }

        // Actualizar estado global [19]
        AppState.products = productsData;
        AppState.categories = categoriesData || [];
        AppState.filteredProducts = [...productsData];

        Logger.info(`${productsData.length} productos cargados correctamente`);
        Logger.info(`${categoriesData?.length || 0} categorías cargadas`); // [19]

    } catch (error) {
        Logger.error("Error cargando datos de productos:", error); // [19]
        await loadFallbackData();
    }
}

/**
 * CARGAR DATOS DE FALLBACK
 */
export async function loadFallbackData() {
    try {
        Logger.info('🛡️ Intentando cargar datos de fallback...'); // [20]
        const response = await fetch(AppConfig.endpoints.products);

        if (!response.ok) {
            throw new Error('Fallback también falló');
        }

        const data = await response.json();

        if (!data.products || !Array.isArray(data.products)) {
            throw new Error('Datos de fallback inválidos'); // [20]
        }

        AppState.products = data.products;
        AppState.categories = data.categories || [];
        AppState.filteredProducts = [...data.products]; // [20]

        Logger.info(`🛡️ ${data.products.length} productos cargados desde fallback`); // [21]

    } catch (fallbackError) {
        Logger.error('❌ Error crítico: Fallback también falló', fallbackError);
        throw new Error('No se pudieron cargar los productos. Verifica tu conexión y recarga la página.'); // [21]
    }
}