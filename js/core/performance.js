/**
 * @file performance.js
 * @description Módulo que contiene funciones orientadas a optimizar el rendimiento
 *              general de la aplicación. Incluye mecanismos de control de frecuencia
 *              de ejecución de funciones (throttle, debounce) y carga diferida de
 *              imágenes mediante IntersectionObserver.
 * @version 1.0.0
 */

/**
 * @namespace Performance
 * @property {Function} throttle - Controla la frecuencia de ejecución de una función.
 * @property {Function} debounce - Retrasa la ejecución de una función hasta que se detiene la llamada repetida.
 * @property {Function} initLazyLoading - Implementa la carga diferida de imágenes.
 */
export const Performance = {
    /**
     * Limita la frecuencia con la que se ejecuta una función.
     * Ideal para eventos frecuentes como `scroll` o `resize`.
     *
     * @param {Function} callback - Función a ejecutar.
     * @param {number} [delay=16] - Tiempo mínimo (ms) entre ejecuciones consecutivas.
     * @returns {Function} Nueva función con control de frecuencia.
     */
    throttle(callback, delay = 16) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                callback(...args);
            }
        };
    },

    /**
     * Retrasa la ejecución de una función hasta que cesan las llamadas continuas.
     * Ideal para búsquedas o inputs de usuario.
     *
     * @param {Function} callback - Función a ejecutar.
     * @param {number} [wait=300] - Tiempo (ms) a esperar desde la última llamada.
     * @returns {Function} Nueva función con comportamiento "debounce".
     */
    debounce(callback, wait = 300) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => callback(...args), wait);
        };
    },

    /**
     * Inicializa la carga diferida (lazy loading) de imágenes dentro de tarjetas.
     * Usa IntersectionObserver para cargar las imágenes solo cuando están visibles
     * en el viewport, mejorando el rendimiento de carga inicial.
     */
    initLazyLoading() {
        const images = document.querySelectorAll('.card__image[loading="lazy"]');

        if (!images.length) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute("data-src");
                    }
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => observer.observe(img));
    },
};
