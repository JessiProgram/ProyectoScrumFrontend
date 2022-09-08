import Vue from 'vue'
import VueRouter from 'vue-router'
import autenticado from '@/middlewares/autenticado'
import noAutenticado from '@/middlewares/noAutenticado'

import routerAdmin from './helpers/admin.js'

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
  {
    path: '/proyectos',
    name: 'home3',
    meta: {
      middleware: autenticado
    },
    component: () => import('../views/proyectos.vue')
  },
  {
    path: '/proyecto/:idProyecto', 
    name: 'proyecto',
    meta: {
      middleware: autenticado
    },
    component: () => import('../views/proyecto/_idProyecto.vue')
  },
  {
    path: '/proyecto/:idProyecto/configuracion', 
    name: 'configuracion',
    meta: {
      middleware: autenticado
    },
    component: () => import('../views/proyecto/configuracion.vue')
  },
  {
    path: '/proyecto/:idProyecto/participantes', 
    name: 'participantes',
    meta: {
      middleware: autenticado
    },
    component: () => import('../views/proyecto/participantes.vue')
  },
  {
    path: '/proyecto/:idProyecto/roles-internos', 
    name: 'rolesInternos',
    meta: {
      middleware: autenticado
    },
    component: () => import('../views/proyecto/rolesInternos.vue')
  },
  {
    path: '/proyecto/:idProyecto/tipo-historias-usuarios', 
    name: 'tipoHistoriasUsuario',
    meta: {
      middleware: autenticado
    },
    component: () => import('../views/proyecto/tipoHistoriasUsuario.vue')
  },
  ...routerAdmin,
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
