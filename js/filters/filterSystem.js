/**
 * @file filterSystem.js
 * @description Lógica de filtrado avanzada para productos o elementos. Permite
 *              aplicar múltiples filtros de manera dinámica y combinada.
 * @version 1.0.0
 */

/**
 * @namespace FilterSystem
 */
export const FilterSystem = {
    /**
     * Aplica un conjunto de filtros a un array de elementos.
     *
     * @param {Array<Object>} items - Array de elementos a filtrar.
     * @param {Object} filters - Objeto de filtros con clave = propiedad, valor = función o valor a filtrar.
     * @returns {Array<Object>} Array filtrado.
     *
     * @example
     * const filters = {
     *   category: 'Electronics',
     *   price: (value) => value < 100
     * };
     * FilterSystem.applyFilters(products, filters);
     */
    applyFilters(items, filters) {
        return items.filter(item => {
            for (const key in filters) {
                const filterValue = filters[key];
                const itemValue = item[key];

                if (typeof filterValue === 'function') {
                    if (!filterValue(itemValue, item)) return false;
                } else {
                    if (itemValue !== filterValue) return false;
                }
            }
            return true;
        });
    },

    /**
     * Filtra un array por una propiedad específica con varios valores posibles.
     *
     * @param {Array<Object>} items - Array de elementos a filtrar.
     * @param {string} key - Propiedad del objeto para filtrar.
     * @param {Array<*>} allowedValues - Valores permitidos para esa propiedad.
     * @returns {Array<Object>} Array filtrado.
     *
     * @example
     * FilterSystem.filterByMultipleValues(products, 'brand', ['Apple', 'Samsung']);
     */
    filterByMultipleValues(items, key, allowedValues = []) {
        return items.filter(item => allowedValues.includes(item[key]));
    },

    /**
     * Busca elementos que contengan un texto dentro de una propiedad específica.
     *
     * @param {Array<Object>} items - Array de elementos a buscar.
     * @param {string} key - Propiedad sobre la que buscar.
     * @param {string} searchText - Texto a buscar (case insensitive).
     * @returns {Array<Object>} Array de elementos que coinciden con la búsqueda.
     *
     * @example
     * FilterSystem.searchByText(products, 'name', 'laptop');
     */
    searchByText(items, key, searchText = '') {
        const text = searchText.toLowerCase();
        return items.filter(item => {
            const value = (item[key] || '').toString().toLowerCase();
            return value.includes(text);
        });
    },

    /**
     * Combina múltiples filtros (AND) de forma flexible.
     *
     * @param {Array<Object>} items - Array de elementos a filtrar.
     * @param {Array<Function>} filterFunctions - Array de funciones que reciben el item y devuelven true/false.
     * @returns {Array<Object>} Array filtrado.
     *
     * @example
     * FilterSystem.combineFilters(products, [
     *   item => item.price < 100,
     *   item => item.category === 'Electronics'
     * ]);
     */
    combineFilters(items, filterFunctions = []) {
        return items.filter(item => filterFunctions.every(fn => fn(item)));
    },
};
