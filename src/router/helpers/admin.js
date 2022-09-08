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

rutas.push({
    path: '/administracion/usuario/:correo',
    name: 'administracion_usuarios-correo',
    meta: {
        middleware: esAdmin,
    },
    component: () => import('@/views/administracion/usuario/_correo.vue')
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

rutas.push({
    path: '/administracion/rol/:idRol',
    name: 'administracion_rol-idRol',
    meta: {
        middleware: esAdmin,
    },
    component: () => import('@/views/administracion/rol/_idRol.vue')
})

// // Crear proyecto
// rutas.push({
//     path: '/administracion/proyecto',
//     name: 'administracion_proyecto',
//     meta: {
//         middleware: esAdmin,
//     },
//     component: () => import('@/views/administracion/index.vue')
// })

export default rutas