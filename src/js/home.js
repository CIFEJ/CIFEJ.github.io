import { initPage } from './main.js'
import { createSlider } from './slider.js'

initPage()

createSlider({
  itemSel: '.carousel-slide',
  dotSel: '.carousel-dot',
  prevSel: '.carousel-arrow.prev',
  nextSel: '.carousel-arrow.next',
  containerSel: '.carousel-container',
  interval: 8000
})
