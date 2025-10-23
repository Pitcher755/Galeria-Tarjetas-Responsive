import { AppConfig } from '../config/AppConfig.js';

/**
 * @file Logger.js
 * @description Utilidades para logging consistente en desarrollo.
 */

/**
 * @constant
 * @namespace Logger
 */
export const Logger = {

    /**
     * @function info
     * @param {string} message - Mensaje a loggear
     * @param {*} [data=null] - Datos adicionales
     * @returns {void}
     */
    info: (message, data = null) => {
        if (AppConfig.debugMode) {
            console.log(`[INFO]: ${message}`, data || "");
        }
    },

    /**
     * @function warn
     * @param {string} message - Mensaje de advertencia
     * @param {*} [data=null] - Datos adicionales
     * @returns {void}
     */
    warn: (message, data = null) => {
        if (AppConfig.debugMode) {
            console.warn(`⚠️ [warn]: ${message}`, data || "");
        }
    },

    /**
     * @function error
     * @param {string} message - Mensaje de error
     * @param {*} [error=null] - Objeto error
     * @returns {void}
     */
    error: (message, error = null) => {
        if (AppConfig.debugMode) {
            console.error(`[ERROR]: ${message}`, error || "");
        }
    },
};