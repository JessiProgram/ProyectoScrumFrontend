import esAdmin from "../../middlewares/esAdmin"

const rutas = []

// Normal
rutas.push({
    path: '/administracion',
    name: 'administracion',
    meta: {
        middleware: esAdmin,
    },
    component: () => import('@/views/administracion/index.vue')
})

// Usuarios
rutas.push({
    path: '/administracion/usuarios',
    name: 'administracion_usuarios',
    meta: {
        middleware: esAdmin,
    },
    component: () => import('@/views/administracion/usuarios.vue')
})

// Roles
rutas.push({
    path: '/administracion/roles',
    name: 'administracion_roles',
    meta: {
        middleware: esAdmin,
    },
    component: () => import('@/views/administracion/roles.vue')
})

// Crear proyecto
rutas.push({
    path: '/administracion/proyectos',
    name: 'administracion_proyectos',
    meta: {
        middleware: esAdmin,
    },
    component: () => import('@/views/administracion/proyectos.vue')
})

export default rutas