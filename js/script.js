/**
 * GALERÍA INTERACTIVA DE PRODUCTOS
 * 
 * @file script.js
 * @description Lógica principal para la galería de productos con filtrado dinámico
 * @version 1.0.0
 * @author PitcherDev
 * 
 * @namespace ProductGallery
 */

/**
 * CONFIGURACIÓN GLOBAL DE LA APLICACIÓN
 * @type {Object}
 * @property {string} version - Versión actual de la aplicación
 * @property {boolean} debugMode - Modo debug para desarrollo
 * @property {Object} selectors - Selectores CSS utilizados en la aplicación
 * @property {Object} classes - Clases CSS utilizadas dinámicamente
 */
const AppConfig = {
    version: '1.0.0',
    debugMode: true,

    selectors: {
        cardContainer: '#card-container',
        filtersContainer: '#filters-container',
        loadingElement: '#loading'
    },

    classes: {
        hidden: 'hidden',
        active: 'active',
        card: 'card',
        filterBtn: 'filter-btn'
    }
};

/**
 * SISTEMA DE LOGGING PARA DESARROLLO
 * 
 * @namespace Logger
 * @description Utilidades para logging consistente en desarrollo
 */
const Logger = {
    /**
     * Log de información general
     * @param {string} message - Mensaje a loggear
     * @param {*} data - Datos adicionales (opcional)
     */
    info: (message, data = null) => {
        if (AppConfig.debugMode) {
            console.log(`[INFO]: ${message}`, data || '');
        }
    },

    /**
     * Log de advertencias
     * @param {string} message - Mensaje de advertencia
     * @param {*} data - Datos adicionales
     */
    warn: (message, data = null) => {
        if (AppConfig.debugMode) {
            console.warn(`[warn]: ${message}`, data || '');
        }
    },

    /**
     * Log de errores
     * @param {string} message - Mensaje de error
     * @param {*} error - Objeto error
     */
    error: (message, error = null) => {
        if (AppConfig.debugMode) {
            console.error(`[ERROR]: ${message}`, error || '');
        }
    }
};

/**
 * INICIALIZACIÓN DE LA APLICACIÓN
 * 
 * @function initApp
 * @description Función principal que inicializa toda la aplicación
 * @returns {void}
 */
function initApp() {
    Logger.info('Inicializando aplicación...');

    try {
        if (!validateDOMElements()) {
            throw new Error('Elementos del DOM requeridos no encontrados');
        }

        initializeFilters();
        loadProductData();

        Logger.info('Aplicación inicializada correctamente');

    } catch (error) {
        Logger.error('Error durante la inicialización:', error);
        showErrorMessage('Error al cargar la galería, Por favor, recargue la página.');
    }
}

/**
 * VALIDACIÓN DE ELEMENTOS DEL DOM
 * 
 * @function validateDOMElements
 * @description Verifica que todos los elementos DOM requeridos existan
 * @returns {boolean} True si todos los elementos existen, false en caso contrario
 */
function validateDOMElements() {
    const requiredSelectors = [
        AppConfig.selectors.cardContainer,
        AppConfig.selectors.filtersContainer,
        AppConfig.selectors.loadingElement
    ];

    const missingElements = requiredSelectors.filters(selector => {
        return !document.querySelector(selector);
    });

    if (missingElements.length > 0) {
        Logger.warn(`Elementos DOM no encontrados: ${missingElements.join(', ')}`);
        return false;
    }

    return true;
}

/**
 * MOSTRAR MENSAJES DE ERROR AL USUARIO
 * 
 * @function showErrorMessage
 * @description Muestra un mensaje de error en la interfaz de usuario
 * @param {string} message - Mensaje de error a mostrar
 * @returns {void}
 */
function showErrorMessage(message) {
    const container = document.querySelector(AppConfig.selectors.cardContainer);
    if (container) {
        container.innerHTML = `
        <div class="error-message" role="alert" aria-live="assertlive">
            <p> ${message}</p>
            <button onclick="window.location.reload()" class="retry-btn">
                Reintentar
            </button>
        </div>
        `;
    }
}

/**
 * INICIALIZACIÓN DEL SISTEMA DE FILTRADO
 * 
 * @function initializeFilters
 * @description Configura el sistema de filtrados (placeholder para implementación futura)
 * @returns {void}
 */
function initializeFilters() {
    Logger.info('Inicializando sistema de filtros...');
}

/**
 * CARGA DEE DATOS DE PRODUCTOS
 * 
 * @function loadProductData
 * @description Carga los datos de productos desde el archivo JSON
 * @returns {void}
 */
function loadProductData() {
    Logger.info('Cargando datos de productos...');

}

// EVENTO DE INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO
document.addEventListener('DOMContentLoaded', initApp);

// EXPORTACIÓN PARA USO EN MÓDULOS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppConfig,
        Logger,
        initApp
    };
}