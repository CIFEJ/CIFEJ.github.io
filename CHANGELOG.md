COLEGIO DE INGENIEROS FORESTALES DEL ESTADO DE JALISCO A.C.
Sitio web institucional — Historial de estado del proyecto
============================================================


BETA 1 — Refactorización completa del stack
------------------------------------------------------------
Fecha: abril 2026

Punto de partida: sitio construido con Bootstrap 5, jQuery, AOS y una
tipografía DEMO (Tipografia1) con uso ilegal. Sin proceso de build.

Cambios realizados:
- Eliminación completa de Bootstrap 5 (~46 KB), jQuery y AOS.
- Adopción de esbuild ^0.28 como bundler con code splitting ESM y
  cache busting automático por hash.
- CSS migrado a vanilla modular (8 archivos en src/css/).
- Animaciones migradas a Motion One ^11.11 con atributos data-motion,
  disparadas una sola vez por IntersectionObserver (inView).
- Tipografía reemplazada por Raleway + Nunito (inicialmente vía Google Fonts).
- JavaScript reescrito en vanilla ES2018+ sin dependencias externas.
- Navbar hamburger propia en CSS + JS (reemplaza Bootstrap collapse).
- Carousel de testimonios propio con swipe táctil (home.js).
- Slider SEMARNAT con swipe táctil y dots (servicios.js).
- Lazy loading con IntersectionObserver + lightbox propio (galeria.js).
- Accordion FAQ corregido — bug: última pregunta no era expandible
  porque el cierre de items previos no ocurría antes de evaluar el
  item clickeado (contacto.js).
- Sistema de viñetas decorativas unificado en components.css.
  Todos los selectores usan ancho clamp(26px, 2.2vw, 38px) y
  aspect-ratio en lugar de height fijo.
- Variables CSS globales con tipografía fluida (clamp()) en base.css,
  eliminando la mayoría de overrides por breakpoint.
- Formulario de contacto integrado con Web3Forms (action + access_key).
- fix-paths.sh incluido para corregir paths heredados de Windows al
  mover el proyecto a Linux (ejecutar solo una vez).

Proyecto original creado por CARMA.

Bugs corregidos en esta fase:
- Animaciones AOS se repetían al hacer scroll (once: false por defecto).
- Footer invisible en escritorio por data-aos="fade-up" residual.
- Slider sin soporte touch.
- Bootstrap cargado completo sin uso real.
- Tipografía DEMO con uso ilegal.

Pendientes identificados al cerrar beta 1:
- Renombrar assets con ñ en el nombre (viñetaBeige.webp, etc.) —
  bloquean carga en Linux.
- logo.svg de 502 KB contiene raster embebido — rehacer como vector.
- 7 fondos SVG (~12 MB total) pendientes de convertir a WebP.
- img/galeria/ con 61 MB sin comprimir — ejecutar compress-gallery.sh.
- Self-hosting de Google Fonts con font-display:swap para producción. — COMPLETADO en Beta 6.
- Eliminar carpeta assets/ (respaldo Bootstrap) tras build exitoso.


BETA 2 — Ajustes CSS/HTML y correcciones visuales
------------------------------------------------------------
Fecha: abril 2026

Cambios realizados:
- quienes-wrapper añadido en nosotros.html: nuevo div que agrupa
  .seccion-titulo + .somos-container + .identidad-container bajo un
  único background-image (fondoHelicoptero.webp), siguiendo el patrón
  de .equipo-wrapper. Antes solo .seccion-titulo tenía el fondo,
  dejando los párrafos y tarjetas Misión/Visión sobre fondo blanco.
- contacto-icon añadido a nosotros.html, servicios.html y galeria.html
  (faltaba en la refactorización inicial). CSS vive en components.css.
- Banner h1 Inicio: token --text-4xl (2→5rem) reducido a --text-3xl
  (1.75→3rem) — 5rem máximo era excesivo para el texto de 7 palabras.
- Footer móvil: .menu-footer a sube de --text-sm a --text-base en
  breakpoint ≤767px para mejor legibilidad táctil.
- Carousel testimonios: text-shadow difuso añadido en cita
  (0 1px 6px rgba(0,0,0,0.55)) y nombre del testigo
  (0 1px 4px rgba(0,0,0,0.55)).
- Sintaxis inválida clamp(1.5%,2%,4%) en .vineta-container corregida
  a clamp(26px, 2.2vw, 38px) (clamp requiere unidades absolutas o
  relativas al viewport, no porcentajes).
- aspect-ratio reemplaza height fijo en todas las viñetas.
- padding-left de .lista li ajustado a clamp(32px, 3.2vw, 48px).
- components.js renombrado desde main.js — refleja mejor su rol como
  módulo de componentes compartidos (initPage + createSlider).
- Regla opacity:1 !important añadida a .header-image como defensa ante
  residuos de animación de Motion One en Android.


BETA 3 — Revisión técnica
------------------------------------------------------------
Fecha: mayo 2026

Análisis completo del código fuente realizado. Cambios aplicados:

1. galeria.js — Eliminado alias visibleItems innecesario en
   openLightbox(). La variable era un alias directo de allItems sin
   ningún efecto, código engañoso.

2. galeria.js + galeria.css — Fallback para Firefox < 121:
   El selector :has(img.loaded) no tiene soporte en Firefox anterior a
   la versión 121 (octubre 2023), lo que dejaba el placeholder visible
   sobre la imagen cargada. Solución doble:
   - galeria.js añade la clase .img-loaded al .galeria-item padre
     cuando la imagen dispara el evento load (lazy y fallback directo).
   - galeria.css extiende el selector con .galeria-item.img-loaded::before
     como regla paralela al :has() existente.
   Prioridad Chromium mantenida; Firefox cubierto sin romper nada.

3. components.js + base.css — Fix FOUC en animaciones Motion One:
   El patrón anterior seteaba el.style.opacity='0' directamente en JS
   antes de que inView disparara. En dispositivos lentos o con red lenta,
   el script puede llegar tarde y el elemento queda visible brevemente
   antes de ocultarse (flash). Solución:
   - components.js ahora añade la clase CSS motion-pending al elemento
     y la remueve justo antes de iniciar la animación.
   - base.css define [data-motion].motion-pending { opacity: 0 }.
   El estado invisible vive en la hoja de estilos desde el primer render,
   no depende de la velocidad de ejecución del script.

4. nosotros.css — Corrección de valor y comentario en
   background-attachment: el valor 'local' fue reemplazado por 'scroll'.
   'local' desplaza el fondo junto con el scroll del contenedor (no de
   la página), lo cual es incorrecto aquí. El valor que falla en iOS es
   'fixed', no 'scroll'. Comentario actualizado para reflejar esto.

5. contacto.css — Validación visual del formulario:
   - Border de inputs/textarea subido de 1px a 2px para que los estados
     de color sean visibles.
   - outline: none + transition en border-color y box-shadow.
   - :focus: borde var(--color-verde) con box-shadow tenue.
   - :not(:placeholder-shown):valid: borde verde (#3a8a5c).
     El selector :not(:placeholder-shown) evita mostrar el estado
     inválido en campos vacíos que el usuario aún no ha tocado.
   - :not(:placeholder-shown):invalid: borde rojo (#c0392b) con
     box-shadow tenue.


BETA 4 — Migración a Vite + refactor de JS
------------------------------------------------------------
Fecha: mayo 2026

1. Migración de bundler esbuild → Vite ^6.3:
   - build.js eliminado.
   - package.json actualizado: esbuild removido, vite añadido como
     devDependency. Scripts: dev → "vite", build → "vite build",
     preview → "vite preview" (nuevo).
   - vite.config.js creado en la raíz con MPA de 5 entry points
     (rollupOptions.input) y publicDir: 'public'.

2. Reestructura de archivos HTML:
   - Los 5 HTMLs movidos de public/ a la raíz del proyecto.
   - public/ queda exclusivamente con img/ (assets estáticos que
     Vite copia sin procesar al output).
   - <link rel="stylesheet"> actualizado de css/styles.min.css
     → /src/css/main.css en todos los HTMLs.
   - <script src> actualizado de js/*.js → /src/js/*.js en todos
     los HTMLs. Vite toma estos como entry points y los procesa.
   - Todas las referencias a imágenes en HTML actualizadas a paths
     absolutos con /img/... para coincidir con publicDir.

3. Refactor de JS — separación de responsabilidades:
   - components.js eliminado (contenía initPage + createSlider mezclados).
   - main.js creado: contiene exclusivamente initPage() — navbar
     hamburger, año dinámico y animaciones Motion One.
   - slider.js creado: contiene exclusivamente createSlider() —
     componente utilitario sin side effects.
   - Los 5 page-scripts actualizados para importar directamente de
     ./main.js y/o ./slider.js según lo que cada página necesita:
       home.js, servicios.js    → import de main.js + slider.js
       nosotros.js, galeria.js,
       contacto.js              → import solo de main.js

4. Fix paths de imágenes en CSS:
   - Todos los url('../img/...') y url(../img/...) en src/css/
     reemplazados por url('/img/...') — paths absolutos desde la raíz.
   - Afectó a: components.css, home.css, nosotros.css, servicios.css,
     galeria.css, contacto.css.
   - Causa: Vite resolvía los paths relativos desde src/css/ y
     construía src/img/ que no existe; el path absoluto apunta
     correctamente al publicDir.


BETA 5 — Configuración de ESLint + Prettier
------------------------------------------------------------
Fecha: mayo 2026

1. Herramientas añadidas:
   - eslint ^9.0.0 + @eslint/js ^9.0.0 — linting con flat config nativo.
   - eslint-config-prettier ^10.0.0 — desactiva reglas de ESLint que
     conflictúan con Prettier.
   - globals ^16.0.0 — entorno de browser para ESLint.
   - prettier ^3.0.0 — formateo de código.

2. eslint.config.js — creado con flat config nativo (sin FlatCompat):
   - js.configs.recommended como base.
   - eslint-config-prettier aplicado para desactivar conflictos.
   - languageOptions: ecmaVersion latest, sourceType module,
     globals.browser.
   - Reemplaza eslint.config.mjs (innecesario con "type":"module"
     ya declarado en package.json).

3. .prettierrc — configuración existente mantenida:
   semi: false, singleQuote: true, trailingComma: none.

4. .prettierignore — simplificado a dos exclusiones justificadas:
   - dist/ — output generado.
   - **/*.html — HTMLs gestionados manualmente.
   Se eliminaron exclusiones innecesarias de eslint.config.js
   y vite.config.js.

5. package.json — scripts reorganizados en pares simétricos:
   - lint / lint:fix          → verifica / corrige ESLint en src/
   - prettier / prettier:write → verifica / aplica Prettier en src/
   - format:check             → lint + prettier (verifica ambos)
   - format                   → lint:fix && prettier:write (corrige ambos)
   El && en format y format:check detiene la cadena si ESLint falla,
   evitando formatear código con errores sin corregir.


BETA 6 — Self-hosting de fuentes con Fontsource
------------------------------------------------------------
Fecha: mayo 2026

1. Migración de Google Fonts → Fontsource (fuentes variables):
   - @fontsource-variable/raleway ^5.0.0 añadido a dependencies.
   - @fontsource-variable/nunito ^5.0.0 añadido a dependencies.
   - @import de Google Fonts eliminado de base.css y reemplazado por:
       @import '@fontsource-variable/raleway';
       @import '@fontsource-variable/nunito';
   - Las fuentes variables cubren todos los pesos en un único archivo
     .woff2, eliminando las 7 peticiones separadas que hacía Google Fonts
     (4 de Raleway + 3 de Nunito).
   - Raleway itálica NO incluida: revisión del CSS confirmó que ningún
     selector usa font-style:italic con Raleway. La itálica que existe
     en el carousel de testimonios (.carousel-slide h5) usa Nunito, no
     Raleway. La URL de Google Fonts la pedía innecesariamente.
   - Comentario en base.css actualizado para documentar los pesos reales
     en uso y la ausencia intencional de itálica en Raleway.
   - Requiere ejecutar npm install para descargar los paquetes.

Beneficios obtenidos:
   - Cero peticiones a dominios de Google (fonts.googleapis.com,
     fonts.gstatic.com) — mejora privacidad y elimina dependencia externa.
   - Los .woff2 se sirven desde el mismo origen, eliminando la latencia
     de conexión a terceros y el @import en cascada que bloqueaba el
     descubrimiento de las fuentes.
   - font-display:swap incluido por defecto en Fontsource.


BETA 7 — Migración de assets SVG a WebP
------------------------------------------------------------
Fecha: mayo 2026

1. Todos los assets de imagen convertidos de SVG a WebP:
   - logo.svg conservado como SVG (vector real, usado en header).
   - Todos los demás SVGs reemplazados por sus equivalentes .webp:
     icono1–4, icon-mision, icon-vision, location, phone, message.
   - Todos los assets del proyecto (fondos, viñetas, galería, etc.)
     comprimidos — se redujo el peso total de img/ de forma significativa.

2. Referencias actualizadas en HTML:
   - index.html: icono1–4.svg → .webp.
   - index.html: clases banner-svg-left / banner-svg-bottom
     renombradas a banner-img-left / banner-img-bottom (el nombre
     anterior era semántico al formato; ahora describe posición).
   - contacto.html: location.svg, phone.svg, message.svg → .webp.

3. Referencias actualizadas en CSS:
   - home.css: selectores .banner-svg-left / .banner-svg-bottom
     renombrados a .banner-img-left / .banner-img-bottom.
   - nosotros.css: url('/img/icon-mision.svg') e icon-vision.svg
     → .webp en pseudoelementos ::before de .identidad-mision
     y .identidad-vision.

4. SVG inline conservado:
   - El data:image/svg+xml del placeholder en galeria.css es código
     embebido, no un archivo externo — no requería ningún cambio.

Pendientes cerrados en esta fase:
   - 7 fondos SVG convertidos a WebP — COMPLETADO.
   - img/galeria/ comprimida — COMPLETADO.


BETA 8 — Ajustes UI/UX
------------------------------------------------------------
Fecha: mayo 2026

1. galeria.js + galeria.css — Placeholder diferido para evitar flash:
   El placeholder (::before con ícono SVG) era siempre visible al
   renderizar el DOM, causando un flash en conexiones rápidas donde
   la imagen cargaba antes de que el usuario lo notara.
   Solución: el ::before nace con opacity:0 por defecto. galeria.js
   programa un setTimeout de 300ms al iniciar la carga de cada imagen;
   si la imagen llega antes, clearTimeout cancela el timer y el
   placeholder nunca aparece. Solo en conexiones lentas se añade la
   clase .show-placeholder al .galeria-item, activando opacity:1.
   El fondo beige y el min-height siguen reservando el espacio en
   el grid independientemente del placeholder.

2. components.css — Link activo en navbar con mayor contraste:
   El estado .nav-list a.active usaba color:var(--color-beige)
   (#efe8d0) sobre fondo verde oscuro (#204032), con ratio ~4.2:1
   que resultaba visualmente tenue comparado con los links blancos.
   Nuevo estilo: color:#fff (igual que los demás links) +
   border-bottom:2px solid var(--color-beige) + padding-bottom:2px.
   El subrayado beige distingue la página activa sin sacrificar
   el contraste del texto.

3. slider.js — Altura fija dinámica en sliders y carousel:
   Los contenedores .carousel-track y .slider-container cambiaban
   de altura al cambiar de slide porque el item activo usaba
   position:relative mientras los demás usaban position:absolute.
   Solución: nueva función fixContainerHeight() en createSlider().
   Al inicializar, activa todos los slides simultáneamente con
   visibility:hidden, mide el offsetHeight máximo y fija ese valor
   como minHeight en el track. La medición es O(n) con n = slides,
   costo negligible. Aplica automáticamente al carousel de
   testimonios (home.js) y al slider SEMARNAT (servicios.js).

4. contacto.html — Link tel: en número de teléfono:
   El número de teléfono en DATOS DE CONTACTO no tenía enlace.
   Añadido <a href="tel:+523411234567"> siguiendo el mismo patrón
   del mailto: ya existente en el email.


BETA 9 — Correcciones UI móvil
------------------------------------------------------------
Fecha: mayo 2026

Correcciones aplicadas tras revisión en dispositivo Android real.

1. home.css — Banner principal móvil (height → layout flex):
   El contenedor .banner-container usaba height fijo con overflow:hidden
   y .banner-content en position:absolute. En móvil el texto y el botón
   quedaban cortados porque el contenido no cabía en la altura fija, y
   min-height no funcionaba porque los hijos absolutos no empujan el
   contenedor. Solución en breakpoint ≤767px:
   - .banner-container pasa a display:flex con min-height:
     clamp(380px, 120vw, 600px), garantizando altura visible.
   - .banner-content sale de position:absolute a position:relative,
     volviendo al flujo normal y empujando el alto del contenedor.
   - align-items:flex-end posiciona el contenido en la parte inferior
     del banner, preservando la estética del diseño original.

2. home.css — Columnas de iconos (font-size):
   .columna h3 y .columna p usaban --text-sm (clamp 0.80→1.00rem),
   el token más pequeño del sistema, resultando en texto visualmente
   desproporcionado respecto al resto de la página. Subidos a:
   - .columna h3 → --text-md (clamp 1.00→1.25rem)
   - .columna p  → --text-base (clamp 0.95→1.10rem)
   Cambio aplica también en desktop.

3. home.css — Carousel de testimonios (botones cortados en móvil):
   Los botones anterior/siguiente quedaban fuera del área visible
   porque .carousel-container no tenía padding-bottom suficiente.
   Añadido padding-bottom: clamp(3rem, 8vw, 5rem) en ≤767px.

4. nosotros.css — Iconos Misión/Visión (posicionamiento):
   Los pseudoelementos ::before de .identidad-mision y .identidad-vision
   usaban top/left en porcentajes (top:-15%, left:-12%), que se
   calculan sobre dimensiones distintas según el modo de layout
   (fila en desktop, columna en móvil), produciendo desplazamiento
   incorrecto en móvil. Reemplazados por valores absolutos:
   - top: -28px; left: -28px (consistentes en ambos layouts).
   - Tamaño: clamp(70px, 9vw, 120px) — mínimo 70px en móvil,
     hasta 120px en pantallas anchas.

5. contacto.css — Overflow de texto en Datos de Contacto:
   El email colegioingenierosforestalesjal@gmail.com es una cadena
   sin espacios que desbordaba el contenedor hacia la derecha.
   Solución doble:
   - .info-content-text: min-width:0 (permite que el flex item se
     comprima) + overflow-wrap:break-word + word-break:break-word.
   - .info-content p / .contact-info p: overflow-wrap:break-word.
   - .contact-info y .contact-form: min-width:0 añadido.

6. base.css — Token --text-xs eliminado:
   El token clamp(0.70rem, 1.5vw, 0.75rem) no tenía ningún uso en
   el proyecto. Eliminado para mantener el sistema de tokens limpio.

7. contacto.css — Espaciado párrafo intro del formulario:
   El párrafo "Déjanos saber en qué podemos colaborar contigo." no
   tenía margin-bottom, quedando pegado al form-container. Añadido
   .contact-form > p { margin-bottom: clamp(0.75rem, 2vw, 1.25rem) }.
   El selector combinado .contact-info h3, .contact-form h3 fue
   separado en reglas individuales al hacer este cambio.

8. nosotros.css — Espacio sobrante sobre "Quiénes somos":
   .seccion-titulo tenía min-height: clamp(120px, 20vw, 320px),
   generando hasta 320px de espacio vacío en desktop. Reducido a
   clamp(60px, 8vw, 120px). Adicionalmente, .nosotros-container
   recibió padding-bottom:0 para eliminar el espacio entre la sección
   de historia (imagen circular) y el wrapper de Quiénes somos.


BETA 10 — Limpieza de CSS: selectores huérfanos e innecesarios
------------------------------------------------------------
Fecha: mayo 2026

Análisis cruzado completo de los 8 archivos CSS contra los 5 HTMLs
y los 7 archivos JS. Cambios aplicados:

1. contacto.html — Eliminadas dos clases completamente huérfanas
   (sin regla CSS ni uso en JS) heredadas de refactorizaciones previas:
   - class="accordion-faq" del <div> wrapper del accordion — reemplazado
     por <div> sin clase. contacto.js selecciona directamente
     .accordion-header, el wrapper no necesitaba identificador propio.
   - class="accordion-title" de los tres <span> de preguntas —
     reemplazados por <span> sin clase, que es semantícamente correcto
     dado que el estilo lo hereda del .accordion-header padre.

2. components.css — Documentación de hooks JS en la sección de
   controles de slider/carousel. Las clases .carousel-arrow,
   .carousel-dot, .slider-arrow y .dot no tienen regla CSS propia
   (el estilo lo proveen .nav-arrow y .nav-dot y sus variantes BEM)
   pero son selectores activos en JS:
     .carousel-arrow / .carousel-dot → home.js (carousel testimonios)
     .slider-arrow / .dot           → servicios.js (slider SEMARNAT)
   Se añadió bloque de comentario al inicio de la sección para que no
   se eliminen del HTML por error en el futuro.
   Adicionalmente se añadió comentario aclarando por qué .carousel-controls
   tiene su propio margin-top fuera del selector agrupado (el valor
   gap-sm de la regla compartida era inmediatamente sobreescrito por
   gap-md, lo que lo convertía en dead code para ese selector).

3. nosotros.css — Eliminada la regla .nosotros-container { padding-bottom: 0 }.
   Residuo de la era Bootstrap: el reset universal de base.css ya garantiza
   padding: 0 en todos los elementos, haciendo esta declaración redundante.
   Nota: el punto 8 de Beta 9 documentaba esta regla como intencional,
   pero la inspección confirmó que no hay padding heredado que anular.

4. contacto.js — Comentario añadido junto al querySelectorAll indicando
   que el selector directo sobre .accordion-header es la razón por la
   que el wrapper del accordion no necesita clase propia.


BETA 11 — Corrección UI móvil: padding en tarjetas CONAFOR
------------------------------------------------------------
Fecha: mayo 2026

1. servicios.css — Padding insuficiente en .conafor-card en móvil:
   El texto de los párrafos quedaba pegado al borde inferior de las
   tarjetas en dispositivos móviles. Causa: padding: 2% 5% usa
   porcentajes en el eje vertical, que en CSS siempre se calculan
   sobre el ancho del contenedor (no sobre su alto). En desktop las
   cards alcanzan hasta 500px de ancho y 2% = ~10px, visualmente
   aceptable. En móvil el contenedor es estrecho y 2% resulta en
   5–6px, insuficiente.
   Solución: media query ≤767px que sobreescribe solo el padding
   vertical con un valor absoluto:
     .conafor-card { padding: clamp(16px, 5vw, 24px) 5%; }
   El padding horizontal (5%) se conserva igual. Desktop no se toca.


BETA 12 — Página 404
------------------------------------------------------------
Fecha: mayo 2026

1. 404.html — Página de error creada en la raíz del proyecto
   siguiendo la estructura exacta de las demás páginas (header,
   footer, mismo main.css). Importa /src/js/404.js (ver punto 2).
   Contenido: mensaje principal "¿No encuentras lo que buscas?"
   en --text-4xl + botón CONTÁCTANOS (.btn.btn-verde) + botón
   IR A INICIO (.btn.btn-beige). data-motion="fade-up" en
   .not-found-inner — anima título y botones en conjunto, igual
   que .banner-container en index.html.
   Añadida a rolldownOptions.input en vite.config.js.

2. src/css/404.css — CSS de página creado y añadido a main.css.
   Layout: body con display:flex + min-height:100vh para que el
   footer quede anclado al fondo en páginas de contenido corto.
   Sin background-color explícito en .not-found-main — coherente
   con el resto del sitio, que depende del fondo blanco por defecto
   del navegador.
   Override .not-found-actions .btn-beige { font-size: var(--text-lg) }
   para igualar visualmente ambos botones sin modificar components.css
   (.btn-beige define --text-xl por defecto).

3. base.css — Añadido color-scheme: light a body.
   Previene que navegadores con modo oscuro del sistema operativo
   alteren el fondo blanco por defecto de los contenedores sin
   background-color explícito. El sitio no implementa dark mode
   propio; sin esta declaración los contenedores blancos podrían
   verse grises o negros en modo oscuro.


BETA 13 — Correcciones en página 404 + crédito Antruc en footer
------------------------------------------------------------
Fecha: mayo 2026

1. 404.html + src/js/404.js — Bug: año no aparecía en el footer.
   Causa: 404.html apuntaba a /src/js/main.js directamente, que
   solo exporta initPage() sin llamarla. Las demás páginas tienen
   su propio page-script que importa y ejecuta initPage().
   Solución: creado src/js/404.js siguiendo el patrón del resto
   de páginas (importa y llama initPage()). 404.html actualizado
   para apuntar a /src/js/404.js. Entrada '404' añadida a
   rolldownOptions.input en vite.config.js.
   Nota: vite.config.js usa rolldownOptions (no rollupOptions —
   el proyecto ya migró a Rolldown).

2. 404.html — Animación de entrada añadida:
   data-motion="fade-up" en .not-found-inner, que agrupa el h1
   y los dos botones. Coherente con el patrón del resto de páginas
   (ej. .banner-container en index.html). src/js/404.js actualizado
   con comentario que documenta el uso de data-motion.

3. Todos los HTMLs (6) — Crédito en footer actualizado:
   "Creado por CARMA." → "Creado por CARMA + Antruc."
   donde "Antruc" es <a href="https://antruc.dev" target="_blank"
   rel="noopener noreferrer">. Sin clase ni regla CSS adicional —
   hereda text-decoration:none y color:inherit del reset global
   de base.css, idéntico al comportamiento del mailto: y tel:
   en contacto.html.


VERSIÓN 1.0 — Optimización de assets y documentación
------------------------------------------------------------
Fecha: mayo 2026

1. Compresión de assets — 8 imágenes recomprimidas al 60–70%:
   Los fondos y banners de mayor peso se exportaron originalmente
   al 80–90% de calidad, innecesario para imágenes usadas como
   background-size:cover o con contenido superpuesto.
   Ninguna imagen requirió redimensionado — los 1490px de ancho
   de los fondos son el mínimo sensato para pantallas 1440–1920px,
   y las fotos de contenido ya estaban en dimensiones ajustadas.
   bannerNosotros.webp se mantuvo sin comprimir por contener
   texto legible que requiere calidad de imagen alta.

   Resultados (antes → después):
     fondoHelicoptero.webp   1,024 KB → 152 KB  (−85%)
     bannerBosque.webp         657 KB → 175 KB  (−73%)
     fondoEquipo.webp          654 KB → 162 KB  (−75%)
     fondoTestimonial.webp     607 KB → 157 KB  (−74%)
     bannerServicios.webp      428 KB → 138 KB  (−67%)
     fondoBannerPrincipal.webp 389 KB →  77 KB  (−80%)
     fotoHojaCafe.webp         275 KB →  98 KB  (−64%)
     fotografiaCirculo.webp    339 KB →  93 KB  (−72%)
     Total: 4,373 KB → 1,052 KB (−3,321 KB, −76%)

2. Mapeo de estructura del proyecto añadido a los archivos
   del proyecto como referencia de sesión.

3. Ruta local del proyecto: %USERPROFILE%\Downloads\CIFEJ.github.io

4. Content Security Policy añadido a los 6 HTMLs:
   - index, nosotros, servicios, galeria, 404:
       default-src 'self'; style-src 'self' 'unsafe-inline';
       img-src 'self' data:; base-uri 'self'
   - contacto.html incluye además frame-src, connect-src y
     form-action para el iframe de Google Maps y Web3Forms.
   - style-src requiere 'unsafe-inline' por Motion One, que
     aplica estilos directamente sobre el DOM al animar.
   - script-src y font-src omitidos en los 5 HTMLs simples:
     quedan cubiertos por default-src 'self' sin necesidad
     de declararlos explícitamente.
   - frame-ancestors no incluido: no funciona vía meta tag,
     solo vía header HTTP (no disponible en GitHub Pages).
   - Advertencias CSP en contacto provienen del iframe de
     Google Maps (CSP interno de Google), no del sitio.



V1.1 — Meta properties SEO + ajuste de animaciones de banners
------------------------------------------------------------
Fecha: mayo 2026

Meta tags SEO añadidas a los 6 archivos HTML del proyecto.

Cambios por archivo:

  index.html, nosotros.html, servicios.html, galeria.html, contacto.html:
    - <meta name="description"> con texto único por página.
    - <meta name="author"> con nombre completo de la institución.
    - <meta name="robots" content="index, follow">
    - <link rel="canonical"> apuntando a https://cifej.github.io/[ruta]
    - Open Graph: og:type, og:site_name, og:title, og:description,
      og:url, og:image, og:locale (es_MX).
    - Twitter Card: twitter:card (summary_large_image), twitter:title,
      twitter:description, twitter:image.

  404.html:
    - Solo <meta name="robots" content="noindex, nofollow">.
    - Sin OG, sin canonical, sin description — la página no debe
      indexarse ni compartirse en redes sociales.

Decisiones y anotaciones:

  - keywords omitidas intencionalmente. Google las ignora desde hace
    más de una década; incluirlas solo añadiría ruido al <head>.

  - Imágenes OG: se usan los banners WebP existentes por página
    (bannerBosque, bannerNosotros, bannerServicios, bannerGaleria,
    bannerContacto). WebP es compatible con la mayoría de crawlers
    modernos (Google, Facebook, LinkedIn). WhatsApp y algunos
    crawlers heredados prefieren JPG/PNG.
    PENDIENTE: evaluar si crear una imagen OG dedicada (og-image.jpg,
    1200×630 px) para máxima compatibilidad multiplataforma.

  - Canonical: dominio https://cifej.github.io usado de forma
    provisional. Actualizar en todos los HTMLs si se adopta
    dominio propio.

  - El CSP existente no requiere ajustes: las imágenes OG las
    leen los crawlers directamente desde la URL pública; no se
    cargan en el navegador del usuario.

Eliminación del fade-up en banners de inicio de página.

  index.html    → .banner-container
  nosotros.html → .nosotros-banner
  servicios.html → .servicios-banner
  galeria.html  → .galeria-banner
  contacto.html → .contact-banner

  Todos tenían data-motion="fade-up". El atributo fue eliminado en los 5
  archivos. Al estar en el viewport desde el primer render, la animación
  dependía del timing entre inView y el paint inicial — el mismo bug que
  ya había motivado quitar data-motion del header en Beta 2/3. Sin el
  atributo, los banners aparecen inmediatamente en su estado CSS natural;
  el loop de animaciones en main.js los ignora por completo.

Eliminación de opacity:1 !important en .header-image (components.css):

  La declaración y su comentario FIX eran una defensa ante la presencia de
  data-motion en el header, que ya fue eliminado. Sin data-motion, Motion One
  nunca toca .header-image y el !important no tiene efecto real. Eliminado
  junto con el comentario para mantener el CSS limpio.
