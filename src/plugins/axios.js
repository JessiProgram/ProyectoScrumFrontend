import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import api from '../configs/api'

axios.defaults.baseURL = api.url

Vue.use(VueAxios, axios)

export default axios