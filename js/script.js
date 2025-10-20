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
        gallerySummary: '#gallery-summary',
        searchInput: '#product-search',
        filterStatus: '#filter-status',
        clearFilters: '#clear-filters',
        filterStats: '#filter-stats'
    },

    classes: {
        hidden: 'hidden',
        active: 'active',
        card: 'card',
        filterBtn: 'filter-btn',
        featured: 'card--featured',
        outOfStock: 'card--out-of-stock',
        filterActive: 'filter-active',
        filterTag: 'filter-tag',
        filterCount: 'filter-count'
    },

    filters: {
        statusOptions: [
            { id: 'featured', name: '⭐ Destacados', icon: '⭐' },
            { id: 'new', name: '🆕 Nuevos', icon: '🆕' },
            { id: 'discount', name: '💸 En oferta', icon: '💸' }
        ],
        tagOptions: [
            { id: 'popular', name: '🔥 Populares', icon: '🔥' },
            { id: 'nuevo', name: '🎉 Nuevo', icon: '🎉' },
            { id: 'oferta', name: '💰 Oferta', icon: '💰' }
        ]
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
 * SISTEMA DE FILTRADO AVANZADO
 * @type {Object}
 * @property {string} currentCategory - Categoría activa actual
 * @property {string} searchQuery - Término de búsqueda actual
 * @property {Object} activeFilters - Filtros activos por tipo
 * @property {boolean} showOutOfStock - Mostrar productos agotados
 */
const FilterSystem = {
    currentCategory: 'all',
    searchQuery: '',
    activeFilters: {
        status: [],
        tags: []
    },
    showOutOfStock: true,

    /**
     * APLICAR TODOS LOS FILTROS COMBINADOS
     * 
     * @param {Array} products - Lista de productos a filtrar
     * @returns {Array} Productos filtrados
     */
    applyAllFilters(products) {
        return products.filter(product => {
            return this.matchesCategory(product) &&
                this.matchesSearch(product) &&
                this.matchesStatusFilters(product) &&
                this.matchesTagFilters(product) &&
                this.matchesStockFilter(product);
        });
    },

    /**
     * FILTRAR POR CATEGORÍA
     * 
     * @param {Object} product - Producto a evaluar
     * @returns {boolean} Si coincide con la categoría
     */
    matchesCategory(product) {
        return this.currentCategory === 'all' || product.category === this.currentCategory;
    },

    /**
     * FILTRAR POR BÚSQUEDA DE TEXTO
     * @param {Object} product - Producto a evaluar
     * @returns {boolean} Si coincido con la búsqueda
     */
    matchesSearch(product) {
        if (!this.searchQuery.trim()) return true;

        const searchTerm = this.searchQuery.toLowerCase();
        return product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
    },

    /**
     * FILTRAR POR ESTADO (destacado, nuevo, etc.)
     * 
     * @param {Object} product - Producto a evaluar
     * @returns {boolean} Si coincide con los filtros de estado
     */
    matchesStatusFilters(product) {
        if (this.activeFilters.status.length === 0) return true;

        return this.activeFilters.status.some(status => {
            switch (status) {
                case 'featured':
                    return product.featured === true;
                    break;
                case 'new':
                    return product.tags && product.tags.includes('nuevo');
                    break;
                case 'discount':
                    return product.originalPrice && product.originalPrice > product.price;
                    break;
                default:
                    return true;
                    break;
            }
        });
    },

    /**
     * FILTRAR POR ETIQUETAS
     * 
     * @param {Object} product - Producto a evaluar
     * @returns {boolean} Si coincide con las etiquetas
     */
    matchesTagFilters(product) {
        if (this.activeFilters.tags.length === 0) return true;

        return this.activeFilters.tags.some(tag =>
            product.tags && product.tags.includes(tag)
        );
    },

    /**
     * FILTRAR POR DISPONIBILIDAD
     * 
     * @param {Object} product - Producto a evaluar
     * @returns {boolean} Si coincide con el filtro de stock
     */
    matchesStockFilter(product) {
        return this.showOutOfStock || product.stock > 0;
    },

    /**
     * AGREGAR FILTRO
     * 
     * @param {string} type - Tipo de filtro (status, tags)
     * @param {string} value - Valor del filtro
     */
    addFilter(type, value) {
        if (!this.activeFilters[type].includes(value)) {
            this.activeFilters[type].push(value);
        }
    },

    /**
     * REMOVER FILTRO
     * 
     * @param {string} type - Tipo de filtro
     * @param {string} value - Valor del filtro
     */
    removeFilter(type, value) {
        this.activeFilters[type] = this.activeFilters[type].filter(item => item !== value);
    },

    /**
     * LIMPIAR TODOS LOS FILTROS
     */
    clearAllFilters() {
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.activeFilters = { status: [], tags: [] };
        this.showOutOfStock = true;
    },

    /**
     * OBTENER ESTADÍSTICAS DE FILTROS
     * 
     * @returns {Object} Estadísticas de los filtros activos
     */
    getFilterStats() {
        return {
            category: this.currentCategory !== 'all',
            search: this.searchQuery.trim() !== '',
            status: this.activeFilters.status.length,
            tags: this.activeFilters.tags.length,
            stock: !this.showOutOfStock,
            total: (this.currentCategory !== 'all' ? 1 : 0) +
                (this.searchQuery.trim() !== '' ? 1 : 0) +
                this.activeFilters.status.length +
                this.activeFilters.tags.length +
                (!this.showOutOfStock ? 1 : 0)
        };
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
 * INICIALIZACIÓN DEL SISTEMA DE FILTRADO MEJORADO
 * 
 * @function initializeFilters
 * @description Configura y renderiza los botones de filtro
 * @returns {void}
 */
function initializeFilters() {
    Logger.info('Inicializando sistema de filtros...');

    initializeCategoryFilters();
    initializeSearchFilter();
    initializeStatusFilters();
    initializeActiveFiltersDisplay();

    Logger.info('✅ Sistema de filtros avanzado inicializado');
}

/**
 * INICIALIZAR FILTROS POR CATEGORÍA
 * 
 * @function initializeCategoryFilters
 * @description Configura los filtros por categoría
 * @returns {void}
 */
function initializeCategoryFilters() {
    const filtersContainer = document.querySelector(AppConfig.selectors.filtersContainer);

    if (!filtersContainer) {
        Logger.warn('Contenedor de filtros no encontrado');
        return;
    }

    const filterButtonHTML = AppState.categories.map(category => `
        <button class="filter-btn ${category.id === 'all' ? AppConfig.classes.active : ''}"
                data-category="${category.id}"
                data-filter-type="category"
                aria-pressed="${category.id === 'all' ? 'true' : 'false'}">
            <span aria-hidden="true">${category.icon}</span>
            ${category.name}
        </button>
        `).join('');

    filtersContainer.innerHTML = filterButtonHTML;

    const filterButtons = filtersContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleCategoryFilterClick);
    });
}

/**
 * INICIALIZAR SISTEMA DE BÚSQUEDA
 * 
 * @function initializeSearchFilter
 * @description Configura el filtro de búsqueda en tiempo real
 * @returns {void}
 */
function initializeSearchFilter() {
    const searchInput = document.querySelector(AppConfig.selectors.searchInput);

    if (!searchInput) {
        Logger.warn('Campo de búsqueda no encontrado');
        return;
    }

    // Habilitar el campo de búsqueda
    searchInput.disabled = false;
    searchInput.placeholder = "🔎 Buscar productos...";

    // Búsqueda en tiempo real con debounce
    let searchTimeout;
    searchInput.addEventListener('input', (event) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            FilterSystem.searchQuery = event.target.value.trim();
            applyAllFiltersAndRender();
            Logger.info(`🔍 Búsqueda: "${FilterSystem.searchQuery}"`);
        }, 300);
    });

    // Limpiar búsqueda con Escape
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.target.value = '';
            FilterSystem.searchQuery = '';
            applyAllFiltersAndRender();
        }
    });
}

/**
 * INICIALIZAR FILTROS DE ESTADO Y ETIQUETAS
 * 
 * @function initializeStatusFilters
 * @description Configura los filtros adicionales (destacados, nuevos, etc.)
 * @returns {void}
 */
function initializeStatusFilters() {
    const filterStatusContainer = document.querySelector(AppConfig.selectors.filterStatus);

    if (!filterStatusContainer) {
        Logger.warn('Contenedor de filtros de estado no encontrado');
        return;
    }

    // Crear filtros de estado
    const statusFiltersHTML = `
        <div class="filter-group">
            <h4 class="filter-group-title">Estado</h4>
            <div class="filter-options">
                ${AppConfig.filters.statusOptions.map(filter => `
                    <label class="filter-checkbox">
                        <input type="checkbox"
                            value="${filter.id}"
                            data-filter-type="status">
                        <span class="filter-label">
                            <span aria-hidden="true">${filter.icon}</span>
                            ${filter.name}
                        </span>
                    </label>
                    `).join('')}
            </div>
        </div>
        
        <div class="filter-group">
            <h4 class="filter-group-title">🏷️ Etiquetas</h4>
            <div class="filter-options">
                ${AppConfig.filters.tagOption.map(filter => `
                    <label class="filter-checkbox">
                        <input type="checkbox"
                            value="${filter.id}"
                            data-filter-type="tags">
                        <span class="filter-label">
                            <span aria-hidden="true">${filter.icon}</span>
                            ${filter.name}
                        </span>
                    </label>
                    `).join('')}
            </div>
        </div>
        
        <div class="filter-group">
            <h4 class="filter-group-title">📦 Disponibilidad</h4>
            <div class="filter-options">
                <label class="filter-checkbox">
                    <input type="checkbox"
                        id="hide-out-of-stock"
                        ${!FilterSystem.showOutOfStock ? 'checked' : ''}>
                    <span class="filter-label">
                        <span aria-hidden="true">✅</span>
                        Solo productos en stock
                    </span>
                </label>
            </div>
        </div>
    `;

    filterStatusContainer.innerHTML = statusFiltersHTML;

    // Event listenners para checkboxes
    const checkboxes = filterStatusContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxFilterChange);
    });
}

/**
 * INICIALIZAR VISUALIZACIÓN DE FILTROS ACTIVOS
 * 
 * @function initializeActiveFiltersDisplay
 * @description Configura la visualización de filtros activos
 * @returns {void}
 */
function initializeActiveFiltersDisplay() {
    const clearFiltersBtn = document.querySelector(AppConfig.selectors.clearFilters);

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', handleClearAllFilters);
    }

    // Actualizar visualización inicial
    updateActiveFiltersDisplay();
}

/**
 * MANEJO DE CLIC EN FILTROS DE CATEGORÍA
 * 
 * @function handleCategoryFilterClick
 * @description Maneja el evento click en los botones de categoría
 * @param {Event} event - Evento click
 * @returns {void}
 */
function handleCategoryFilterClick(event) {
    const button = event.target.closest('.filter-btn');
    if (!button) return;

    const category = button.dataset.category;

    // Actualizar sistema de filtros
    FilterSystem.currentCategory = category;

    // Actualizar interfaz
    updateCategoryFilterButtons(button);

    // Aplicar filtros y renderizar
    applyAllFiltersAndRender();

    Logger.info(`📂 Filtro de categoría aplicado: ${category}`);
}

/**
 * MANEJO DE CAMBIO DE CHECKBOXES DE FILTRO
 * 
 * @function handleCheckboxFilterChange
 * @description Maneja los cambios en los checkboxes de filtro
 * @param {Event} event - Evento change
 * @returns {void}
 */
function handleCheckboxFilterChange(event) {
    const checkbox = event.target;
    const filterType = checkbox.dataset.filterType;
    const value = checkbox.value;

    if (filterType) {
        // Filtros de estado o etiquetas
        if (checkbox.checked) {
            FilterSystem.addFilter(filterType, value);
        } else {
            FilterSystem.removeFilter(filterType, value);
        }
    } else if (checkbox.id === 'hide-out-of-stock') {
        // Filtro de disponibilidad
        FilterSystem.showOutOfStock = !checkbox.checked;
    }

    applyAllFiltersAndRender();
    updateActiveFiltersDisplay();

    Logger.info(`✅ Filtro ${checkbox.checked ? 'activado' : 'desactivado'}: ${value || 'stock'}`);
}

/**
 * MANEJO DE LIMPIEZA DE TODOS LOS FILTROS
 * 
 * @function handleClearAllFilters
 * @description Limpia todos los filtros activos
 * @returns {void}
 */
function handleClearAllFilters() {
    FilterSystem.clearAllFilters();

    // Resetear interfaz
    resetFilterUI();
    applyAllFiltersAndRender();
    updateActiveFiltersDisplay();

    Logger.info('🗑️ Todos los filtros han sido limpiados');
}

/**
 * APLICAR TODOS LOS FILTROS Y RENDERIZAR
 * 
 * @function applyAllFiltersAndRender
 * @description Aplica todos los filtros y actualiza la vista
 * @returns {void}
 */
function applyAllFiltersAndRender() {
    AppState.filteredProducts = FilterSystem.applyAllFilters(AppState.products);
    renderFilteredProducts();
    updateStatistics();
    updateFilterStats();
}

/**
 * ACTUALIZAR ESTADÍSTICAS DE FILTROS
 * 
 * @function updateFilterStats
 * @description Actualiza el contador de filtros activos
 * @returns {void}
 */
function updateFilterStats() {
    const filterStats = document.querySelector(AppConfig.selectors.filterStats);
    const clearFiltersBtn = document.querySelector(AppConfig.selectors.clearFilters);
    const filterStatsData = FilterSystem.getFilterStats();

    if (filterStats) {
        filterStats.textContent = filterStatsData.total > 0 ?
            `${filterStatsData.total} filtro(s) activo(s)` :
            'Sin filtros activos';
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.style.display = filterStatsData.total > 0 ? 'block' : 'none';
    }
}

/**
 * ACTUALIZAR BOTONES DE FILTRO DE CATEGORÍA
 * 
 * @function updateCategoryFilterButtons
 * @description Actualiza el estado visual de los botones de categoría
 * @param {HTMLElement} activeButton - Botón activo actualmente
 * @returns {void}
 */
function updateCategoryFilterButtons(activeButton) {
    const allButtons = document.querySelectorAll('[data-filter-type="category"]');

    allButtons.forEach(button => {
        const isActive = button === activeButton;
        button.classList.toggle(AppConfig.classes.active, isActive);
        button.setAttribute('aria-pressed', isActive.toString());
    });
}

/**
 * RESETEAR INTERFAZ DE FILTROS
 * 
 * @function resetFiltersUI
 * @description Restablece la interfaz de usuario de filtros a su estado inicial
 * @returns {void}
 */
function resetFiltersUI() {
    // Resetear botones de categoría
    const categoryButtons = document.querySelectorAll('[data-filter-type="category"]');
    categoryButtons.forEach(button => {
        const isAll = button.dataset.category === 'all';
        button.classList.toggle(AppConfig.classes.active, isAll);
        button.setAttribute('aria-pressed', isAll.toString());
    });

    // Resetear checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Resetear búsqueda
    const searchInput = document.querySelector(AppConfig.selectors.searchInput);
    if (searchInput) {
        searchInput.value = '';
    }
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

/**
 * ACTUALIZAR VISUALIZACIÓN DE FILTROS ACTIVOS
 * 
 * @function updateActiveFiltersDisplay
 * @description Actualiza la visualización de filtros activos
 * @returns {void}
 */
function updateActiveFiltersDisplay() {
    // Esta función se implementará en mejoras futuras
    Logger.info('Actualizando visualización de filtros activos');
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