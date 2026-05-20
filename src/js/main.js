import { animate, inView } from 'motion'

export function initPage() {
  // Navbar hamburger
  const navToggle = document.querySelector('.nav-toggle')
  const navList = document.querySelector('.nav-list')

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open')
      navToggle.setAttribute('aria-expanded', isOpen)
      navToggle.textContent = isOpen ? '✕' : '☰'
    })

    // Cerrar al hacer click en un link
    navList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navList.classList.remove('open')
        navToggle.textContent = '☰'
      })
    })
  }

  // Año dinámico en el copyright
  document.querySelectorAll('#year').forEach((el) => {
    el.textContent = new Date().getFullYear()
  })

  // Animaciones con Motion One (reemplaza AOS)
  document.querySelectorAll('[data-motion]').forEach((el) => {
    const type = el.dataset.motion

    const animations = {
      'fade-up': { opacity: [0, 1], y: [40, 0] },
      'fade-down': { opacity: [0, 1], y: [-40, 0] },
      'fade-left': { opacity: [0, 1], x: [40, 0] },
      'fade-right': { opacity: [0, 1], x: [-40, 0] },
      'zoom-in': { opacity: [0, 1], scale: [0.85, 1] },
      'flip-left': { opacity: [0, 1], rotateY: [-90, 0] },
      'flip-right': { opacity: [0, 1], rotateY: [90, 0] }
    }

    const keyframes = animations[type] || animations['fade-up']

    // Estado inicial en CSS via clase — evita FOUC si el script llega tarde.
    el.classList.add('motion-pending')

    inView(
      el,
      () => {
        el.classList.remove('motion-pending')
        animate(el, keyframes, {
          duration: 0.7,
          easing: [0.25, 0.46, 0.45, 0.94]
        })
      },
      { margin: '-80px' }
    )
  })
}
