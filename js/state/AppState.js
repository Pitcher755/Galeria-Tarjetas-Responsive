/**
 * @file AppState.js
 * @description Define y gestiona el estado global de la aplicación.
 */

/**
 * @constant
 * @type {Object}
 * @property {Array} products - Lista de todos los productos
 * @property {Array} categories - Lista de categorías disponibles
 * @property {Array} filteredProducts - Productos filtrados actualmente
 * @property {string} currentFilter - Filtro activo actual (a nivel general)
 */
export const AppState = {
    products: [],
    categories: [],
    filteredProducts: [],
    currentFilter: "all",
};