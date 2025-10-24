/**
 * @file AppConfig.js
 * @description Configuración global de selectores, clases, filtros y endpoints.
 */

/**
 * @constant
 * @type {Object}
 * @property {string} version
 * @property {boolean} debugMode
 * @property {Object} selectors - Selectores CSS
 * @property {Object} classes - Clases CSS dinámicas
 * @property {Object} filters - Opciones de filtros predefinidas
 * @property {Object} endpoints - URLs para obtener datos
 */
export const AppConfig = {
    version: "1.0.0",
    debugMode: true,
    selectors: {
        cardContainer: "#card-container",
        filtersContainer: "#filters-container",
        loadingElement: "#loading",
        emptyState: "#empty-state",
        resetFilters: "#reset-filters",
        totalProducts: "#total-products",
        visibleProducts: "#visible-products",
        gallerySummary: "#gallery-summary",
        searchInput: "#product-search",
        filterStatus: "#filter-status",
        clearFilters: "#clear-filters",
        filterStats: "#filter-stats",
    },
    classes: {
        hidden: "hidden",
        active: "active",
        card: "card",
        filterBtn: "filter-btn",
        featured: "card--featured",
        outOfStock: "card--out-of-stock",
        filterActive: "filter-active",
        filterTag: "filter-tag",
        filterCount: "filter-count",
    },
    filters: {
        statusOptions: [
            { id: "featured", name: "Destacados", icon: "⭐" },
            { id: "new", name: "Nuevos", icon: "🆕" },
            { id: "discount", name: "En oferta", icon: "💸" },
        ],
        tagOptions: [
            { id: "popular", name: "Populares", icon: "🔥" },
            { id: "nuevo", name: "Nuevo", icon: "🎉" },
            { id: "oferta", name: "Oferta", icon: "💰" },
        ],
    },
    endpoints: {
        products: "./data/cards.json",
    },
};