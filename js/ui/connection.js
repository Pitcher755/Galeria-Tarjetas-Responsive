/**
 * @file connection.js
 * @description Monitorea el estado de la conexión a Internet y dispara eventos
 * @version 1.0.0
 * @author PitcherDev
 */

/**
 * Servicio de estado de conexión
 * @namespace Connection
 */
export const Connection = {
    /**
     * Estado actual de la conexión
     * @type {boolean}
     */
    isOnline: navigator.onLine,

    /**
     * Inicializa los listeners de conexión/desconexión
     * @param {Object} [callbacks] - Callbacks personalizados
     * @param {Function} [callbacks.onOnline] - Función a ejecutar cuando se reconecta
     * @param {Function} [callbacks.onOffline] - Función a ejecutar cuando se desconecta
     */
    init(callbacks = {}) {
        this.isOnline = navigator.onLine;

        window.addEventListener('online', () => {
            this.isOnline = true;
            Connection.logStatus();
            if (callbacks.onOnline) callbacks.onOnline();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            Connection.logStatus();
            if (callbacks.onOffline) callbacks.onOffline();
        });

        // Mostrar estado inicial
        this.logStatus();
    },

    /**
     * Ejecuta un callback solo si hay conexión
     * @param {Function} callback - Función a ejecutar
     */
    runIfOnline(callback) {
        if (this.isOnline && typeof callback === 'function') {
            callback();
        }
    },

    /**
     * Registra el estado de conexión en consola
     */
    logStatus() {
        if (this.isOnline) {
            console.info('🟢 Conexión establecida');
        } else {
            console.warn('🔴 Conexión perdida');
        }
    }
};
