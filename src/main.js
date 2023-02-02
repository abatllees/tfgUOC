import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import Vue3EasyDataTable from 'vue3-easy-data-table';
import "vue3-easy-data-table/dist/style.css"

import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

import VueGtag from "vue-gtag";


/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

createApp(App)
    .use(store).use(router).use(LoadingPlugin).use(VueGtag, {
        config: {
            id: "G-BGG9JDBJWE",
            router
        }
    })
    .component('font-awesome-icon', FontAwesomeIcon).component('EasyDataTable', Vue3EasyDataTable)
    .mount('#app')