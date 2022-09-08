import Cookies from 'js-cookie'
import axios from '../../plugins/axios'


const COOKIE_NAME = '__session'

export default {
    namespaced: true,
    state: {
        idToken: '',
        tokenExpirado: false,
        datosUsuario: null,
        rolesUsuario: [],
        permisosUsuario: []
        
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
        
        // OTROS
        estaAutenticado (state) {
            return !!state.idToken.length
        },
        esAdministrador (state) {
            const roles_admin = [
                'modificar_roles_externos_de_usuario',
                'crear_rol_externo',
                'listar_roles_externos',
                'actualizar_rol_externo',
                'borrar_rol_externo',
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
            const response1 = await axios.post('/usuario', body, config)
            const datosUsuarioModelo = response1.data[0].fields
            console.log('datosUsuarioModelo',datosUsuarioModelo)

            
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
                const resPermisos = await axios.get(`/rol?id=${idGrupo}`, config)
                const permisosModelo = resPermisos.data

                console.log('resPermisos',resPermisos)

                for (let j = 1; j < permisosModelo.length; j++) {
                    const permiso = permisosModelo[j];
                    permisos.push(permiso.fields.codename)
                }

            }

            
            console.log('permisos',permisos)

            commit('setPermisosUsuario', permisos)

            console.log('permisos',permisos)
            
            // Set usuario
            commit('setDatosUsuario', datosUsuarioModelo)

        },
        logout: async ({commit}, data) => {
            // Token
            commit('setIdToken', '')

            // Usuario
            commit('setDatosUsuario', null)
        },
        updateToken: async ({commit}, data) => {
            
        },
    },
}