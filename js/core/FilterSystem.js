/**
 * @file FilterSystem.js
 * @description Lógica central para aplicar y gestionar los filtros combinados.
 */

/**
 * @constant
 * @type {Object}
 * @property {string} currentCategory - Categoría activa actual
 * @property {string} searchQuery - Término de búsqueda actual
 * @property {Object} activeFilters - Filtros activos por tipo (status, tags)
 * @property {boolean} showOutOfStock - Mostrar productos agotados
 */
export const FilterSystem = {
    currentCategory: "all",
    searchQuery: "",
    activeFilters: {
        status: [],
        tags: [],
    },
    showOutOfStock: true,

    /**
     * @function applyAllFilters
     * @param {Array<Object>} products - Lista de productos a filtrar
     * @returns {Array<Object>} Productos filtrados
     */
    applyAllFilters(products) {
        return products.filter((product) => {
            return (
                this.matchesCategory(product) &&
                this.matchesSearch(product) &&
                this.matchesStatusFilters(product) &&
                this.matchesTagFilters(product) &&
                this.matchesStockFilter(product)
            );
        });
    },

    /**
     * @function matchesCategory
     * @param {Object} product - Producto a evaluar
     * @returns {boolean}
     */
    matchesCategory(product) {
        return (
            this.currentCategory === "all" ||
            product.category === this.currentCategory
        );
    },

    /**
     * @function matchesSearch
     * @param {Object} product - Producto a evaluar
     * @returns {boolean}
     */
    matchesSearch(product) {
        if (!this.searchQuery.trim()) return true;
        const searchTerm = this.searchQuery.toLowerCase();
        return (
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            (product.tags &&
                product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
        );
    },

    /**
     * @function matchesStatusFilters
     * @param {Object} product - Producto a evaluar
     * @returns {boolean}
     */
    matchesStatusFilters(product) {
        if (this.activeFilters.status.length === 0) return true;

        return this.activeFilters.status.some((status) => {
            switch (status) {
                case "featured":
                    return product.featured === true;
                case "new":
                    return product.tags && product.tags.includes("nuevo");
                case "discount":
                    return product.originalPrice && product.originalPrice > product.price;
                default:
                    return true;
            }
        });
    },

    /**
     * @function matchesTagFilters
     * @param {Object} product - Producto a evaluar
     * @returns {boolean}
     */
    matchesTagFilters(product) {
        if (this.activeFilters.tags.length === 0) return true;
        return this.activeFilters.tags.some(
            (tag) => product.tags && product.tags.includes(tag)
        );
    },

    /**
     * @function matchesStockFilter
     * @param {Object} product - Producto a evaluar
     * @returns {boolean}
     */
    matchesStockFilter(product) {
        return this.showOutOfStock || product.stock > 0;
    },

    /**
     * @function addFilter
     * @param {string} type - Tipo de filtro (status, tags)
     * @param {string} value - Valor del filtro
     * @returns {void}
     */
    addFilter(type, value) {
        if (!this.activeFilters[type].includes(value)) {
            this.activeFilters[type].push(value);
        }
    },

    /**
     * @function removeFilter
     * @param {string} type - Tipo de filtro
     * @param {string} value - Valor del filtro
     * @returns {void}
     */
    removeFilter(type, value) {
        this.activeFilters[type] = this.activeFilters[type].filter(
            (item) => item !== value
        );
    },

    /**
     * @function clearAllFilters
     * @returns {void}
     */
    clearAllFilters() {
        this.currentCategory = "all";
        this.searchQuery = "";
        this.activeFilters = { status: [], tags: [] };
        this.showOutOfStock = true;
    },

    /**
     * @function getFilterStats
     * @returns {Object} Estadísticas de los filtros activos
     */
    getFilterStats() {
        return {
            category: this.currentCategory !== "all",
            search: this.searchQuery.trim() !== "",
            status: this.activeFilters.status.length,
            tags: this.activeFilters.tags.length,
            stock: !this.showOutOfStock,
            total:
                (this.currentCategory !== "all" ? 1 : 0) +
                (this.searchQuery.trim() !== "" ? 1 : 0) +
                this.activeFilters.status.length +
                this.activeFilters.tags.length +
                (!this.showOutOfStock ? 1 : 0),
        };
    },
};