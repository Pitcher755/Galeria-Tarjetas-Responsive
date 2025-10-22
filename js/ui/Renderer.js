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
 */
export function createProductCard(product) {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price; // [36]
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0; // [36, 37]
    const isOutOfStock = product.stock === 0;
    const isNew = product.tags && product.tags.includes("nuevo"); // [37]

    // Determinar clases CSS
    const cardClasses = [
        AppConfig.classes.card,
        product.featured ? AppConfig.classes.featured : "",
        isOutOfStock ? AppConfig.classes.outOfStock : ""
    ].filter(Boolean).join(" "); // [37]

    // Retorna el HTML de la tarjeta [37, 38]
    return `
        <article class="${cardClasses}" data-category="${product.category}" data-id="${product.id}" aria-labelledby="product-title-${product.id}">
            ${isNew ? '<span class="card__tag--new">🆕 Nuevo</span>' : ""}
            <div class="card__image-wrapper">
                <img src="./assets/placeholder.jpg" data-src="${product.image}" alt="${product.title}" class="card__image loading" loading="lazy" decoding="async">
            </div>
            <div class="card__category-icon">
                ${getCategoryIcon(product.category)}
            </div>
            ${hasDiscount ? `<span class="card__discount">-${discountPercent}%</span>` : ""}
            <h3 id="product-title-${product.id}" class="card__title">${product.title}</h3>
            <p class="card__description">${product.description}</p>
            <div class="card__rating" aria-label="Calificación de ${product.rating} estrellas">
                <span class="card__stars">${generateStarRating(product.rating)}</span>
                <span class="card__review-count">${product.rating} (${product.reviewCount} reseñas)</span>
            </div>
            <div class="card__pricing">
                ${hasDiscount ? `<span class="card__price--original">€${product.originalPrice.toFixed(2)}</span>` : ""}
                <span class="card__price">€${product.price.toFixed(2)}</span>
            </div>
            <div class="card__stock">
                ${isOutOfStock ? "❌ Agotado" : `✅ ${product.stock} en stock`}
            </div>
        </article>
    `;
}

/**
 * GENERACIÓN DE RATING CON ESTRELLAS
 */
export function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
        "⭐".repeat(fullStars) + (hasHalfStar ? "✨" : "") + "☆".repeat(emptyStars)
    ); // [39]
}

/**
 * OBTENCIÓN DE ICONO DE CATEGORÍA
 */
export function getCategoryIcon(category) {
    const categoryData = AppState.categories.find((cat) => cat.id === category);
    return categoryData?.icon || "📦"; // [40]
}

/**
 * MOSTRAR SKELETON LOADING
 */
export function showSkeletonLoading() {
    const container = document.querySelector(AppConfig.selectors.cardContainer);
    if (!container) return; // [41]
    const skeletonCount = 8;
    const skeletonsHTML = Array.from({ length: skeletonCount }, () => `
        <div class="card skeleton">
            <div class="skeleton__image"></div>
            <div class="skeleton__title"></div>
            <div class="skeleton__text"></div>
            <div class="skeleton__price"></div>
        </div>
    `).join(""); // [42]
    container.innerHTML = skeletonsHTML;
}