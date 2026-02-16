import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import Pixelium from '@pixelium/web-vue'
import '@pixelium/web-vue/dist/pixelium-vue.css'
import '@pixelium/web-vue/dist/font.css'
import '@pixelium/web-vue/dist/normalize.css'
import App from './App.vue'
import i18n from './i18n'

// Prevent pinch/double-tap zoom
function preventZoom(e: Event) {
  e.preventDefault()
}
document.addEventListener('gesturestart', preventZoom, { passive: false })
document.addEventListener('gesturechange', preventZoom, { passive: false })
document.addEventListener('gestureend', preventZoom, { passive: false })

// Prevent pinch zoom on Android (2+ fingers)
document.addEventListener(
  'touchmove',
  (e) => {
    if (e.touches.length > 1) e.preventDefault()
  },
  { passive: false }
)

const pinia = createPinia()

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: App },
  ],
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(Pixelium)
app.use(i18n)
app.mount('#app')
