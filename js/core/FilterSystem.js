/**
 * SISTEMA DE FILTRADO AVANZADO
 */

export const FilterSystem = {
    currentCategory: "all", // [7]
    searchQuery: "", // [7]
    activeFilters: {
        status: [],
        tags: [],
    }, // [7]
    showOutOfStock: true, // [7]

    /**
     * APLICAR TODOS LOS FILTROS COMBINADOS
     */
    applyAllFilters(products) {
        // [10]
        return products.filter((product) => {
            return (
                this.matchesCategory(product) && // [10]
                this.matchesSearch(product) && // [10]
                this.matchesStatusFilters(product) && // [10]
                this.matchesTagFilters(product) &&
                this.matchesStockFilter(product)
            );
        });
    },

    matchesCategory(product) {
        return (
            this.currentCategory === "all" ||
            product.category === this.currentCategory
        ); // [11]
    },

    matchesSearch(product) {
        if (!this.searchQuery.trim()) return true; // [11]
        const searchTerm = this.searchQuery.toLowerCase();
        return (
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            (product.tags &&
                product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
        ); // [11]
    },

    matchesStatusFilters(product) {
        if (this.activeFilters.status.length === 0) return true; // [12]
        return this.activeFilters.status.some((status) => {
            switch (status) {
                case "featured":
                    return product.featured === true;
                case "new":
                    return product.tags && product.tags.includes("nuevo");
                case "discount":
                    return product.originalPrice && product.originalPrice > product.price; // [12]
                default:
                    return true;
            }
        });
    },

    matchesTagFilters(product) {
        if (this.activeFilters.tags.length === 0) return true; // [13]
        return this.activeFilters.tags.some(
            (tag) => product.tags && product.tags.includes(tag)
        );
    },

    matchesStockFilter(product) {
        return this.showOutOfStock || product.stock > 0; // [13, 14]
    },

    addFilter(type, value) {
        if (!this.activeFilters[type].includes(value)) {
            this.activeFilters[type].push(value);
        } // [14]
    },

    removeFilter(type, value) {
        this.activeFilters[type] = this.activeFilters[type].filter(
            (item) => item !== value
        ); // [14]
    },

    clearAllFilters() {
        this.currentCategory = "all";
        this.searchQuery = "";
        this.activeFilters = { status: [], tags: [] };
        this.showOutOfStock = true; // [15]
    },

    getFilterStats() {
        // [15]
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
                (!this.showOutOfStock ? 1 : 0), // [16]
        };
    },
};