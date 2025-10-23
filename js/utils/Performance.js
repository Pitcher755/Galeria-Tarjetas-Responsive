/**
 * @file Performance.js
 * @description Utilidades para optimizar el rendimiento (throttling, debouncing, lazy loading).
 */

/**
 * @constant
 * @namespace PerformanceOptimizer
 * @property {boolean} isThrottled
 * @property {number} lastRenderTime
 * @property {number} renderDelay - Retraso mínimo para renderizado (en ms)
 */
export const PerformanceOptimizer = {
    isThrottled: false,
    lastRenderTime: 0,
    renderDelay: 16,

    /**
     * @function throttledRender
     * @param {Function} callback - Función a ejecutar
     * @returns {void}
     */
    throttledRender(callback) {
        if (this.isThrottled) {
            clearTimeout(this._pending);
            this._pending = setTimeout(() => {
                this.isThrottled = false;
                callback();
            }, this.renderDelay);
            return;
        }

        this.isThrottled = true;
        callback();

        setTimeout(() => {
            this.isThrottled = false;
        }, this.renderDelay);
    },

    /**
     * @function debounce
     * @param {Function} func - Función a debounce
     * @param {number} wait - Tiempo de espera (ms)
     * @returns {Function} Función debounced
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * @function initLazyLoading
     * @description Configura el Lazy Loading para imágenes con la clase 'card__image'.
     * @returns {void}
     */
    initLazyLoading() {
        const images = document.querySelectorAll('.card__image[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove("loading");
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach((img) => imageObserver.observe(img));
    },

    /**
     * @function preloadCriticalResources
     * @description Precarga recursos críticos (ej. fuentes o iconos).
     * @returns {void}
     */
    preloadCriticalResources() {
        const link = document.createElement("link");
        link.rel = "preload";
        // URL de ejemplo de recurso crítico:
        link.href = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E%F0%9F%97%BA%EF%B8%8F%3C/text%3E%3C/svg%3E';
        link.as = "image";
        document.head.appendChild(link);
    }
};