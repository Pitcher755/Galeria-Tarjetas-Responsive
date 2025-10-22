import { Logger } from './Logger.js';

/**
 * Función para manejo de estado de conexión
 */
export function updateConnectionStatus(isOnline) {
    const statusElement = document.getElementById('connection-status');
    if (!statusElement) return;

    if (isOnline) {
        statusElement.textContent = '✅ Conectado'; // [29]
        statusElement.className = 'connection-status online';
    } else {
        statusElement.textContent = '⚠️ Sin conexión - Modo offline';
        statusElement.className = 'connection-status offline'; // [29]
    }
}

/**
 * Listeners para estado de conexión
 */
export function initializeConnectionMonitor() {
    window.addEventListener('online', () => {
        Logger.info('🌐 Conexión restaurada'); // [29]
        updateConnectionStatus(true);
    });

    window.addEventListener('offline', () => {
        Logger.warn('🌐 Sin conexión - Modo offline activado'); // [29]
        updateConnectionStatus(false);
    });

    // Estado inicial
    updateConnectionStatus(navigator.onLine); // [30]
}