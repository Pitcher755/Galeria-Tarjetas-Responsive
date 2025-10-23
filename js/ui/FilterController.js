import { AppConfig } from '../config/AppConfig.js';
import { FilterSystem } from '../core/FilterSystem.js';
import { AppState } from '../state/AppState.js';
import { Logger } from '../utils/Logger.js';
import { PerformanceOptimizer } from '../utils/Performance.js';
import * as UIUpdates from './UIUpdates.js';

/**
 * @file FilterController.js
 * @description Maneja la inicialización de la UI de filtros y los eventos de interacción.
 */

/**
 * @function initializeFilters
 * @param {Function} applyAllFiltersAndRender - Función de orquestación del renderizado
 * @returns {void}
 */
export function initializeFilters(applyAllFiltersAndRender) {
    Logger.info("Inicializando sistema de filtros...");

    initializeCategoryFilters(applyAllFiltersAndRender);
    initializeSearchFilter(applyAllFiltersAndRender);
    initializeStatusFilters(applyAllFiltersAndRender);
    initializeActiveFiltersDisplay(applyAllFiltersAndRender);

    Logger.info("✅ Sistema de filtros avanzado inicializado");
}

/**
 * @function initializeCategoryFilters
 * @param {Function} applyAllFiltersAndRender - Función de orquestación del renderizado
 * @returns {void}
 */
export function initializeCategoryFilters(applyAllFiltersAndRender) {
    const filtersContainer = document.querySelector(AppConfig.selectors.filtersContainer);

    if (!filtersContainer) {
        Logger.warn("Contenedor de filtros no encontrado");
        return;
    }

    const handleCategoryClick = (event) =>
        handleCategoryFilterClick(event, applyAllFiltersAndRender);

    const filterButtonHTML = AppState.categories.map(
        (category) => `
            <button 
                class="${AppConfig.classes.filterBtn}"
                data-category="${category.id}"
                data-filter-type="category"
                aria-pressed="${category.id === "all" ? "true" : "false"}">
                ${category.icon}
                ${category.name}
            </button>
        `
    ).join("");

    filtersContainer.innerHTML = filterButtonHTML;

    const filterButtons = filtersContainer.querySelectorAll(".filter-btn");
    filterButtons.forEach((button) => {
        button.addEventListener("click", handleCategoryClick);
    });
}

/**
 * @function initializeSearchFilter
 * @param {Function} applyAllFiltersAndRender - Función de orquestación del renderizado
 * @returns {void}
 */
export function initializeSearchFilter(applyAllFiltersAndRender) {
    const searchInput = document.querySelector(AppConfig.selectors.searchInput);

    if (!searchInput) {
        Logger.warn("Campo de búsqueda no encontrado");
        return;
    }

    searchInput.disabled = false;
    searchInput.placeholder = "🔎 Buscar productos...";

    const debouncedSearch = PerformanceOptimizer.debounce((event) => {
        FilterSystem.searchQuery = event.target.value.trim();
        applyAllFiltersAndRender();
        Logger.info(`🔍 Búsqueda: "${FilterSystem.searchQuery}"`);
    }, 300);

    searchInput.addEventListener("input", debouncedSearch);

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.target.value = "";
            FilterSystem.searchQuery = "";
            applyAllFiltersAndRender();
        }
    });
}

/**
 * @function initializeStatusFilters
 * @param {Function} applyAllFiltersAndRender - Función de orquestación del renderizado
 * @returns {void}
 */
export function initializeStatusFilters(applyAllFiltersAndRender) {
    const filterStatusContainer = document.querySelector(AppConfig.selectors.filterStatus);

    if (!filterStatusContainer) {
        Logger.warn("Contenedor de filtros de estado no encontrado");
        return;
    }

    const handleCheckboxChange = (event) =>
        handleCheckboxFilterChange(event, applyAllFiltersAndRender);

    const statusFiltersHTML = `
        <div class="filter-group">
            <h4 class="filter-group-title">Estado</h4>
            <div class="filter-options">
                ${AppConfig.filters.statusOptions
            .map(
                (filter) => `
                        <label class="filter-checkbox">
                            <input type="checkbox" value="${filter.id}" data-filter-type="status">
                            <span class="filter-label">${filter.icon} ${filter.name}</span>
                        </label>
                    `
            )
            .join("")}
            </div>
        </div>
        <div class="filter-group">
            <h4 class="filter-group-title">🏷️ Etiquetas</h4>
            <div class="filter-options">
                ${AppConfig.filters.tagOptions
            .map(
                (filter) => `
                        <label class="filter-checkbox">
                            <input type="checkbox" value="${filter.id}" data-filter-type="tags">
                            <span class="filter-label">${filter.icon} ${filter.name}</span>
                        </label>
                    `
            )
            .join("")}
            </div>
        </div>
        <div class="filter-group">
            <h4 class="filter-group-title">📦 Disponibilidad</h4>
            <div class="filter-options">
                <label class="filter-checkbox">
                    <input type="checkbox" id="hide-out-of-stock" ${!FilterSystem.showOutOfStock ? "checked" : ""}>
                    <span class="filter-label">✅ Solo productos en stock</span>
                </label>
            </div>
        </div>
    `;

    filterStatusContainer.innerHTML = statusFiltersHTML;

    const checkboxes = filterStatusContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", handleCheckboxChange);
    });
}

/**
 * @function initializeActiveFiltersDisplay
 * @param {Function} applyAllFiltersAndRender - Función de orquestación del renderizado
 * @returns {void}
 */
export function initializeActiveFiltersDisplay(applyAllFiltersAndRender) {
    const clearFiltersBtn = document.querySelector(AppConfig.selectors.clearFilters);
    const handleClearClick = () =>
        handleClearAllFilters(applyAllFiltersAndRender);

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", handleClearClick);
    }

    UIUpdates.updateActiveFiltersDisplay();
}

/**
 * @function handleCategoryFilterClick
 * @param {Event} event
 * @param {Function} applyAllFiltersAndRender
 * @returns {void}
 */
function handleCategoryFilterClick(event, applyAllFiltersAndRender) {
    const button = event.target.closest(".filter-btn");
    if (!button) return;

    const category = button.dataset.category;

    FilterSystem.currentCategory = category;
    UIUpdates.updateCategoryFilterButtons(button);

    applyAllFiltersAndRender();
    Logger.info(`📂 Filtro de categoría aplicado: ${category}`);
}

/**
 * @function handleCheckboxFilterChange
 * @param {Event} event
 * @param {Function} applyAllFiltersAndRender
 * @returns {void}
 */
function handleCheckboxFilterChange(event, applyAllFiltersAndRender) {
    const checkbox = event.target;
    const filterType = checkbox.dataset.filterType;
    const value = checkbox.value;

    if (filterType) {
        if (checkbox.checked) {
            FilterSystem.addFilter(filterType, value);
        } else {
            FilterSystem.removeFilter(filterType, value);
        }
    } else if (checkbox.id === "hide-out-of-stock") {
        FilterSystem.showOutOfStock = !checkbox.checked;
    }

    applyAllFiltersAndRender();
    UIUpdates.updateActiveFiltersDisplay();
    Logger.info(`✅ Filtro ${checkbox.checked ? "activado" : "desactivado"}: ${value || "stock"}`);
}

/**
 * @function handleClearAllFilters
 * @param {Function} applyAllFiltersAndRender
 * @returns {void}
 */
function handleClearAllFilters(applyAllFiltersAndRender) {
    FilterSystem.clearAllFilters();
    UIUpdates.resetFilterUI();
    applyAllFiltersAndRender();
    UIUpdates.updateActiveFiltersDisplay();
    Logger.info("🗑️ Todos los filtros han sido limpiados");
}