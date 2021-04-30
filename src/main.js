import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/core/use'
import '@/styles/index.scss'
import initialApp from '@/core/initApp'

Vue.config.productionTip = false

initialApp()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
