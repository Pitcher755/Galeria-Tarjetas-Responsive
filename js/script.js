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
 * @property {object} endpoints - URLs para obtener datos
 */
const AppConfig = {
    version: '1.0.0',
    debugMode: true,

    selectors: {
        cardContainer: '#card-container',
        filtersContainer: '#filters-container',
        loadingElement: '#loading',
        emptyState: '#empty-state',
        resetFilters: '#reset-filters',
        totalProducts: '#total-products',
        visibleProducts: '#visible-products',
        gallerySummary: '#gallery-summary'
    },

    classes: {
        hidden: 'hidden',
        active: 'active',
        card: 'card',
        filterBtn: 'filter-btn',
        featured: 'card--featured',
        outOfStock: 'card--out-of-stock'
    },

    endpoints: {
        products: './data/cards.json'
    }
};

/**
 * ESTADO GLOBAL DE LA APLICACIÓN
 * @type {Object}
 * @property {Array} products - Lista de todos los productos
 * @property {Array} categories - Lista de categorías disponibles
 * @property {Array} filteredProducts - Productos filtrados actualmente
 * @property {String} currentFilter - Filtro activo actual
 */
const AppState = {
    products: [],
    categories: [],
    filteredProducts: [],
    currentFilter: 'all'
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
            console.warn(`⚠️ [warn]: ${message}`, data || '');
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
async function initApp() {
    Logger.info('Inicializando aplicación...');

    try {
        if (!validateDOMElements()) {
            throw new Error('Elementos del DOM requeridos no encontrados');
        }

        // Mostrar estado de carga
        showLoadingState();

        // Cargar datos e inicializar componentes
        await loadProductData();
        initializeFilters();
        renderAllProducts();

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
    const requiredSelectors = Object.values(AppConfig.selectors);

    const missingElements = requiredSelectors.filter(selector => {
        return !document.querySelector(selector);
    });

    if (missingElements.length > 0) {
        Logger.warn(`Elementos DOM no encontrados: ${missingElements.join(', ')}`);
        return false;
    }

    return true;
}

/**
 * CARGA DE DATOS DE PRODUCTOS
 * 
 * @async
 * @function loadProductData
 * @description Carga los datos de productos desde el archivo JSON
 * @returns {Promise<void>}
 */
async function loadProductData() {
    Logger.info('📥 Cargando datos de productos...');

    try {
        const response = await fetch(AppConfig.endpoints.products);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Validar estructura de datos
        if (!data.products || !Array.isArray(data.products)) {
            throw new Error(`Estructura de datos inválida`);
        }

        // Actualizar estado global
        AppState.products = data.products;
        AppState.categories = data.categories || [];
        AppState.filteredProducts = [...data.products];

        Logger.info(`${data.products.length} productos cargados correctamente`);
        Logger.info(`${data.categories?.length || 0} categorías cargadas`);

    } catch (error) {
        Logger.error('Error cargando datos de productos:', error);
        throw new Error('No se pudieron cargar los productos. Verifica la conexión.');
    }
}

/**
 * INICIALIZACIÓN DEL SISTEMA DE FILTRADO
 * 
 * @function initializeFilters
 * @description Configura y renderiza los botones de filtro
 * @returns {void}
 */
function initializeFilters() {
    Logger.info('Inicializando sistema de filtros...');

    const filtersContainer = document.querySelector(AppConfig.selectors.filtersContainer);

    if (!filtersContainer) {
        Logger.warn('Contenedor de filtros no encontrado');
        return;
    }

    // Generar botones de filtro
    const filterButtonsHTML = AppState.categories.map(category => `
        <button class="filter-btn ${category.id === 'all' ? AppConfig.classes.active : ''}"
            data-category="${category.id}"
            aria-pressed="${category.id === 'all' ? 'true' : 'false'}">
            <span aria-hidden="true">${category.icon}</span>
            ${category.name}
        </button>
        `).join('');

    filtersContainer.innerHTML = filterButtonsHTML;

    // Agregar event listeners a los botones
    const filterButtons = filtersContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });

    // Configurar botón de reset
    const resetButton = document.querySelector(AppConfig.selectors.resetFilters);
    if (resetButton) {
        resetButton.addEventListener('click', () => handleFilterClick({ target: document.querySelector('[data-category="all"]') }));
    }

    Logger.info(`${filterButtons.length} botones de filtro inicializados`);
}

/**
 * MANEJO DE CLIC EN FILTROS
 * 
 * @function handleFilterClick
 * @description Maneja el evento click en los botones de filtro
 * @param {Event} event - Evento click
 * @returns {void}
 */
function handleFilterClick(event) {
    const button = event.target.closest('.filter-btn');
    if (!button) return;

    const category = button.dataset.category;

    // Actualizar estado del filtro
    AppState.currentFilter = category;

    // Actualizar interfaz de filtros
    updateFilterButtons(button);

    // Aplicar filtro y renderizar
    applyFilter(category);

    Logger.info(`Filtro aplicado: ${category}`);
}

/**
 * ACTUALIZACIÓN DE BOTONES DE FILTRO
 * 
 * @function updateFilterButtons
 * @description Actualiza el estado visual de los botones de filtro
 * @param {HTMLElement} activeButton - Botón activo actualmente
 * @returns {void}
 */
function updateFilterButtons(activeButton) {
    const allButtons = document.querySelectorAll('.filter-btn');

    allButtons.forEach(button => {
        const isActive = button === activeButton;
        button.classList.toggle(AppConfig.classes.active, isActive);
        button.setAttribute('aria-pressed', isActive.toString());
    });
}

/**
 * APLICACIÓN DE FILTRO A PRODUCTOS
 * 
 * @function applyFilter
 * @description Filtra los productos según la categoría seleccionada
 * @param {string} category - Categoría a filtrar
 * @returns {void}
 */
function applyFilter(category) {
    if (category === 'all') {
        AppState.filteredProducts = [...AppState.products];
    } else {
        AppState.filteredProducts = AppState.products.filter(product =>
            product.category === category
        );
    }

    // Renderizar productos filtrados
    renderFilteredProducts();

    // Actualizar estadísticas
    updateStatistics();
}

/**
 * RENDERIZADO DE TODOS LOS PRODUCTOS
 * 
 * @function renderAllProducts
 * @description Renderiza todos los productos en la galería
 * @returns {void}
 */
function renderAllProducts() {
    Logger.info('Renderizando todos los productos...');
    AppState.filteredProducts = [...AppState.products];
    renderFilteredProducts();
    updateStatistics();
}

/**
 * RENDERIZADO DE PRODUCTOS FILTRADOS
 * 
 * @function renderFilteredProducts
 * @description Renderiza los productos filtrados en la galería
 * @returns {void}
 */
function renderFilteredProducts() {
    const container = document.querySelector(AppConfig.selectors.cardContainer);
    const loadingElement = document.querySelector(AppConfig.selectors.loadingElement);
    const emptyState = document.querySelector(AppConfig.selectors.emptyState);

    // Ocultar loading
    if (loadingElement) {
        loadingElement.classList.add(AppConfig.classes.hidden);
    }

    // Mostrar estado vacío si no hay productos
    if (AppState.filteredProducts.length === 0) {
        if (emptyState) {
            emptyState.classList.remove(AppConfig.classes.hidden);
        }
        container.innerHTML = '';
        return;
    }

    // Ocultar estado vacío
    if (emptyState) {
        emptyState.classList.add(AppConfig.classes.hidden);
    }

    // Generar y renderizar tarjetas
    const cardsHTML = AppState.filteredProducts.map(product => createProductCard(product)).join('');
    container.innerHTML = cardsHTML;

    Logger.info(`${AppState.filteredProducts.length} productos renderizados`);
}

/**
 * CREACIÓN DE TARJETA DE PRODUCTO
 * 
 * @function createProductCard
 * @description Crea el HTML para una tarjeta de producto
 * @param {Object} product - Datos del producto
 * @param {number} product.id - ID único del producto
 * @param {string} product.title - Título del producto
 * @param {string} product.category - Categoría del producto
 * @param {number} product.price - Precio actual
 * @param {number} [product.originalPrice] - Precio original
 * @param {string} product.description - Descripción del producto
 * @param {string} product.image - URL de la imagen
 * @param {number} product.rating - Calificación del producto
 * @param {number} product.reviewCount - Número de reseñas
 * @param {number} product.stock - Cantidad en stock
 * @param {boolean} product.featured - Si es producto destacado
 * @returns {string} HTML de la tarjeta
 */
function createProductCard(product) {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const isOutOfStock = product.stock === 0;

    // Determinar clases CSS
    const cardClasses = [
        AppConfig.classes.card,
        product.featured ? AppConfig.classes.featured : '',
        isOutOfStock ? AppConfig.classes.outOfStock : ''
    ].filter(Boolean).join(' ');

    return `
    <article class="${cardClasses}"
            data-category="${product.category}"
            data-id="${product.id}"
            aria-labelledby="product-title-${product.id}">
        
        <!-- Contenedor de imagen -->
        <div class="card__image-container">
            <img src="${product.image}"
                alt="${product.title}"
                class="card__image"
                loading="lazy">

            <!-- Badge de categoría -->
            <span class="card__badge" aria-label="Categoría: ${product.category}">
                ${getCategoryIcon(product.category)}
            </span>

            <!-- Badge de descuento -->
            ${hasDiscount ? `
                <span class="card__discount" aria-label="Descuento del ${discountPercent}%">
                    -${discountPercent}%
                </span>
                ` : ''}
        </div>
        
        <!-- Contenido de la tarjeta -->
        <div class="card__content">
            <h3 class="card__title" id="product-title-${product.id}">
                ${product.title}
            </h3>

            <p class="card__description">
                ${product.description}
            </p>

            <!-- Rating -->
            <div class="card__rating" aria-label="Calificación: ${product.rating} de 5 estrellas">
                <span class="rating__stars" aria-hidden="true">
                    ${generateStarRating(product.rating)}
                </span>
                <span class="rating__text">
                    ${product.rating} (${product.reviewCount} reseñas)
                </span>
            </div>
        </div>
        
        <!-- Pie de tarjeta -->
        <div class="card__footer">
                <div class="price-container">
                    ${hasDiscount ? `
                        <span class="card__original-price" aria-hidden="true">
                            €${product.originalPrice.toFixed(2)}
                        </span>
                        ` : ''}
                        <span class="card__price" aria-label="Precio: €${product.price.toFixed(2)}">
                            €${product.price.toFixed(2)}
                        </span>
                </div>

                <div class="stock-info">
                        <span class="stock-badge ${isOutOfStock ? 'out-of-stock' : 'in-stock'}">
                            ${isOutOfStock ? '❌ Agotado' : `✅ ${product.stock} en stock`}
                        </span>
                </div>
            </div>
        </article>
    `;
}

/**
 * GENERACIÓN DE RATING CON ESTRELLAS
 * 
 * @function generateStarRating
 * @description Genera el HTML para mostrar el rating con estrellas
 * @param {number} rating - Calificación del producto (0-5)
 * @returns {string} HTML de las estrellas
 */
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '⭐'.repeat(fullStars) +
        (hasHalfStar ? '✨' : '') +
        '☆'.repeat(emptyStars);
}

/**
 * OBTENCIÓN DE ICONO DE CATEGORÍA
 * 
 * @function getCategoryIcon
 * @description Devuelve el icono correspondiente en una categoría
 * @param {string} category - ID de la categoría
 * @returns {string} Icono de la categoría
 */
function getCategoryIcon(category) {
    const categoryData = AppState.categories.find(cat => cat.id === category);
    return categoryData?.icon || '📦';
}

/**
 * ACTUALIZACIÓN DE ESTADÍSTICAS
 * 
 * @function updateStatistics
 * @description Actualiza las estadísticas mostradas en la interfaz
 * @returns {void}
 */
function updateStatistics() {
    const totalElement = document.querySelector(AppConfig.selectors.totalProducts);
    const visibleElement = document.querySelector(AppConfig.selectors.visibleProducts);
    const summaryElement = document.querySelector(AppConfig.selectors.gallerySummary);

    if (totalElement) {
        totalElement.textContent = AppState.products.length;
    }

    if (visibleElement) {
        visibleElement.textContent = AppState.filteredProducts.length;
    }

    if (summaryElement) {
        summaryElement.innerHTML = `
            Mostrando <strong>${AppState.filteredProducts.length}</strong>
            de <strong>${AppState.products.length}</strong> productos
        `;
    }
}

/**
 * MOSTRAR ESTADO DE CARGA
 * 
 * @function showLoadingState
 * @description Muestra el estado de carga en la interfaz
 * @returns {void}
 */
function showLoadingState() {
    const loadingElement = document.querySelector(AppConfig.selectors.loadingElement);
    const emptyState = document.querySelector(AppConfig.selectors.emptyState);

    if (loadingElement) {
        loadingElement.classList.remove(AppConfig.classes.hidden);
    }

    if (emptyState) {
        emptyState.classList.add(AppConfig.classes.hidden);
    }
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
    const loadingElement = document.querySelector(AppConfig.selectors.loadingElement);

    if (loadingElement) {
        loadingElement.classList.add(AppConfig.classes.hidden);
    }

    if (container) {
        container.innerHTML = `
            <div class="error-message" role="alert" aria-live="assertive">
                <p> ${message}</p>
                <button onclick="window.location.reload()" class="retry-btn">
                    Reintentar
                </button>
            </div>
        `;
    }
}

// EVENTO DE INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO
document.addEventListener('DOMContentLoaded', initApp);

// EXPORTACIÓN PARA USO EN MÓDULOS (futura escalabilidad)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppConfig,
        AppState,
        Logger,
        initApp
    };
}