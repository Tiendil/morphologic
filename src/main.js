import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueGtag from "vue-gtag";


Vue.use(VueGtag, {config: { id: "UA-10915391-7" },
                  appName: 'Morphologic',
                  pageTrackerScreenviewEnabled: true,
                  enabled: (process.env.NODE_ENV  == 'production')}, router);

Vue.config.productionTip = false


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
