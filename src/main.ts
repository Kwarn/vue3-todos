import pinia from './plugins/piniaPersist'
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './assets/tailwind.css'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
