import { AppConfig } from './config/AppConfig.js';
import { FilterSystem } from './core/FilterSystem.js';
import { loadProductData } from './services/ProductService.js';
import { AppState } from './state/AppState.js';
import { initializeFilters } from './ui/FilterController.js';
import { renderAllProducts, renderFilteredProducts, showSkeletonLoading } from './ui/Renderer.js';
import { showErrorMessage, showLoadingState, updateFilterStats, updateStatistics } from './ui/UIUpdates.js';
import { Logger } from './utils/Logger.js';
import { PerformanceOptimizer } from './utils/Performance.js';

/**
 * BUCLE DE APLICACIÓN: Aplica todos los filtros y renderiza
 * Esta función orquesta la lógica central (FilterSystem) y la vista (Renderer/UIUpdates).
 */
function applyAllFiltersAndRender() {
    const container = document.querySelector(AppConfig.selectors.cardContainer);
    const gallery = document.querySelector('.gallery');

    if (gallery) {
        gallery.classList.add('filtering');
    }

    // 1. Aplicar lógica de negocio
    AppState.filteredProducts = FilterSystem.applyAllFilters(AppState.products); // [62]

    // 2. Ejecutar renderizado optimizado
    PerformanceOptimizer.throttledRender(() => {
        renderFilteredProducts(); // [62]
        updateStatistics(); // [62]
        updateFilterStats(); // [62]

        if (gallery) {
            setTimeout(() => gallery.classList.remove('filtering'), 300);
        }
    });
}


/**
 * VALIDACIÓN DE ELEMENTOS DEL DOM
 */
function validateDOMElements() {
    const requiredSelectors = Object.values(AppConfig.selectors);
    const missingElements = requiredSelectors.filter((selector) => {
        return !document.querySelector(selector); // [63]
    });

    if (missingElements.length > 0) {
        Logger.warn(`Elementos DOM no encontrados: ${missingElements.join(", ")}`); // [63]
        return false;
    }
    return true; // [17]
}


/**
 * INICIALIZACIÓN DE LA APLICACIÓN
 */
async function initApp() {
    Logger.info("Inicializando aplicación..."); // [64]
    try {
        if (!validateDOMElements()) {
            throw new Error("Elementos del DOM requeridos no encontrados"); // [64]
        }

        showLoadingState(); // [64]
        showSkeletonLoading(); // [64]
        PerformanceOptimizer.preloadCriticalResources(); // [64]

        // Cargar datos
        await loadProductData(); // [64]

        // Inicializar filtros y pasar la función de renderizado central
        initializeFilters(applyAllFiltersAndRender); // [64]

        // Renderizar inicial
        renderAllProducts(); // [64]

        Logger.info("✅ Aplicación inicializada correctamente");

    } catch (error) {
        Logger.error("Error durante la inicialización:", error); // [64]
        showErrorMessage("Error al cargar la galería, Por favor, recargue la página."); // [62, 64]
    }
}

// EVENTO DE INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO
document.addEventListener("DOMContentLoaded", initApp);