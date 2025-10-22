import { AppConfig } from '../config/AppConfig.js';
import { AppState } from '../state/AppState.js';
import { Logger } from '../utils/Logger.js';
import { PerformanceOptimizer } from '../utils/Performance.js';

/**
 * RENDERIZADO DE TODOS LOS PRODUCTOS
 */
export function renderAllProducts() {
    Logger.info("Renderizando todos los productos..."); // [33]
    AppState.filteredProducts = [...AppState.products];
    renderFilteredProducts(); // [33]
    // La actualización de estadísticas se hará en main.js o UIUpdates.js
}

/**
 * RENDERIZADO DE PRODUCTOS FILTRADOS
 */
export function renderFilteredProducts() {
    const container = document.querySelector(AppConfig.selectors.cardContainer); // [33]
    const loadingElement = document.querySelector(AppConfig.selectors.loadingElement);
    const emptyState = document.querySelector(AppConfig.selectors.emptyState); // [34]

    // Ocultar loading
    if (loadingElement) {
        loadingElement.classList.add(AppConfig.classes.hidden);
    }

    // Mostrar estado vacío si no hay productos
    if (AppState.filteredProducts.length === 0) {
        if (emptyState) {
            emptyState.classList.remove(AppConfig.classes.hidden);
        }
        container.innerHTML = ""; // [34]
        return;
    }

    // Ocultar estado vacío [34]
    if (emptyState) {
        emptyState.classList.add(AppConfig.classes.hidden);
    }

    // Generar y renderizar tarjetas [35]
    const fragment = document.createDocumentFragment();
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = AppState.filteredProducts.map(product => createProductCard(product)).join("");

    while (tempContainer.firstChild) {
        fragment.appendChild(tempContainer.firstChild);
    }

    container.innerHTML = "";
    container.appendChild(fragment);

    PerformanceOptimizer.initLazyLoading(); // [35]
    Logger.info(`✅ ${AppState.filteredProducts.length} productos renderizados`); // [35]
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
    const isNew = product.tags && product.tags.includes("nuevo");

    // Determinar clases CSS
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

            ${isNew ? '<span class="card__new-badge" aria-label="Producto nuevo">🆕 Nuevo</span>' : ""}
        
        <!-- Contenedor de imagen -->
        <div class="card__image-container">
            <img data-src="${product.image}"
                alt="${product.title}"
                class="card__image loading"
                loading="lazy"
                decoding="async">

            <!-- Badge de categoría -->
            <span class="card__badge" aria-label="Categoría: ${product.category}">
                ${getCategoryIcon(product.category)}
            </span>

            <!-- Badge de descuento -->
            ${hasDiscount ? `
                <span class="card__discount" aria-label="Descuento del ${discountPercent}%">
                    -${discountPercent}%
                </span>
                ` : ""}
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
                        ` : ""}
                        <span class="card__price" aria-label="Precio: €${product.price.toFixed(2)}">
                            €${product.price.toFixed(2)}
                        </span>
                </div>

                <div class="stock-info">
                    <span class="stock-badge ${isOutOfStock ? "out-of-stock" : "in-stock"}">
                        ${isOutOfStock ? "❌ Agotado" : `✅ ${product.stock} en stock`}
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

    return (
        "⭐".repeat(fullStars) + (hasHalfStar ? "✨" : "") + "☆".repeat(emptyStars)
    );
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
    const categoryData = AppState.categories.find((cat) => cat.id === category);
    return categoryData?.icon || "📦";
}

/**
 * MOSTRAR SKELETON LOADING
 */
export function showSkeletonLoading() {
    const container = document.querySelector(AppConfig.selectors.cardContainer);
    if (!container) return; // [41]
    const skeletonCount = 8;
    const skeletonsHTML = Array.from({ length: skeletonCount }, () => `
        <div class="card__image-container skeleton skeleton-image"></div>
            <div class="card__content">
                <div class="skeleton skeleton-text skeleton-text--short"></div>
                <div class="skeleton skeleton-text skeleton-text--medium"></div>
                <div class="skeleton skeleton-text" style=width: 40%></div>
            </div>
            <div class="card__footer">
                <div class="skeleton skeleton-text" style="width: 30%"></div>
                <div class="skeleton skeleton-text" style="width: 20%"></div>
            </div>
        </div>
    `).join(""); // [42]
    container.innerHTML = skeletonsHTML;
}