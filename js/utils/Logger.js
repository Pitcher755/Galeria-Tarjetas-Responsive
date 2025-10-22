import { AppConfig } from '../config/AppConfig.js';

/**
 * SISTEMA DE LOGGING PARA DESARROLLO
 */
export const Logger = {

    info: (message, data = null) => {
        if (AppConfig.debugMode) {
            console.log(`[INFO]: ${message}`, data || ""); // [24]
        }
    },

    warn: (message, data = null) => {
        if (AppConfig.debugMode) {
            console.warn(`⚠️ [warn]: ${message}`, data || ""); // [24, 25]
        }
    },

    error: (message, error = null) => {
        if (AppConfig.debugMode) {
            console.error(`[ERROR]: ${message}`, error || ""); // [25]
        }
    },
};