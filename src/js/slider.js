// slider.js — Carousel / slider reutilizable
//
// Uso:
//   createSlider({
//     itemSel:      '.slider-item',       // slides
//     dotSel:       '.dot',               // dots de navegación
//     prevSel:      '.slider-arrow.prev',
//     nextSel:      '.slider-arrow.next',
//     containerSel: '.slider',            // elemento que recibe el swipe táctil
//     interval:     8000,                // ms entre avances automáticos (0 = sin auto-play)
//   });

export function createSlider({
  itemSel,
  dotSel,
  prevSel,
  nextSel,
  containerSel,
  interval = 8000
}) {
  const items = document.querySelectorAll(itemSel)
  if (!items.length) return

  const dots = document.querySelectorAll(dotSel)
  const btnPrev = document.querySelector(prevSel)
  const btnNext = document.querySelector(nextSel)
  const container = document.querySelector(containerSel)
  let current = 0
  let timer
  let touchStartX = 0

  // Calcular la altura máxima de todos los slides y fijarla en el contenedor.
  // Se usa visibility:hidden temporalmente para medir sin afectar el layout visible.
  // Esto evita que el contenedor cambie de altura al cambiar de slide.
  function fixContainerHeight() {
    const track = items[0]?.parentElement
    if (!track) return
    const prevVisibility = track.style.visibility
    track.style.visibility = 'hidden'
    items.forEach((item) => item.classList.add('active'))
    const maxH = Math.max(...[...items].map((el) => el.offsetHeight))
    items.forEach((item) => item.classList.remove('active'))
    track.style.visibility = prevVisibility
    if (maxH > 0) track.style.minHeight = maxH + 'px'
  }

  function goTo(index) {
    items[current].classList.remove('active')
    dots[current]?.classList.remove('active')
    current = (index + items.length) % items.length
    items[current].classList.add('active')
    dots[current]?.classList.add('active')
  }

  function startTimer() {
    if (!interval) return
    clearInterval(timer)
    timer = setInterval(() => goTo(current + 1), interval)
  }

  fixContainerHeight()
  goTo(0)
  startTimer()

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i)
      startTimer()
    })
  })

  btnPrev?.addEventListener('click', () => {
    goTo(current - 1)
    startTimer()
  })
  btnNext?.addEventListener('click', () => {
    goTo(current + 1)
    startTimer()
  })

  container?.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.touches[0].clientX
    },
    { passive: true }
  )

  container?.addEventListener(
    'touchend',
    (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1)
        startTimer()
      }
    },
    { passive: true }
  )
}
