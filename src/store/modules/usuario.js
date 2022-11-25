import Cookies from 'js-cookie'
import store from '..'
import axios from '../../plugins/axios'


const COOKIE_NAME = '__session'

export default {
    namespaced: true,
    state: {
        idToken: '',
        tokenExpirado: false,
        datosUsuario: null,
        rolesUsuario: [],
        permisosUsuario: [],
        proyectoID: -1,
        permisosProyecto: [],
        participante: null,
    },
    getters: {
        getIdToken (state) {
            return state.idToken
        },
        getTokenExpirado (state) {
            return state.tokenExpirado
        },
        getDatosUsuario (state) {
            return state.datosUsuario
        },
        getPermisosUsuario (state) {
            return state.permisosUsuario
        },
        getRolesUsuario (state) {
            return state.rolesUsuario
        },
        getProyectoID (state) {
            return state.proyectoID
        },
        getPermisosProyecto(state) {
            return state.permisosProyecto
        },
        getParticipante(state) {
            return state.participante
        },
        
        // OTROS
        estaAutenticado (state) {
            return !!state.idToken.length
        },
        esAdministrador (state) {
            const roles_admin = [
                'crear_rol_externo',
                'actualizar_rol_externo',
                'borrar_rol_externo',
                'modificar_roles_externos_de_usuario',
                'crear_proyecto',
            ]

            let tieneAlgunRol = false
            for (let i = 0; i < roles_admin.length; i++) {
                const rol_admin = roles_admin[i]
                if (state.permisosUsuario.includes(rol_admin)) {
                    tieneAlgunRol = true
                    break
                }
            }

            return tieneAlgunRol
        }
    },
    mutations: {
        setIdToken (state, idToken) {
            const cookie = idToken ? idToken : ''

            Cookies.set(COOKIE_NAME, cookie)
            state.idToken = cookie
        },
        setTokenExpirado (state, tokenExpirado) {
            state.tokenExpirado = tokenExpirado
        },
        setDatosUsuario (state, datosUsuario) {
            state.datosUsuario = datosUsuario ? datosUsuario : null
        },
        setRolesUsuario (state, rolesUsuario) {
            state.rolesUsuario = rolesUsuario ? rolesUsuario : null
        },
        setPermisosUsuario (state, permisosUsuario) {
            state.permisosUsuario = permisosUsuario ? permisosUsuario : null
        },
        setProyectoID (state, proyectoID) {
            state.proyectoID = proyectoID ? proyectoID : null
        },
        setPermisosProyecto (state, permisosProyecto) {
            state.permisosProyecto = permisosProyecto ? permisosProyecto : null
        },
        setParticipante(state, participante) {
            state.participante = participante ? participante : null
        },
    },
    actions: {
        login: async ({commit}, data) => {
            const { idToken } = data

            // Set IdToken
            commit('setIdToken', idToken)

            // Configuracion de headers para la api
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }
            
            
            // Datos del body para la api
            let body = {}
            
            /**
             * Crea el usuario y retorna el mismo si no existe,
             * Retorna el usuario si existe.
             */
            const response1 = await axios.post('/usuario/', body, config)
            const datosUsuarioModelo = response1.data[0].fields

            
            /**
             * Obtenemos la lista de roles del usuario 
             */
            let roles = []
            const response2 = await axios.get('/rol/usuario', config)
            roles = response2.data
            commit('setRolesUsuario', roles)


            /**
             * Obtenemos la lista de permisos del usuario
             */
            let permisos = []
            for (let i = 0; i < roles.length; i++) {
                const idGrupo = roles[i];
                // Llamamos al backend
                const resPermisos = await axios.get(`/rol/?id=${idGrupo}&tipo=Externo`, config)
                const permisosModelo = resPermisos.data

                for (let j = 1; j < permisosModelo.length; j++) {
                    const permiso = permisosModelo[j];
                    permisos.push(permiso.fields.codename)
                }

            }

            commit('setPermisosUsuario', permisos)
            
            // Set usuario
            commit('setDatosUsuario', datosUsuarioModelo)

        },

        logout: async ({commit}, data) => {
            // Token
            commit('setIdToken', '')

            // Usuario
            commit('setDatosUsuario', null)

            commit('setPermisosUsuario', [])

            commit('setRolesUsuario', [])

            commit('setProyectoID', -1)

            commit('setPermisosProyecto', [])

            commit('setParticipante', null)


        },
        updateToken: async ({commit}, data) => {
            
        },
    },
}