import Vue from 'vue'
import VueRouter from 'vue-router'

import Groups from '@/views/Groups.vue'
import Restrictions from '@/views/Restrictions.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Groups',
    component: Groups
  },

  {
    path: '/restrictions',
    name: 'Restrictions',
    component: Restrictions
  }
]

const router = new VueRouter({
  routes
})

export default router
