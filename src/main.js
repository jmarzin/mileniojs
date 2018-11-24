import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMale, faArrowRight, faArrowUp, faArrowDown, faTrash, faPen , faAnchor, faCheck, faPhone, faEnvelopeOpen, faClock,
faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faLinkedin, faTwitterSquare, faGooglePlusSquare} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faPlus, faMale, faArrowRight, faArrowUp, faArrowDown, faTrash, faPen, faAnchor, faCheck, faPhone, faEnvelopeOpen, faClock,
    faMapMarkerAlt, faFacebook, faLinkedin, faTwitterSquare, faGooglePlusSquare);

Vue.component('font-awesome-icon', FontAwesomeIcon);

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
