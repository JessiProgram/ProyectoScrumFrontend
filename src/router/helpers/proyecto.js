import esParticipante from "@/middlewares/esParticipante"
import esScrumMaster from "@/middlewares/esScrumMaster"
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
            middleware: esParticipante, 
        },
        component: () => import('@/views/proyecto/_idProyecto.vue')
    },
    {
        path: '/proyecto/:idProyecto/configuracion', 
        name: 'configuracion',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/configuracion.vue')
    },
    {
        path: '/proyecto/:idProyecto/participantes', 
        name: 'participantes',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/participantes.vue')
    },
    {
        path: '/proyecto/:idProyecto/roles-internos', 
        name: 'rolesInternos',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/roles-internos.vue')
    },
    {
        path: '/proyecto/:idProyecto/product-backlog', 
        name: 'productBacklog',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/product-backlog.vue')
    },
    {
        path: '/proyecto/:idProyecto/product-backlog/:idHistoria', 
        name: 'historia',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/Historia.vue')
    },
    {
        path: '/proyecto/:idProyecto/tipo-historias-usuarios', 
        name: 'tipoHistoriasUsuario',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/tipo-historias-usuarios/tipo-historias-usuarios.vue')
    },
    {
        path: '/proyecto/:idProyecto/sprints', 
        name: 'sprints',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/sprints/sprints.vue')
    },
    {
        path: '/proyecto/:idProyecto/reportes', 
        name: 'reportes',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/reportes.vue')
    },
    {
        path: '/proyecto/:idProyecto/actividades/:idHistoria', 
        name: 'actividades',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/actividades.vue')
    },
    {
        path: '/proyecto/:idProyecto/historial/:idHistoria', 
        name: 'historial',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/historialHistoria.vue')
    },
    {
        path: '/proyecto/:idProyecto/release', 
        name: 'release',
        meta: {
            middleware: esScrumMaster
        },
        component: () => import('@/views/proyecto/_idProyecto/release.vue')
    },
    {
        path: '/proyecto/:idProyecto/sprints/:idSprint', 
        name: 'nuevoSprint',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/sprints/_idSprint.vue')
    },
    {
        path: '/proyecto/:idProyecto/sprints/:idSprint/tableros', 
        name: 'tableros',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/sprints/tableros.vue')
    },
    {
        path: '/proyecto/:idProyecto/sprints/:idSprint/sprint-backlog', 
        name: 'sprintBacklog',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/sprints/sprint-backlog.vue')
    },
    {
        path: '/proyecto/:idProyecto/sprints/:idSprint/tableros/:idTipoHU', 
        name: 'tipoHUSprint',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/sprints/_idTipoHU.vue')
    },
    {
        path: '/proyecto/:idProyecto/tipo-historias-usuarios/:idTipoHU', 
        name: 'tipoHistoriasUsuario',
        meta: {
            middleware: esParticipante
        },
        component: () => import('@/views/proyecto/_idProyecto/tipo-historias-usuarios/_id-tipo-historias-usuarios.vue')
    },
]

export default rutas