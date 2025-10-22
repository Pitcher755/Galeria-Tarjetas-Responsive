/**
 * @file render.js
 * @description Módulo para renderizar elementos de la UI: productos, skeletons, mensajes de estado
 * @version 1.0.0
 * @author PitcherDev
 */

import { Logger } from '../core/logger.js';
import { DomUtils } from './domUtils.js';

/**
 * Servicio de renderizado de UI
 * @namespace Render
 */
export const Render = {

    /**
     * Renderiza lista de productos en el contenedor dado
     * @param {HTMLElement} container - Contenedor donde insertar los productos
     * @param {Array} products - Lista de productos a renderizar
     */
    renderProducts(container, products) {
        if (!container) {
            Logger.error('Container no definido para renderProducts');
            return;
        }

        container.innerHTML = ''; // Limpiar contenedor

        if (!products?.length) {
            this.renderEmptyState(container, 'No se encontraron productos');
            return;
        }

        const fragment = document.createDocumentFragment();

        products.forEach(product => {
            const card = DomUtils.createElement('div', { class: 'product-card' });

            const img = DomUtils.createElement('img', {
                src: product.image || 'assets/placeholder.png',
                alt: product.title
            });

            const title = DomUtils.createElement('h3', { text: product.title });
            const price = DomUtils.createElement('p', { text: `€${product.price.toFixed(2)}` });

            card.append(img, title, price);
            fragment.appendChild(card);
        });

        container.appendChild(fragment);
        Logger.info(`🖼 Renderizados ${products.length} productos`);
    },

    /**
     * Renderiza skeletons para indicar carga de productos
     * @param {HTMLElement} container - Contenedor donde insertar los skeletons
     * @param {number} count - Número de skeletons a mostrar
     */
    renderSkeletons(container, count = 6) {
        if (!container) return;
        container.innerHTML = '';

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < count; i++) {
            const skeleton = DomUtils.createElement('div', { class: 'product-skeleton' });
            fragment.appendChild(skeleton);
        }

        container.appendChild(fragment);
        Logger.info(`⏳ Renderizados ${count} skeletons`);
    },

    /**
     * Renderiza mensaje de estado (empty, error, info)
     * @param {HTMLElement} container - Contenedor donde mostrar el mensaje
     * @param {string} message - Mensaje a mostrar
     * @param {string} [type='info'] - Tipo de mensaje: 'info' | 'error' | 'empty'
     */
    renderEmptyState(container, message, type = 'info') {
        if (!container) return;

        container.innerHTML = '';

        const msgEl = DomUtils.createElement('p', { text: message, class: `state-message ${type}` });
        container.appendChild(msgEl);

        Logger.info(`ℹ️ Render mensaje de estado: ${message}`);
    }
};
