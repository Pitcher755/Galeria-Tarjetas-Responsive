/**
 * @file logger.js
 * @description Módulo de registro (logger) centralizado. Gestiona la salida de
 *              mensajes en consola según el modo de depuración definido en la
 *              configuración global. Permite mantener un control uniforme y 
 *              desactivar logs fácilmente en entornos de producción.
 * @version 1.0.0
 */

import { AppConfig } from "../config/appConfig.js";

/**
 * @namespace Logger
 * @property {Function} info  - Muestra información general o estados del sistema.
 * @property {Function} warn  - Muestra advertencias que no interrumpen el flujo.
 * @property {Function} error - Muestra errores que afectan la ejecución.
 */
export const Logger = {
    /**
     * Muestra un mensaje informativo en consola si `debugMode` está activado.
     * @param {string} message - Texto del mensaje a mostrar.
     * @param {*} [data=null] - Datos adicionales opcionales para mostrar junto al mensaje.
     */
    info(message, data = null) {
        if (AppConfig.debugMode) {
            console.log(`[INFO]: ${message}`, data ?? "");
        }
    },

    /**
     * Muestra una advertencia en consola si `debugMode` está activado.
     * @param {string} message - Texto del mensaje de advertencia.
     * @param {*} [data=null] - Datos opcionales relacionados con la advertencia.
     */
    warn(message, data = null) {
        if (AppConfig.debugMode) {
            console.warn(`[WARN]: ${message}`, data ?? "");
        }
    },

    /**
     * Muestra un mensaje de error en consola si `debugMode` está activado.
     * @param {string} message - Texto descriptivo del error.
     * @param {Error|*} [error=null] - Objeto de error o información adicional.
     */
    error(message, error = null) {
        if (AppConfig.debugMode) {
            console.error(`[ERROR]: ${message}`, error ?? "");
        }
    },
};
