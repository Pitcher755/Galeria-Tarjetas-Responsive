/**
 * @file state.js
 * @description Módulo para manejar el estado global de la aplicación. Permite
 *              almacenar datos compartidos y notificar cambios a los listeners
 *              registrados, de forma similar a un mini store reactivo.
 * @version 1.0.0
 */

/**
 * @namespace State
 * @property {Object} _state - Estado interno privado.
 * @property {Map<string, Function[]>} _listeners - Listeners para cambios en propiedades específicas.
 */
export const State = {
    _state: {},
    _listeners: new Map(),

    /**
     * Obtiene el valor de una propiedad del estado.
     *
     * @param {string} key - Clave de la propiedad a obtener.
     * @returns {*} Valor de la propiedad o undefined si no existe.
     */
    get(key) {
        return this._state[key];
    },

    /**
     * Establece el valor de una propiedad del estado y notifica a los listeners.
     *
     * @param {string} key - Clave de la propiedad a establecer.
     * @param {*} value - Valor a asignar.
     */
    set(key, value) {
        const oldValue = this._state[key];
        this._state[key] = value;

        if (this._listeners.has(key)) {
            this._listeners.get(key).forEach(callback => callback(value, oldValue));
        }
    },

    /**
     * Registra un listener para cambios en una propiedad específica del estado.
     *
     * @param {string} key - Clave de la propiedad a escuchar.
     * @param {Function} callback - Función que se ejecuta cuando la propiedad cambia.
     *                              Recibe el valor nuevo y el anterior.
     */
    subscribe(key, callback) {
        if (!this._listeners.has(key)) {
            this._listeners.set(key, []);
        }
        this._listeners.get(key).push(callback);
    },

    /**
     * Elimina un listener de una propiedad específica del estado.
     *
     * @param {string} key - Clave de la propiedad.
     * @param {Function} callback - Función a eliminar de los listeners.
     */
    unsubscribe(key, callback) {
        if (!this._listeners.has(key)) return;

        const callbacks = this._listeners.get(key).filter(cb => cb !== callback);
        this._listeners.set(key, callbacks);
    },

    /**
     * Reemplaza el estado completo con un nuevo objeto, notificando a todos los listeners.
     *
     * @param {Object} newState - Nuevo estado a establecer.
     */
    replaceState(newState) {
        for (const key in newState) {
            this.set(key, newState[key]);
        }
    },
};
