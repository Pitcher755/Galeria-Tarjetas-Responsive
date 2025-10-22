/**
 * @file domUtils.js
 * @description Utilidades para manipulación y creación de elementos del DOM
 * @version 1.0.0
 * @author PitcherDev
 */

/**
 * Servicio de utilidades DOM
 * @namespace DomUtils
 */
export const DomUtils = {

    /**
     * Crea un elemento HTML con atributos, clases y texto
     * @param {string} tag - Nombre del tag HTML
     * @param {Object} [options] - Opciones para el elemento
     * @param {string} [options.text] - Texto a insertar
     * @param {string|string[]} [options.class] - Clase(s) CSS
     * @param {Object} [options.attrs] - Atributos adicionales (id, src, alt, etc.)
     * @param {Function} [options.onClick] - Función a ejecutar al hacer click
     * @returns {HTMLElement} Elemento creado
     */
    createElement(tag, options = {}) {
        const el = document.createElement(tag);

        if (options.text) el.textContent = options.text;
        if (options.class) {
            if (Array.isArray(options.class)) {
                el.classList.add(...options.class);
            } else {
                el.classList.add(options.class);
            }
        }
        if (options.attrs) {
            Object.entries(options.attrs).forEach(([key, value]) => {
                el.setAttribute(key, value);
            });
        }
        if (options.onClick && typeof options.onClick === 'function') {
            el.addEventListener('click', options.onClick);
        }

        return el;
    },

    /**
     * Limpia todo el contenido de un contenedor
     * @param {HTMLElement} container - Contenedor a limpiar
     */
    clear(container) {
        if (container) container.innerHTML = '';
    },

    /**
     * Agrega una clase CSS a un elemento
     * @param {HTMLElement} el - Elemento
     * @param {string} className - Nombre de la clase
     */
    addClass(el, className) {
        if (el) el.classList.add(className);
    },

    /**
     * Remueve una clase CSS de un elemento
     * @param {HTMLElement} el - Elemento
     * @param {string} className - Nombre de la clase
     */
    removeClass(el, className) {
        if (el) el.classList.remove(className);
    },

    /**
     * Muestra un elemento (remueve display: none)
     * @param {HTMLElement} el - Elemento a mostrar
     */
    show(el) {
        if (el) el.style.display = '';
    },

    /**
     * Oculta un elemento (display: none)
     * @param {HTMLElement} el - Elemento a ocultar
     */
    hide(el) {
        if (el) el.style.display = 'none';
    },

    /**
     * Alterna visibilidad de un elemento
     * @param {HTMLElement} el - Elemento a alternar
     */
    toggle(el) {
        if (!el) return;
        if (el.style.display === 'none') {
            this.show(el);
        } else {
            this.hide(el);
        }
    },

    /**
     * Busca elementos en el DOM
     * @param {string} selector - Selector CSS
     * @param {HTMLElement} [scope=document] - Contenedor donde buscar
     * @returns {HTMLElement[]} Array de elementos encontrados
     */
    query(selector, scope = document) {
        return Array.from(scope.querySelectorAll(selector));
    }
};
