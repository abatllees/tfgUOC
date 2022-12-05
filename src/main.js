import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vue3EasyDataTable from 'vue3-easy-data-table';
import "vue3-easy-data-table/dist/style.css"

import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faPlaneArrival, faPlaneDeparture, faUserSecret } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret)
library.add(faPlaneDeparture)
library.add(faPlaneArrival)


createApp(App)
    .use(store).use(router).use(LoadingPlugin)
    .component('font-awesome-icon', FontAwesomeIcon).component('EasyDataTable', Vue3EasyDataTable)
    .mount('#app')
