import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    rolldownOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        nosotros: resolve(__dirname, 'nosotros.html'),
        servicios: resolve(__dirname, 'servicios.html'),
        galeria: resolve(__dirname, 'galeria.html'),
        contacto: resolve(__dirname, 'contacto.html'),
        404: resolve(__dirname, '404.html'),
      }
    }
  }
})
