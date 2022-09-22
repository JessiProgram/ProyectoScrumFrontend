import autenticado from "../../middlewares/autenticado"

const rutas = [
    {
        path: '/proyectos',
        name: 'home3',
        meta: {
            middleware: autenticado
        },
        component: () => import('@/views/proyectos.vue')
    },
    {
        path: '/proyecto/:idProyecto', 
        name: 'proyecto',
        meta: {
            middleware: autenticado
        },
        component: () => import('@/views/proyecto/_idProyecto.vue')
    },
    {
        path: '/proyecto/:idProyecto/configuracion', 
        name: 'configuracion',
        meta: {
            middleware: autenticado
        },
        component: () => import('@/views/proyecto/_idProyecto/configuracion.vue')
    },
    {
        path: '/proyecto/:idProyecto/participantes', 
        name: 'participantes',
        meta: {
            middleware: autenticado
        },
        component: () => import('@/views/proyecto/_idProyecto/participantes.vue')
    },
    {
        path: '/proyecto/:idProyecto/roles-internos', 
        name: 'rolesInternos',
        meta: {
            middleware: autenticado
        },
        component: () => import('@/views/proyecto/_idProyecto/roles-internos.vue')
    },
    {
        path: '/proyecto/:idProyecto/tipo-historias-usuarios', 
        name: 'tipoHistoriasUsuario',
        meta: {
            middleware: autenticado
        },
        component: () => import('@/views/proyecto/_idProyecto/tipo-historias-usuarios/tipo-historias-usuarios.vue')
    },
    {
        path: '/proyecto/:idProyecto/tipo-historias-usuarios/:idTipoHU', 
        name: 'tipoHistoriasUsuario',
        meta: {
            middleware: autenticado
        },
        component: () => import('@/views/proyecto/_idProyecto/tipo-historias-usuarios/_id-tipo-historias-usuarios.vue')
    },
]

export default rutas