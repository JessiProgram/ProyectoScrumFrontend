import Cookies from 'js-cookie'
const COOKIE_NAME = '__session'

export default {
    namespaced: true,
    state: {
        idToken: '',
        tokenExpirado: false,
        datosUsuario: null,
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
    },
    actions: {
        login: async ({commit}, data) => {
            const { idToken } = data

            // Set IdToken
            commit('setIdToken', idToken)

            // Solicitar informacion al backend
            const datosUsuario = null
            
            // Set usuario
            commit('setDatosUsuario', datosUsuario)
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