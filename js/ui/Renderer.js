import { AppConfig } from '../config/AppConfig.js';
import { AppState } from '../state/AppState.js';
import { Logger } from '../utils/Logger.js';
import { PerformanceOptimizer } from '../utils/Performance.js';

/**
 * @file Renderer.js
 * @description Funciones encargadas de generar HTML y renderizar la galería.
 */

/**
 * @function renderAllProducts
 * @description Inicializa la lista de productos filtrados con todos los productos y renderiza.
 * @returns {void}
 */
export function renderAllProducts() {
    Logger.info("Renderizando todos los productos...");
    AppState.filteredProducts = [...AppState.products];
    renderFilteredProducts();
}

/**
 * @function renderFilteredProducts
 * @description Renderiza los productos actualmente en AppState.filteredProducts.
 * @returns {void}
 */
export function renderFilteredProducts() {
    const container = document.querySelector(AppConfig.selectors.cardContainer);
    const loadingElement = document.querySelector(AppConfig.selectors.loadingElement);
    const emptyState = document.querySelector(AppConfig.selectors.emptyState);

    if (loadingElement) {
        loadingElement.classList.add(AppConfig.classes.hidden);
    }

    if (AppState.filteredProducts.length === 0) {
        if (emptyState) {
            emptyState.classList.remove(AppConfig.classes.hidden);
        }
        container.innerHTML = "";
        return;
    }

    if (emptyState) {
        emptyState.classList.add(AppConfig.classes.hidden);
    }

    const fragment = document.createDocumentFragment();
    const tempContainer = document.createElement('div');

    // Usar la función helper para crear las tarjetas
    tempContainer.innerHTML = AppState.filteredProducts.map(product => createProductCard(product)).join("");

    while (tempContainer.firstChild) {
        fragment.appendChild(tempContainer.firstChild);
    }

    container.innerHTML = "";
    container.appendChild(fragment);

    PerformanceOptimizer.initLazyLoading();
    Logger.info(`✅ ${AppState.filteredProducts.length} productos renderizados`);
}

/**
 * @function createProductCard
 * @description Crea el HTML para una tarjeta de producto.
 * @param {Object} product - Datos del producto
 * @param {number} product.id
 * @param {string} product.title
 * @param {string} product.category
 * @param {number} product.price
 * @param {number} [product.originalPrice]
 * @param {string} product.description
 * @param {string} product.image
 * @param {number} product.rating
 * @param {number} product.reviewCount
 * @param {number} product.stock
 * @param {boolean} product.featured
 * @returns {string} HTML de la tarjeta
 */
function createProductCard(product) {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    const isOutOfStock = product.stock === 0;
    const isNew = product.tags && product.tags.includes("nuevo");

    const cardClasses = [
        AppConfig.classes.card,
        product.featured ? AppConfig.classes.featured : "",
        isOutOfStock ? AppConfig.classes.outOfStock : ""
    ].filter(Boolean).join(" ");

    return `
        <article class="${cardClasses}" 
            data-category="${product.category}" 
            data-id="${product.id}" 
            aria-labelledby="product-title-${product.id}">
            
            <div class="card__image-container">
                ${isNew ? '<span class="card__new-badge">🆕 Nuevo</span>' : ""}
                ${product.featured ? '<span class="card__badge">⭐ Destacado</span>' : ""}
                <img 
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                    data-src="${product.image}" 
                    alt="${product.title}"
                    class="card__image loading"
                    loading="lazy"
                    decoding="async">
            </div>

            ${hasDiscount ? `<span class="card__discount">-${discountPercent}%</span>` : ""}

            <div class="card__content">
                <h3 id="product-title-${product.id}" class="card__title">
                    ${product.title}
                </h3>
                <p class="card__description">${product.description}</p>
                <div class="card__rating">
                    <span class="rating__stars">${generateStarRating(product.rating)}</span>
                    <span class="rating__text">${product.rating} (${product.reviewCount} reseñas)</span>
                </div>
            </div>

            <div class="card__footer">
                <div class="price-container">
                    ${hasDiscount ? `<span class="card__original-price">€${product.originalPrice.toFixed(2)}</span>` : ""}
                    <span class="card__price">€${product.price.toFixed(2)}</span>
                </div>
                <div class="stock-info ${isOutOfStock ? 'stock-badge out-of-stock' : 'stock-badge in-stock'}">
                    ${isOutOfStock ? "❌ Agotado" : `✅ ${product.stock} en stock`}
                </div>
            </div>
        </article>
    `;
}

/**
 * @function generateStarRating
 * @param {number} rating - Calificación del producto (0-5)
 * @returns {string} HTML de las estrellas
 */
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
        "⭐".repeat(fullStars) + (hasHalfStar ? "✨" : "") + "☆".repeat(emptyStars)
    );
}

/**
 * @function getCategoryIcon
 * @param {string} category - ID de la categoría
 * @returns {string} Icono de la categoría
 */
function getCategoryIcon(category) {
    const categoryData = AppState.categories.find((cat) => cat.id === category);
    return categoryData?.icon || "📦";
}

/**
 * @function showSkeletonLoading
 * @description Muestra esqueletos de carga mientras se cargan los productos.
 * @returns {void}
 */
export function showSkeletonLoading() {
    const container = document.querySelector(AppConfig.selectors.cardContainer);
    if (!container) return;

    const skeletonCount = 8;
    const skeletonsHTML = Array.from({ length: skeletonCount }, () => `
        <div class="card skeleton-card">
            <div class="skeleton-image skeleton"></div>
            <div class="card__content">
                <div class="skeleton-text skeleton skeleton-text--medium"></div>
                <div class="skeleton-text skeleton skeleton-text--short"></div>
                <div class="skeleton-text skeleton"></div>
            </div>
        </div>
    `).join("");

    container.innerHTML = skeletonsHTML;
}