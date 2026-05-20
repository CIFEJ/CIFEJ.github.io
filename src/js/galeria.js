import { initPage } from './main.js'

initPage()

// ── Lazy loading con IntersectionObserver ──
const lazyImages = document.querySelectorAll('img[data-src]')

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          const item = img.closest('.galeria-item')

          // Mostrar placeholder solo si la imagen tarda más de 300ms en cargar.
          // En conexiones rápidas el timer se cancela antes de dispararse,
          // evitando el flash del placeholder.
          const placeholderTimer = setTimeout(() => {
            item?.classList.add('show-placeholder')
          }, 300)

          img.src = img.dataset.src
          img.removeAttribute('data-src')
          img.addEventListener(
            'load',
            () => {
              clearTimeout(placeholderTimer)
              img.classList.add('loaded')
              // Fallback para browsers sin soporte de :has() (Firefox < 121):
              // la clase en el padre permite ocultar el placeholder via .galeria-item.img-loaded::before
              item?.classList.add('img-loaded')
            },
            { once: true }
          )
          observer.unobserve(img)
        }
      })
    },
    { rootMargin: '200px' }
  ) // precarga 200px antes de que sea visible

  lazyImages.forEach((img) => observer.observe(img))
} else {
  // Fallback: carga directa si no hay soporte
  lazyImages.forEach((img) => {
    img.src = img.dataset.src
    img.classList.add('loaded')
    img.closest('.galeria-item')?.classList.add('img-loaded')
  })
}

// ── Lightbox ──
const lightbox = document.querySelector('.lightbox')
const lightboxImg = lightbox?.querySelector('img')
const btnClose = lightbox?.querySelector('.lightbox-close')
const btnLBPrev = lightbox?.querySelector('.lightbox-prev')
const btnLBNext = lightbox?.querySelector('.lightbox-next')

const allItems = [...document.querySelectorAll('.galeria-item')]
let lbIndex = 0

function openLightbox(index) {
  lbIndex = index
  const img = allItems[lbIndex]?.querySelector('img')
  if (!img || !lightbox) return
  lightboxImg.src = img.dataset.src || img.src
  lightboxImg.alt = img.alt
  lightbox.classList.add('open')
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightbox?.classList.remove('open')
  document.body.style.overflow = ''
}

function navigateLightbox(dir) {
  lbIndex = (lbIndex + dir + allItems.length) % allItems.length
  const img = allItems[lbIndex]?.querySelector('img')
  if (img) {
    lightboxImg.src = img.dataset.src || img.src
    lightboxImg.alt = img.alt
  }
}

allItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i))
})

btnClose?.addEventListener('click', closeLightbox)
btnLBPrev?.addEventListener('click', () => navigateLightbox(-1))
btnLBNext?.addEventListener('click', () => navigateLightbox(1))

// Cerrar con Escape o click fuera de la imagen
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox()
})

document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('open')) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') navigateLightbox(-1)
  if (e.key === 'ArrowRight') navigateLightbox(1)
})

// Swipe en lightbox (móvil)
let lbTouchX = 0
lightbox?.addEventListener(
  'touchstart',
  (e) => {
    lbTouchX = e.touches[0].clientX
  },
  { passive: true }
)
lightbox?.addEventListener(
  'touchend',
  (e) => {
    const diff = lbTouchX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) navigateLightbox(diff > 0 ? 1 : -1)
  },
  { passive: true }
)
