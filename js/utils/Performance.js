/**
 * SISTEMA DE OPTIMIZACIÓN DE RENDIMIENTO
 */
export const PerformanceOptimizer = {
    isThrottled: false,
    lastRenderTime: 0,
    renderDelay: 16, // [16]

    /**
     * RENDERIZADO CON THROTTLE
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
        }, this.renderDelay); // [26]
    },

    /**
     * DEBOUNCE PARA BÚSQUEDAS
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait); // [27]
        };
    },

    /**
     * LAZY LOADING DE IMÁGENES
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
                    imageObserver.unobserve(img); // [28]
                }
            });
        });
        images.forEach((img) => imageObserver.observe(img));
    },

    /**
     * PRELOAD DE RECURSOS CRÍTICOS
     */
    preloadCriticalResources() {
        // Preload de fuentes / recursos críticos [28]
        const link = document.createElement("link");
        link.rel = "preload";
        // URL de ejemplo de recurso crítico:
        link.href = 'data:image/svg+xml,...';
        link.as = "image";
        document.head.appendChild(link);
    }
};