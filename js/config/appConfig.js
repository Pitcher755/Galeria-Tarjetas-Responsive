/**
 * CONFIGURACIÓN GLOBAL DE LA APLICACIÓN
 */

export const AppConfig = {
    version: "1.0.0", // [3]
    debugMode: true, // [3]

    selectors: {
        cardContainer: "#card-container", // [3]
        filtersContainer: "#filters-container", // [3]
        loadingElement: "#loading",
        emptyState: "#empty-state",
        resetFilters: "#reset-filters",
        totalProducts: "#total-products",
        visibleProducts: "#visible-products",
        gallerySummary: "#gallery-summary", // [3]
        searchInput: "#product-search",
        filterStatus: "#filter-status",
        clearFilters: "#clear-filters",
        filterStats: "#filter-stats", // [4]
    },

    classes: {
        hidden: "hidden", // [4]
        active: "active",
        card: "card",
        filterBtn: "filter-btn",
        featured: "card--featured",
        outOfStock: "card--out-of-stock",
        filterActive: "filter-active",
        filterTag: "filter-tag",
        filterCount: "filter-count", // [4]
    },

    filters: {
        statusOptions: [
            { id: "featured", name: "Destacados", icon: "⭐" },
            { id: "new", name: "Nuevos", icon: "🆕" },
            { id: "discount", name: "En oferta", icon: "💸" },
        ], // [4]
        tagOptions: [
            { id: "popular", name: "Populares", icon: "🔥" },
            { id: "nuevo", name: "Nuevo", icon: "🎉" },
            { id: "oferta", name: "Oferta", icon: "💰" },
        ], // [5]
    },

    endpoints: {
        products: "./data/cards.json", // [5]
    },
};