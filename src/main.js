import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './Route/Route.js'
import { initSessionObserver } from './composables/useSession'

initSessionObserver()

createApp(App)
  .use(router)
  .mount('#app')