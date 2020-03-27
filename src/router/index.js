import Vue from 'vue'
import VueRouter from 'vue-router'

import Groups from '@/views/Groups.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Groups',
    component: Groups
  }
]

const router = new VueRouter({
  routes
})

export default router
