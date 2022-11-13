import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSessionStorage from "vue-sessionstorage";



createApp(App).use(store).use(VueSessionStorage).use(router).mount('#app')
