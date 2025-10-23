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
 * @file app.js
 * @description Función principal y orquestación de la galería de productos.
 */

/**
 * @function applyAllFiltersAndRender
 * @description Aplica todos los filtros al estado de productos y ejecuta el renderizado optimizado.
 * @returns {void}
 */
function applyAllFiltersAndRender() {
    const gallery = document.querySelector('.gallery');

    if (gallery) {
        gallery.classList.add('filtering');
    }

    AppState.filteredProducts = FilterSystem.applyAllFilters(AppState.products);

    PerformanceOptimizer.throttledRender(() => {
        renderFilteredProducts();
        updateStatistics();
        updateFilterStats();

        if (gallery) {
            setTimeout(() => gallery.classList.remove('filtering'), 300);
        }
    });
}

/**
 * @function validateDOMElements
 * @description Verifica que todos los elementos DOM requeridos existan.
 * @returns {boolean}
 */
function validateDOMElements() {
    const requiredSelectors = Object.values(AppConfig.selectors);
    const missingElements = requiredSelectors.filter((selector) => {
        return !document.querySelector(selector);
    });

    if (missingElements.length > 0) {
        Logger.warn(`Elementos DOM no encontrados: ${missingElements.join(", ")}`);
        return false;
    }
    return true;
}

/**
 * @async
 * @function initApp
 * @description Función principal que inicializa toda la aplicación.
 * @returns {void}
 */
async function initApp() {
    Logger.info("Inicializando aplicación...");

    try {
        if (!validateDOMElements()) {
            throw new Error("Elementos del DOM requeridos no encontrados");
        }

        showLoadingState();
        showSkeletonLoading();
        PerformanceOptimizer.preloadCriticalResources();

        await loadProductData();

        initializeFilters(applyAllFiltersAndRender);

        renderAllProducts();
        updateStatistics(); // Llamada inicial crucial para corregir el error de conteo.

        Logger.info("✅ Aplicación inicializada correctamente");

    } catch (error) {
        Logger.error("Error durante la inicialización:", error);
        showErrorMessage("Error al cargar la galería, Por favor, recargue la página.");
    }
}

document.addEventListener("DOMContentLoaded", initApp);