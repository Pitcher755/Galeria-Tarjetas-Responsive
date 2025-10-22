import { AppConfig } from '../config/AppConfig.js';
import { FilterSystem } from '../core/FilterSystem.js';
import { AppState } from '../state/AppState.js';
import { Logger } from '../utils/Logger.js';

/**
 * ACTUALIZACIÓN DE ESTADÍSTICAS
 */
export function updateStatistics() {
    const totalElement = document.querySelector(AppConfig.selectors.totalProducts);
    const visibleElement = document.querySelector(AppConfig.selectors.visibleProducts);
    const summaryElement = document.querySelector(AppConfig.selectors.gallerySummary); // [43]

    if (totalElement) {
        totalElement.textContent = AppState.products.length;
    }
    if (visibleElement) {
        visibleElement.textContent = AppState.filteredProducts.length;
    }

    if (summaryElement) {
        summaryElement.innerHTML = `
            Mostrando *${AppState.filteredProducts.length}* 
            de *${AppState.products.length}* productos
        `; // [43, 44]
    }
}

/**
 * ACTUALIZAR ESTADÍSTICAS DE FILTROS
 */
export function updateFilterStats() {
    const filterStats = document.querySelector(AppConfig.selectors.filterStats);
    const clearFiltersBtn = document.querySelector(AppConfig.selectors.clearFilters); // [45]

    const filterStatsData = FilterSystem.getFilterStats();

    if (filterStats) {
        filterStats.textContent =
            filterStatsData.total > 0
                ? `${filterStatsData.total} filtro(s) activo(s)`
                : "Sin filtros activos";
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.style.display =
            filterStatsData.total > 0 ? "block" : "none"; // [45, 46]
    }
}

/**
 * MOSTRAR ESTADO DE CARGA
 */
export function showLoadingState() {
    const loadingElement = document.querySelector(AppConfig.selectors.loadingElement);
    const emptyState = document.querySelector(AppConfig.selectors.emptyState); // [44]

    if (loadingElement) {
        loadingElement.classList.remove(AppConfig.classes.hidden);
    }

    if (emptyState) {
        emptyState.classList.add(AppConfig.classes.hidden); // [44]
    }
}

/**
 * MOSTRAR MENSAJES DE ERROR AL USUARIO
 */
export function showErrorMessage(message) {
    const container = document.querySelector(AppConfig.selectors.cardContainer);
    const loadingElement = document.querySelector(AppConfig.selectors.loadingElement); // [47]

    if (loadingElement) {
        loadingElement.classList.add(AppConfig.classes.hidden);
    }

    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <p>${message}</p>
                <button onclick="window.location.reload()">Reintentar</button>
            </div>
        `; // [48]
    }
}

/**
 * ACTUALIZAR BOTONES DE FILTRO DE CATEGORÍA
 */
export function updateCategoryFilterButtons(activeButton) {
    const allButtons = document.querySelectorAll('[data-filter-type="category"]'); // [46]
    allButtons.forEach((button) => {
        const isActive = button === activeButton;
        button.classList.toggle(AppConfig.classes.active, isActive);
        button.setAttribute("aria-pressed", isActive.toString()); // [49]
    });
}

/**
 * RESETEAR INTERFAZ DE FILTROS
 */
export function resetFilterUI() {
    // Resetear botones de categoría [49]
    const categoryButtons = document.querySelectorAll('[data-filter-type="category"]');
    categoryButtons.forEach((button) => {
        const isAll = button.dataset.category === "all";
        button.classList.toggle(AppConfig.classes.active, isAll);
        button.setAttribute("aria-pressed", isAll.toString()); // [50]
    });

    // Resetear checkboxes [50]
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    // Resetear búsqueda [50]
    const searchInput = document.querySelector(AppConfig.selectors.searchInput);
    if (searchInput) {
        searchInput.value = "";
    }
}

/**
 * ACTUALIZAR VISUALIZACIÓN DE FILTROS ACTIVOS (Placeholder)
 */
export function updateActiveFiltersDisplay() {
    // Esta función se implementará en mejoras futuras [48]
    Logger.info("Actualizando visualización de filtros activos");
}