import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import VueSocketIO from 'vue-socket.io'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.config.productionTip = false
Vue.use(BootstrapVue);
// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'http://metinseylan.com:1992',
//   vuex: {
//       store,
//       actionPrefix: 'SOCKET_',
//       mutationPrefix: 'SOCKET_'
//   }
// }))
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')