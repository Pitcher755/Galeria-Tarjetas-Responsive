/**
 * @file filterUI.js
 * @description Inicialización y manejo de eventos de la UI de filtros.
 *              Conecta los elementos del DOM con la lógica de filtrado avanzada.
 * @version 1.0.0
 */

import { Logger } from '../core/logger.js';
import { AppState } from '../core/state.js';
import { FilterSystem } from './filterSystem.js';

/**
 * @namespace FilterUI
 */
export const FilterUI = {
    /**
     * Inicializa los filtros en la UI.
     *
     * @param {string} containerSelector - Selector del contenedor donde están los filtros.
     * @param {Array<Object>} items - Lista de items a filtrar (del estado global).
     */
    init(containerSelector, items) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            Logger.warn(`FilterUI: Contenedor no encontrado (${containerSelector})`);
            return;
        }

        this.items = items;
        this.filters = {};

        this._attachEventListeners();
    },

    /**
     * Adjunta los eventos de cambio en los filtros.
     * Detecta inputs de texto, selects, checkboxes y radios.
     *
     * @private
     */
    _attachEventListeners() {
        const inputs = this.container.querySelectorAll('input, select');

        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this._updateFilters(e.target);
                this._applyFilters();
            });
        });
    },

    /**
     * Actualiza el objeto de filtros según el input modificado.
     *
     * @param {HTMLElement} input - Elemento de input modificado.
     * @private
     */
    _updateFilters(input) {
        const key = input.dataset.filterKey;
        if (!key) return;

        if (input.type === 'checkbox') {
            if (!this.filters[key]) this.filters[key] = [];
            if (input.checked) {
                this.filters[key].push(input.value);
            } else {
                this.filters[key] = this.filters[key].filter(v => v !== input.value);
            }
        } else if (input.type === 'text') {
            this.filters[key] = input.value;
        } else if (input.tagName.toLowerCase() === 'select') {
            this.filters[key] = input.value;
        }
    },

    /**
     * Aplica los filtros al array de items y actualiza el estado global.
     *
     * @private
     */
    _applyFilters() {
        let filtered = [...this.items];

        for (const key in this.filters) {
            const value = this.filters[key];

            if (Array.isArray(value)) {
                if (value.length > 0) {
                    filtered = FilterSystem.filterByMultipleValues(filtered, key, value);
                }
            } else if (typeof value === 'string' && value.trim() !== '') {
                filtered = FilterSystem.searchByText(filtered, key, value);
            } else if (typeof value === 'function') {
                filtered = FilterSystem.applyFilters(filtered, { [key]: value });
            }
        }

        // Actualiza el estado global
        AppState.set('filteredItems', filtered);
    },
};
