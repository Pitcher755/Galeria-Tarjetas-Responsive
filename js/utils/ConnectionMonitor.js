import { Logger } from './Logger.js';

/**
 * @file ConnectionMonitor.js
 * @description Monitoreo del estado de conexión del usuario.
 */

/**
 * @function updateConnectionStatus
 * @param {boolean} isOnline
 * @returns {void}
 */
export function updateConnectionStatus(isOnline) {
    const statusElement = document.getElementById('connection-status');
    if (!statusElement) return;

    if (isOnline) {
        statusElement.textContent = '✅ Conectado';
        statusElement.className = 'connection-status online';
    } else {
        statusElement.textContent = '⚠️ Sin conexión - Modo offline';
        statusElement.className = 'connection-status offline';
    }
}

/**
 * @function initializeConnectionMonitor
 * @description Inicializa los listeners para el estado de conexión (online/offline).
 * @returns {void}
 */
export function initializeConnectionMonitor() {
    window.addEventListener('online', () => {
        Logger.info('🌐 Conexión restaurada');
        updateConnectionStatus(true);
    });

    window.addEventListener('offline', () => {
        Logger.warn('🌐 Sin conexión - Modo offline activado');
        updateConnectionStatus(false);
    });

    updateConnectionStatus(navigator.onLine);
}