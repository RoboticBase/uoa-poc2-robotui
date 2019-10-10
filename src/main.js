import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import Initial from '@/views/Initial.vue'
import StandBy from '@/views/StandBy.vue'
import Moving from '@/views/Moving.vue'
import Picking from '@/views/Picking.vue'
import Delivering from '@/views/Delivering.vue'

Vue.config.productionTip = false
Vue.component('initial', Initial)
Vue.component('standby', StandBy)
Vue.component('moving', Moving)
Vue.component('picking', Picking)
Vue.component('delivering', Delivering)

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate () {
    this.$store.commit('load')
  }
}).$mount('#app')
