import { AppConfig } from '../config/AppConfig.js';
import { FilterSystem } from '../core/FilterSystem.js';
import { AppState } from '../state/AppState.js';
import { Logger } from '../utils/Logger.js';
import { PerformanceOptimizer } from '../utils/Performance.js';
import * as UIUpdates from './UIUpdates.js';

/**
 * INICIALIZACIÓN DEL SISTEMA DE FILTRADO MEJORADO
 * @param {Function} applyAllFiltersAndRender - Función de orquestación del renderizado
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
 * INICIALIZAR FILTROS POR CATEGORÍA
 */
export function initializeCategoryFilters(applyAllFiltersAndRender) {
    const filtersContainer = document.querySelector(AppConfig.selectors.filtersContainer); // [51]
    if (!filtersContainer) {
        Logger.warn("Contenedor de filtros no encontrado");
        return;
    }

    const handleCategoryClick = (event) =>
        handleCategoryFilterClick(event, applyAllFiltersAndRender); // Envoltura del handler

    // Generación de HTML para los botones de categoría [51, 52]
    const filterButtonHTML = AppState.categories.map(
        (category) => `
            <button class="filter-btn ${category.id === "all" ? AppConfig.classes.active : ""
            }"
                data-category="${category.id}"
                data-filter-type="category"
                aria-pressed="${category.id === "all" ? "true" : "false"}">
            <span aria-hidden="true">${category.icon}</span>
            ${category.name}
        </button>
        `
    ).join("");

    filtersContainer.innerHTML = filterButtonHTML;
    const filterButtons = filtersContainer.querySelectorAll(".filter-btn");
    filterButtons.forEach((button) => {
        button.addEventListener("click", handleCategoryClick); // [52]
    });
}

/**
 * INICIALIZAR SISTEMA DE BÚSQUEDA
 */
export function initializeSearchFilter(applyAllFiltersAndRender) {
    const searchInput = document.querySelector(AppConfig.selectors.searchInput); // [52, 53]
    if (!searchInput) {
        Logger.warn("Campo de búsqueda no encontrado");
        return;
    }

    searchInput.disabled = false;
    searchInput.placeholder = "🔎 Buscar productos..."; // [53]

    // Búsqueda en tiempo real con debounce
    const debouncedSearch = PerformanceOptimizer.debounce((event) => {
        FilterSystem.searchQuery = event.target.value.trim();
        applyAllFiltersAndRender(); // [53]
        Logger.info(`🔍 Búsqueda: "${FilterSystem.searchQuery}"`);
    }, 300);

    searchInput.addEventListener("input", debouncedSearch);

    // Manejo de Escape
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.target.value = "";
            FilterSystem.searchQuery = "";
            applyAllFiltersAndRender(); // [41]
        }
    });
}

/**
 * INICIALIZAR FILTROS DE ESTADO Y ETIQUETAS
 */
export function initializeStatusFilters(applyAllFiltersAndRender) {
    const filterStatusContainer = document.querySelector(AppConfig.selectors.filterStatus); // [42]
    if (!filterStatusContainer) {
        Logger.warn("Contenedor de filtros de estado no encontrado");
        return;
    }

    const handleCheckboxChange = (event) =>
        handleCheckboxFilterChange(event, applyAllFiltersAndRender); // Envoltura del handler

    // Creación de HTML de checkboxes [54, 55]
    const statusFiltersHTML = `<div class="filter-group">
            <h4 class="filter-group-title">Estado</h4>
            <div class="filter-options">
                ${AppConfig.filters.statusOptions
            .map(
                (filter) => `
                    <label class="filter-checkbox">
                        <input type="checkbox"
                            value="${filter.id}"
                            data-filter-type="status">
                        <span class="filter-label">
                            <span aria-hidden="true">${filter.icon}</span>
                            ${filter.name}
                        </span>
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
                        <input type="checkbox"
                            value="${filter.id}"
                            data-filter-type="tags">
                        <span class="filter-label">
                            <span aria-hidden="true">${filter.icon}</span>
                            ${filter.name}
                        </span>
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
                    <input type="checkbox"
                        id="hide-out-of-stock"
                        ${!FilterSystem.showOutOfStock ? "checked" : ""}>
                    <span class="filter-label">
                        <span aria-hidden="true">✅</span>
                        Solo productos en stock
                    </span>
                </label>
            </div>
        </div>`;
    filterStatusContainer.innerHTML = statusFiltersHTML;

    // Event listenners para checkboxes
    const checkboxes = filterStatusContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", handleCheckboxChange); // [55]
    });
}

/**
 * INICIALIZAR VISUALIZACIÓN DE FILTROS ACTIVOS
 */
export function initializeActiveFiltersDisplay(applyAllFiltersAndRender) {
    const clearFiltersBtn = document.querySelector(AppConfig.selectors.clearFilters); // [56]

    const handleClearClick = () =>
        handleClearAllFilters(applyAllFiltersAndRender);

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", handleClearClick); // [56]
    }
    UIUpdates.updateActiveFiltersDisplay(); // Se llama a la función placeholder del UIUpdates
}

// --- HANDLERS DE EVENTOS ---

function handleCategoryFilterClick(event, applyAllFiltersAndRender) {
    const button = event.target.closest(".filter-btn"); // [57]
    if (!button) return;
    const category = button.dataset.category;

    FilterSystem.currentCategory = category;

    UIUpdates.updateCategoryFilterButtons(button); // Usar la función de UIUpdates [46, 57]
    applyAllFiltersAndRender();
    Logger.info(`📂 Filtro de categoría aplicado: ${category}`); // [57]
}

function handleCheckboxFilterChange(event, applyAllFiltersAndRender) {
    const checkbox = event.target;
    const filterType = checkbox.dataset.filterType;
    const value = checkbox.value; // [58]

    if (filterType) {
        if (checkbox.checked) {
            FilterSystem.addFilter(filterType, value);
        } else {
            FilterSystem.removeFilter(filterType, value);
        }
    } else if (checkbox.id === "hide-out-of-stock") {
        FilterSystem.showOutOfStock = !checkbox.checked; // [58, 59]
    }

    applyAllFiltersAndRender();
    UIUpdates.updateActiveFiltersDisplay();
    Logger.info(`✅ Filtro ${checkbox.checked ? "activado" : "desactivado"}: ${value || "stock"}`); // [59]
}

function handleClearAllFilters(applyAllFiltersAndRender) {
    FilterSystem.clearAllFilters(); // [59]
    UIUpdates.resetFilterUI(); // Usar la función de UIUpdates [49, 59]
    applyAllFiltersAndRender();
    UIUpdates.updateActiveFiltersDisplay();
    Logger.info("🗑️ Todos los filtros han sido limpiados"); // [60]
}