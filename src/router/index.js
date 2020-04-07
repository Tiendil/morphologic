import Vue from 'vue'
import VueRouter from 'vue-router'

import Groups from '@/views/Groups.vue'
import Rules from '@/views/Rules.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Groups',
    component: Groups
  },

  {
    path: '/rules',
    name: 'Rules',
    component: Rules
  }
]

const router = new VueRouter({
  routes
})

export default router
