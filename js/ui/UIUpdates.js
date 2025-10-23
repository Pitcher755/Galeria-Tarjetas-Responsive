import { AppConfig } from '../config/AppConfig.js';
import { FilterSystem } from '../core/FilterSystem.js';
import { AppState } from '../state/AppState.js';
import { Logger } from '../utils/Logger.js';

/**
 * @file UIUpdates.js
 * @description Funciones para modificar elementos visuales de la interfaz (estadísticas, filtros, mensajes).
 */

/**
 * @function updateStatistics
 * @description Actualiza las estadísticas mostradas en la interfaz (total y visible).
 * @returns {void}
 */
export function updateStatistics() {
    const totalElement = document.querySelector(AppConfig.selectors.totalProducts);
    const visibleElement = document.querySelector(AppConfig.selectors.visibleProducts);
    const summaryElement = document.querySelector(AppConfig.selectors.gallerySummary);

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
        `;
    }
}

/**
 * @function updateFilterStats
 * @description Actualiza el contador de filtros activos y el botón de limpiar filtros.
 * @returns {void}
 */
export function updateFilterStats() {
    const filterStats = document.querySelector(AppConfig.selectors.filterStats);
    const clearFiltersBtn = document.querySelector(AppConfig.selectors.clearFilters);
    const filterStatsData = FilterSystem.getFilterStats();

    if (filterStats) {
        filterStats.textContent =
            filterStatsData.total > 0
                ? `${filterStatsData.total} filtro(s) activo(s)`
                : "Sin filtros activos";
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.style.display =
            filterStatsData.total > 0 ? "block" : "none";
    }
}

/**
 * @function showLoadingState
 * @description Muestra el estado de carga en la interfaz y oculta el estado vacío.
 * @returns {void}
 */
export function showLoadingState() {
    const loadingElement = document.querySelector(AppConfig.selectors.loadingElement);
    const emptyState = document.querySelector(AppConfig.selectors.emptyState);

    if (loadingElement) {
        loadingElement.classList.remove(AppConfig.classes.hidden);
    }

    if (emptyState) {
        emptyState.classList.add(AppConfig.classes.hidden);
    }
}

/**
 * @function showErrorMessage
 * @description Muestra un mensaje de error crítico al usuario.
 * @param {string} message - Mensaje de error a mostrar
 * @returns {void}
 */
export function showErrorMessage(message) {
    const container = document.querySelector(AppConfig.selectors.cardContainer);
    const loadingElement = document.querySelector(AppConfig.selectors.loadingElement);

    if (loadingElement) {
        loadingElement.classList.add(AppConfig.classes.hidden);
    }

    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button class="retry-btn" onclick="window.location.reload()">Reintentar</button>
            </div>
        `;
    }
}

/**
 * @function updateCategoryFilterButtons
 * @description Actualiza el estado visual de los botones de categoría (clase 'active').
 * @param {HTMLElement} activeButton - Botón activo actualmente
 * @returns {void}
 */
export function updateCategoryFilterButtons(activeButton) {
    const allButtons = document.querySelectorAll('[data-filter-type="category"]');

    allButtons.forEach((button) => {
        const isActive = button === activeButton;
        button.classList.toggle(AppConfig.classes.active, isActive);
        button.setAttribute("aria-pressed", isActive.toString());
    });
}

/**
 * @function resetFilterUI
 * @description Restablece la interfaz de usuario de filtros a su estado inicial.
 * @returns {void}
 */
export function resetFilterUI() {
    const categoryButtons = document.querySelectorAll('[data-filter-type="category"]');
    categoryButtons.forEach((button) => {
        const isAll = button.dataset.category === "all";
        button.classList.toggle(AppConfig.classes.active, isAll);
        button.setAttribute("aria-pressed", isAll.toString());
    });

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    const searchInput = document.querySelector(AppConfig.selectors.searchInput);
    if (searchInput) {
        searchInput.value = "";
    }
}

/**
 * @function updateActiveFiltersDisplay
 * @description Actualiza la visualización de los filtros activos (Placeholder).
 * @returns {void}
 */
export function updateActiveFiltersDisplay() {
    Logger.info("Actualizando visualización de filtros activos");
}