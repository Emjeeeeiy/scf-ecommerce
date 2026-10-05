import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './Route/Route.js'
import { initSessionObserver } from './composables/useSession'
import { initLenis } from './utils/lenis'

initSessionObserver()
initLenis()

createApp(App)
  .use(router)
  .mount('#app')