import { initPage } from './main.js'
import { createSlider } from './slider.js'

initPage()

createSlider({
  itemSel: '.slider-item',
  dotSel: '.dot',
  prevSel: '.slider-arrow.prev',
  nextSel: '.slider-arrow.next',
  containerSel: '.slider',
  interval: 8000
})
