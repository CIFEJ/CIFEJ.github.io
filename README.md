# Colegio de Ingenieros Forestales del Estado de Jalisco A.C.
Sitio web institucional — refactorización 2024

---

## Stack

| Herramienta | Versión | Rol |
|---|---|---|
| esbuild | ^0.24 | Bundler / minificador |
| Motion One | ^11.11 | Animaciones (reemplaza AOS) |
| Raleway | Google Fonts | Tipografía de títulos |
| Nunito | Google Fonts | Tipografía de cuerpo (reemplaza Tipografia1 DEMO) |

Sin jQuery. Sin Bootstrap. Sin AOS.

---

## Estructura del proyecto

```
proyecto/
├── src/
│   ├── js/
│   │   ├── main.js        # Navbar responsive + animaciones Motion One (compartido)
│   │   ├── home.js        # Carousel de testimonios
│   │   ├── nosotros.js    # (sin lógica adicional por ahora)
│   │   ├── servicios.js   # Slider con touch/swipe + flechas
│   │   ├── galeria.js     # Lazy loading + lightbox + filtros
│   │   └── contacto.js    # Accordion corregido + reset de formulario
│   └── css/
│       ├── main.css       # Entry point — importa todos los módulos en orden
│       ├── base.css       # Variables CSS, reset, tipografías
│       ├── components.css # Header, navbar, footer, botones (compartidos)
│       ├── home.css
│       ├── nosotros.css
│       ├── servicios.css
│       ├── galeria.css
│       └── contacto.css
├── dist/                  # Output generado por esbuild — NO editar manualmente
│   ├── chunk-[hash].js    # Chunk compartido: Motion One + main.js
│   ├── home.js
│   ├── nosotros.js
│   ├── servicios.js
│   ├── galeria.js
│   ├── contacto.js
│   └── styles.min.css
├── img/                   # Imágenes — referenciadas como ../img/ desde dist/
│   └── galeria/
│       ├── Aprovechamiento/
│       ├── Fuego/
│       ├── Inventarios/
│       ├── Plagas/
│       ├── Reforestación/
│       └── Transformación/
├── favicon/
├── index.html
├── nosotros.html
├── servicios.html
├── galeria.html
├── contacto.html
├── build.js               # Script de esbuild
├── fix-paths.sh           # Script de setup — ejecutar solo una vez
├── package.json
├── README.md
└── IMAGENES.md            # Checklist de optimización de imágenes
```

---

## Instalación y desarrollo

### Requisitos
- Node.js 18+
- npm 9+

### Primer uso (ejecutar solo una vez al mover el proyecto a Linux)

```bash
npm install
chmod +x fix-paths.sh && ./fix-paths.sh
npm run build
```

`fix-paths.sh` corrige todos los paths heredados de Windows (`assets/img/` → `img/`, `assets/favicon/` → `favicon/`) en los HTMLs y actualiza los script tags a `type="module"`. Solo necesita correrse una vez.

### Desarrollo con hot-rebuild
```bash
npm run dev
```
Observa cambios en `src/` y reconstruye automáticamente.

### Producción
```bash
npm run build
```

---

## Imágenes y assets en el CSS

Las imágenes **no se procesan** durante el build — esbuild las marca como `external` y mantiene los paths intactos.

- Las imágenes viven en `img/` en la raíz del proyecto
- El CSS las referencia con paths relativos desde `dist/`: `url('../img/nombre.webp')`
- No se copian ni renombran durante el build

---

## Cómo funcionan las animaciones

Se usa `data-motion` en lugar de `data-aos`. Valores disponibles:

```html
data-motion="fade-up"
data-motion="fade-down"
data-motion="fade-left"
data-motion="fade-right"
data-motion="zoom-in"
data-motion="flip-left"
data-motion="flip-right"
```

Cada animación se dispara **una sola vez** al entrar en el viewport.

---

## Code splitting

esbuild genera un chunk compartido con hash automático (ej. `chunk-HXZIR3W4.js`) que contiene Motion One y `main.js`. Los bundles de cada página son pequeños (~500B–2KB) e importan ese chunk. El navegador lo descarga una sola vez y lo cachea entre páginas.

El hash cambia si el contenido del chunk cambia — sirve automáticamente como **cache-busting**.

Los scripts se cargan con `type="module"`:
```html
<script type="module" src="dist/home.js"></script>
```

---

## Imágenes — pendientes de optimización

Ver `IMAGENES.md` para el checklist completo de conversiones WebP y script de compresión masiva de galería.

---

## Bugs corregidos

| Bug | Causa original | Solución |
|---|---|---|
| Animaciones se repiten al hacer scroll | `AOS.init({ once: false })` | Motion One con `inView` — once por diseño |
| Footer oculto en escritorio | `data-aos="fade-up"` dejaba el footer invisible | Animación removida del footer |
| Última pregunta FAQ no expandible | `accordion.js` no cerraba los demás items antes de evaluar | Cierre de todos los items antes de abrir el seleccionado |
| Slider sin soporte touch | Solo tenía eventos `click` en dots | Detección de swipe con `touchstart`/`touchend` |
| Bootstrap cargado completo | ~46KB innecesarios por navbar y carousel | Navbar y carousel propios en CSS + JS vanilla |

---

## Notas para mantenimiento

- **Nunca editar archivos en `dist/`** directamente. Siempre editar en `src/` y correr `npm run build`.
- **Para agregar una nueva página**: crear `src/js/nueva.js` con `import './main.js'` al inicio, agregar el entrypoint en `build.js`, y referenciar `dist/nueva.js` con `type="module"` en el HTML.
- **Para agregar una animación nueva**: agregar la entrada en el objeto `animations` en `src/js/main.js`.
- **La carpeta `assets/`** completa ya no se usa y puede eliminarse después del primer build exitoso.
