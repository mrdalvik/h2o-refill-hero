import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Pixelium from '@pixelium/web-vue'
import '@pixelium/web-vue/dist/pixelium-vue.css'
import '@pixelium/web-vue/dist/font.css'
import '@pixelium/web-vue/dist/normalize.css'
import App from './App.vue'
import i18n from './i18n'
import { setupZoomPrevention } from './utils/preventZoom'

setupZoomPrevention()

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(Pixelium)
app.use(i18n)
app.mount('#app')
