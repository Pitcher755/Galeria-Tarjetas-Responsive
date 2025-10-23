# 🛍️ <span id="galeria-de-productos-responsive">Galería de Productos Responsive</span>

## 🔗 Navegación Rápida

**🇪🇸 [Ver en Español](#version-en-espanol)** | **🇺🇸 [Read in English](#english-version)**

-----

## 🇪🇸 <span id="version-en-espanol">Versión en Español</span>

### 📋 Descripción

Este proyecto **frontend** implementa una galería de productos interactiva y **responsive**. El código original, que era monolítico, ha sido completamente refactorizado y **modularizado** para garantizar la **escalabilidad** y **mantenibilidad** del proyecto a largo plazo.

El diseño de la aplicación se enfoca en la **Separación de Responsabilidades** (SoC), dividiendo la lógica de negocio, el estado, la interfaz de usuario y las utilidades en módulos independientes.

### 🛠️ Tecnologías Utilizadas

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![ES Modules](https://img.shields.io/badge/ES_Modules-6DA55F?style=for-the-badge&logo=javascript&logoColor=white)
![JSDoc](https://img.shields.io/badge/JSDoc-4E5A65?style=for-the-badge&logo=jsdoc&logoColor=white)
![Responsive Design](https://img.shields.io/badge/Responsive-Design-2C8EBB?style=for-the-badge&logo=web&logoColor=white)
![Web Accessibility](https://img.shields.io/badge/A11Y-Enabled-2C8EBB?style=for-the-badge&logo=accessibility&logoColor=white)

</div>

### 🎯 Características Destacadas

  * **Arquitectura JavaScript Modular (ES Modules):** El JS está estructurado en capas lógicas: `core/` (lógica de filtrado), `services/` (datos), `state/` (estado global), `ui/` (vista y eventos), y `utils/` (transversal).
  * **CSS Modular y Sostenible:** El CSS ha sido fragmentado en módulos por responsabilidad: `base/`, `layout/`, `components/` y `utilities/`, con `main.css` actuando como único punto de entrada para gestionar la cascada.
  * **Documentación Completa (JSDoc):** Todo el código JavaScript está rigurosamente documentado utilizando JSDoc, lo que facilita la comprensión de las funciones, el estado y el sistema de filtros.
  * **Manejo de Entorno (CORS Fix):** Implementación de un sistema de **Mock/Fallback** en `ProductService.js` que automáticamente utiliza datos locales en desarrollo, evitando errores de CORS.
  * **Optimización de Rendimiento:** Uso de **throttling** y **debounce** para el manejo eficiente de eventos de filtrado y búsqueda, además de **lazy loading** de imágenes.
  * **Accesibilidad (A11y):** Inclusión de semántica correcta, estilos para estados de enfoque (`:focus-visible`) y clases para lectores de pantalla (`.sr-only`).
  * **Filtrado Combinado:** Permite la búsqueda en tiempo real junto con múltiples filtros combinables por categoría, estado y disponibilidad de stock.

### 📁 Estructura Modular

La estructura de archivos refleja la arquitectura modular adoptada:

```
product-gallery/
├── index.html                  # Estructura principal (carga main.css y main.js)
├── css/
│   ├── base/                   # Estilos de etiquetas y tipografía (reset, global, typography) 
│   ├── components/             # Módulos de UI reutilizables (card, filters, loading_states) 
│   ├── layout/                 # Macro estructura de la página (container, main_sections) 
│   ├── utilities/              # Configuración y helpers (variables, a11y, performance) 
│   └── main.css                # Entry Point que importa todos los fragmentos CSS 
├── js/
│   ├── config/AppConfig.js     # Constantes y selectores 
│   ├── core/FilterSystem.js    # Lógica de filtrado 
│   ├── services/               # Carga de datos (ApiService, ProductService) 
│   ├── state/AppState.js       # Estado global 
│   ├── ui/                     # Renderizado y control de la UI (Renderer, FilterController) 
│   ├── utils/                  # Utilidades transversales (Logger, Performance, ConnectionMonitor) 
│   └── main.js                 # Orquestación y arranque de la aplicación 
└── data/
    └── cards.json              # Datos mock / Fallback
```

### 🚀 Instalación y Ejecución

Para ejecutar el proyecto:

1.  **Clona** el repositorio.
2.  Utiliza un **servidor web local** (necesario para la carga de ES Modules y `fetch` local), como Live Server de VS Code.
3.  Asegúrate de que el servidor esté ejecutándose en la raíz del proyecto.
4.  La aplicación se cargará utilizando el modo de desarrollo, extrayendo los datos directamente de `data/cards.json`.

<div align="center">
  
**[🔼 Volver al inicio](#galeria-de-productos-responsive)**

</div>

-----

## 🇺🇸 <span id="english-version">English Version</span>

### 🛍️ Responsive Product Gallery

### 📋 Description

This **frontend** project implements an interactive and responsive product gallery. The original monolithic code has been thoroughly refactored and **modularized** using the **Separation of Concerns** (SoC) principle to ensure the project's long-term **scalability** and **maintainability**.

The application design focuses on modularity, separating business logic, state management, user interface control, and utilities into distinct modules.

### 🛠️ Technologies Used

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![ES Modules](https://img.shields.io/badge/ES_Modules-6DA55F?style=for-the-badge&logo=javascript&logoColor=white)
![JSDoc](https://img.shields.io/badge/JSDoc-4E5A65?style=for-the-badge&logo=jsdoc&logoColor=white)
![Responsive Design](https://img.shields.io/badge/Responsive-Design-2C8EBB?style=for-the-badge&logo=web&logoColor=white)
![Web Accessibility](https://img.shields.io/badge/A11Y-Enabled-2C8EBB?style=for-the-badge&logo=accessibility&logoColor=white)

</div>

### 🎯 Key Features

  * **Modular JavaScript Architecture (ES Modules):** JS is structured into logical layers: `core/` (filtering logic), `services/` (data fetching), `state/` (global state), `ui/` (view and events), and `utils/` (cross-cutting concerns).
  * **Sustainable Modular CSS:** The CSS has been fragmented into modules by responsibility: `base/`, `layout/`, `components/`, and `utilities/`, with `main.css` acting as the single entry point to manage the cascade.
  * **Comprehensive Documentation (JSDoc):** All JavaScript code is rigorously documented using JSDoc, making the functions, state, and filter system easier to understand.
  * **Environment Management (CORS Fix):** Implementation of a **Mock/Fallback** system within `ProductService.js` that automatically uses local data in development, bypassing common CORS errors in local environments.
  * **Performance Optimization:** Use of **throttling** and **debounce** for efficient handling of filtering and search events, plus **lazy loading** for images.
  * **Accessibility (A11y):** Includes correct semantics, styles for focus states (`:focus-visible`), and utility classes for screen readers (`.sr-only`).
  * **Combined Filtering:** Allows real-time search combined with multiple filters by category, status, and stock availability.

### 📁 Modular Structure

The file structure reflects the adopted modular architecture:

```
product-gallery/
├── index.html                  # Main structure (loads main.css and main.js)
├── css/
│   ├── base/                   # Tag and typography styles (reset, global, typography) 
│   ├── components/             # Reusable UI modules (card, filters, loading_states) 
│   ├── layout/                 # Main page structure (container, main_sections) 
│   ├── utilities/              # Configuration and helpers (variables, a11y, performance) 
│   └── main.css                # CSS Entry Point 
├── js/
│   ├── config/AppConfig.js     # Constants and selectors 
│   ├── core/FilterSystem.js    # Filtering logic 
│   ├── services/               # Data handling (ApiService, ProductService) 
│   ├── state/AppState.js       # Global state 
│   ├── ui/                     # Rendering and UI control (Renderer, FilterController) 
│   ├── utils/                  # Cross-cutting functions (Logger, Performance, ConnectionMonitor) 
│   └── main.js                 # Application orchestration and startup 
└── data/
    └── cards.json              # Mock / Fallback data
```

### 🚀 Installation and Execution

To run the project:

1.  **Clone** the repository.
2.  Use a **local web server** (required for ES Modules and local `fetch`), such as VS Code's Live Server.
3.  Make sure the server is running at the project root.
4.  The application will automatically load data from `data/cards.json` using the development (Mock) mode.

<div align="center">

**[🔼 Back to Top](#galeria-de-productos-responsive)**

</div>

---

## 📫 <span id="contacto">Contacto / Contact</span>

<div align="center">

### 👨‍💻 **Javier Fernández Guerra**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/javier-fernandez-guerra-2a21b02b0/)
[![Substack](https://img.shields.io/badge/Substack-FF6719?style=for-the-badge&logo=substack&logoColor=white)](https://substack.com/@javierfernndez959962)
[![X (Twitter)](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/JaviFGuerraDev)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:javi.fguerra@gmail.com)

</div>

