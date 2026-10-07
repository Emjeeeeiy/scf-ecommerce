import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './Route/Route.js'
import { initSessionObserver } from './composables/useSession'
import { initLenis } from './utils/lenis'
import { registerSW } from 'virtual:pwa-register'

initSessionObserver()
initLenis()
// Install/update the PWA service worker (src/sw.js via injectManifest).
registerSW({ immediate: true })

createApp(App)
  .use(router)
  .mount('#app')