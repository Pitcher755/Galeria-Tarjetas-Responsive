/**
 * @file appConfig.js
 * @description Configuración global de la aplicación. Define rutas, selectores,
 *              clases CSS, endpoints y opciones de filtros. Esta configuración
 *              centralizada permite modificar parámetros globales sin alterar
 *              la lógica del resto de módulos.
 * @version 1.0.0
 */

/**
 * @namespace AppConfig
 * @property {boolean} debugMode - Activa o desactiva los logs en consola.
 * @property {Object} selectors - Selectores CSS globales utilizados por la app.
 * @property {Object} classes - Clases CSS clave utilizadas para el renderizado y estados.
 * @property {Object} filters - Define las opciones de filtros disponibles.
 * @property {Object} endpoints - Contiene las rutas de los recursos externos.
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
