import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/router-middleware'
import './plugins/axios'

// Plugins
import login from './helpers/login'

// CSS
import './assets/css/tiposDeLetras.css'

Vue.config.productionTip = false

login()
.then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')

  store.commit('setLoading', false)
})