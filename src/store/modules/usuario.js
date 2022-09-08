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
        getPermisosUsuario () {
            return state.permisosUsuario
        },
        getRolesUsuario (state) {
            return state.rolesUsuario
        },
        estaAutenticado (state) {
            return !!state.idToken.length
        },
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

            // Llamamos al backend
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            let body = {}

            let res = await axios.post('/usuario', body, config)
            const datosUsuarioModelo = res.data[0].fields

            console.log('datosUsuarioModelo',datosUsuarioModelo)

            // obtener la lista de roles del usuario

            let roles = []

            config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            res = await axios.get('/rol/usuario', config)

            console.log("roles", res)

            roles = res.data

            commit('setRolesUsuario', roles)


            // obtener los permisos de los roles

            let permisos = []

            for (let i = 0; i < roles.length; i++) {
                const idGrupo = roles[i];
                // Llamamos al backend
                config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}` 
                    }
                }

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

            commit('setPermisosUsuario', [])

            commit('setRolesUsuario', [])


        },
        updateToken: async ({commit}, data) => {
            
        },
    },
}