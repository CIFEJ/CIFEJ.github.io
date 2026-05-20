import { initPage } from './main.js'

initPage()

// Selector directo sobre .accordion-header — el <div> wrapper del accordion
// no necesita clase propia (se eliminó .accordion-faq en Beta 10).
const headers = document.querySelectorAll('.accordion-header')

headers.forEach((header) => {
  header.addEventListener('click', function () {
    const content = this.nextElementSibling
    const icon = this.querySelector('.accordion-icon')
    const isOpen = !!content.style.maxHeight

    // Cerrar TODOS primero — este era el bug original
    headers.forEach((h) => {
      h.nextElementSibling.style.maxHeight = null
      h.setAttribute('aria-expanded', 'false')
      const ic = h.querySelector('.accordion-icon')
      if (ic) ic.textContent = '+'
    })

    // Abrir el clickeado solo si estaba cerrado
    if (!isOpen) {
      content.style.maxHeight = content.scrollHeight + 'px'
      this.setAttribute('aria-expanded', 'true')
      if (icon) icon.textContent = '−'
    }
  })
})
