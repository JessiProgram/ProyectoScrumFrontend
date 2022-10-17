import store from '../store'

import Cookies from 'js-cookie'
const COOKIE_NAME = '__session'

async function login () {
    store.commit('setLoading', true)

    const idToken = Cookies.get(COOKIE_NAME)
    
    try {
        await store.dispatch('usuario/login', {idToken})
    } catch (error) {
        // Si el token esta expirado
        store.commit('usuario/setTokenExpirado', true)
    }
}

export default login