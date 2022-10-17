import Vue from 'vue'
import Vuex from 'vuex'

import usuario from '@/store/modules/usuario'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
  },
  getters: {
    getLoading (state) {
      return state.loading
    }
  },
  mutations: {
    setLoading (state, loading) {
      state.loading = loading
    }
  },
  actions: {
  },
  modules: {
    usuario
  }
})
