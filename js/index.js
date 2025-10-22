/**
 * @file index.js
 * @description Punto de entrada principal de la aplicación. Inicializa todos los módulos y la app.
 * @version 1.0.0
 * @author PitcherDev
 */

import { Logger } from './core/logger.js';
import { AppState } from './core/state.js';
import { FilterSystem } from './filters/filterSystem.js';
import { FilterUI } from './filters/filterUI.js';
import { ApiService } from './services/apiService.js';
import { DataLoader } from './services/dataLoader.js';
import { Connection } from './ui/connection.js';
import { Render } from './ui/render.js';

/**
 * Inicializa la aplicación
 */
async function initApp() {
    Logger.info('🚀 Inicializando aplicación...');

    // Inicializar conexión a Internet
    Connection.init({
        onOnline: async () => {
            Logger.info('📶 Reconectado. Sincronizando datos...');
            await loadData();
        },
        onOffline: () => {
            Logger.warn('⚠️ Estás sin conexión. Algunos datos pueden no estar disponibles.');
        }
    });

    // Cargar datos iniciales
    await loadData();

    // Inicializar filtros UI y lógica
    FilterUI.init({
        onFilterChange: (activeFilters) => {
            const filteredProducts = FilterSystem.applyFilters(AppState.products, activeFilters);
            Render.renderProducts(filteredProducts);
        }
    });

    // Render inicial de productos
    Render.renderProducts(AppState.products);

    Logger.info('✅ Aplicación inicializada correctamente');
}

/**
 * Carga de datos desde API o fallback local
 */
async function loadData() {
    try {
        // Intentar cargar productos y categorías desde la API
        const [productsResponse, categoriesResponse] = await Promise.all([
            ApiService.getProducts(),
            ApiService.getCategories()
        ]);

        // Actualizar estado global
        AppState.products = productsResponse.data || [];
        AppState.categories = categoriesResponse.data || [];

        Logger.info(`📦 Productos cargados: ${AppState.products.length}`);
        Logger.info(`🗂️ Categorías cargadas: ${AppState.categories.length}`);
    } catch (error) {
        Logger.error('❌ Error cargando datos desde la API, usando fallback local', error);

        // Cargar desde fallback local si hay error
        const fallbackData = DataLoader.loadLocalData();
        AppState.products = fallbackData.products;
        AppState.categories = fallbackData.categories;

        Logger.info(`📦 Productos cargados (fallback): ${AppState.products.length}`);
        Logger.info(`🗂️ Categorías cargadas (fallback): ${AppState.categories.length}`);
    }
}

// Ejecutar inicialización
initApp();
