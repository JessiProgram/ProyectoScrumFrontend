import Vue from 'vue'
import VueRouter from 'vue-router'
import autenticado from '@/middlewares/autenticado'
import noAutenticado from '@/middlewares/noAutenticado'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home1',
    meta: {
      middleware: noAutenticado
    },
    component: () => import('../views/index.vue')
  },
  {
    path: '/inicio',
    name: 'home2',
    meta: {
      middleware: autenticado
    },
    component: () => import('../views/inicio.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
